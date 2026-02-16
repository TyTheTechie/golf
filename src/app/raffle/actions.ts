"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user as { id: string; email: string; name: string };
}

export async function getRafflePrizes() {
  return prisma.rafflePrize.findMany({
    include: { ticket: { include: { user: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyTickets() {
  const user = await requireUser();
  return prisma.raffleTicket.findMany({
    where: { userId: user.id },
    orderBy: { number: "asc" },
    include: { wonPrize: true },
  });
}

export async function purchaseTickets(count: number): Promise<{ success?: boolean; error?: string }> {
  const user = await requireUser();

  if (count < 1 || count > 20) return { error: "Buy between 1 and 20 tickets" };

  // Get the next ticket number
  const lastTicket = await prisma.raffleTicket.findFirst({ orderBy: { number: "desc" } });
  const startNumber = (lastTicket?.number ?? 0) + 1;

  // Create tickets
  for (let i = 0; i < count; i++) {
    await prisma.raffleTicket.create({
      data: {
        number: startNumber + i,
        userId: user.id,
        status: "sold",
        price: 500,
      },
    });
  }

  return { success: true };
}
