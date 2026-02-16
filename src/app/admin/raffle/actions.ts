"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";
import { sendEmail } from "@/lib/email";
import { raffleWinnerEmail } from "@/lib/email-templates";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
}

const prizeSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  imageUrl: z.string().optional(),
});

export async function createPrize(input: { name: string; description: string; imageUrl?: string }) {
  await requireAdmin();
  const parsed = prizeSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.rafflePrize.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      imageUrl: parsed.data.imageUrl || null,
    },
  });
  return { success: true };
}

export async function getRaffleStats() {
  const [totalTickets, soldTickets, prizes] = await Promise.all([
    prisma.raffleTicket.count(),
    prisma.raffleTicket.count({ where: { status: "sold" } }),
    prisma.rafflePrize.findMany({
      include: {
        ticket: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const revenue = soldTickets * 500; // $5 each

  return { totalTickets, soldTickets, revenue, prizes };
}

export async function drawWinner(prizeId: string): Promise<{ success?: boolean; error?: string; winnerName?: string; ticketNumber?: number }> {
  await requireAdmin();

  const prize = await prisma.rafflePrize.findUnique({ where: { id: prizeId } });
  if (!prize) return { error: "Prize not found" };
  if (prize.ticketId) return { error: "Winner already drawn for this prize" };

  // Get all sold tickets that haven't won a prize yet
  const eligibleTickets = await prisma.raffleTicket.findMany({
    where: {
      status: "sold",
      wonPrize: null,
    },
    include: { user: { select: { name: true, email: true } } },
  });

  if (eligibleTickets.length === 0) return { error: "No eligible tickets" };

  // Random draw
  const winner = eligibleTickets[Math.floor(Math.random() * eligibleTickets.length)];

  // Update ticket and prize
  await prisma.$transaction([
    prisma.raffleTicket.update({ where: { id: winner.id }, data: { status: "winner" } }),
    prisma.rafflePrize.update({ where: { id: prizeId }, data: { ticketId: winner.id } }),
  ]);

  // Send email to winner
  if (winner.user?.email) {
    const emailTemplate = raffleWinnerEmail({
      prizeName: prize.name,
      ticketNumber: winner.number,
    });
    sendEmail({ to: winner.user.email, ...emailTemplate });
  }

  return {
    success: true,
    winnerName: winner.user?.name || "Anonymous",
    ticketNumber: winner.number,
  };
}
