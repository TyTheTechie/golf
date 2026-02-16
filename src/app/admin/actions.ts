"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sseManager } from "@/lib/sse-manager";
import { z } from "zod/v4";
import { getEventAccessCode, setEventAccessCode } from "@/lib/access-code";
import { sendEmail } from "@/lib/email";
import { auctionWinnerEmail } from "@/lib/email-templates";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

// Auction item management
const auctionItemSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  startingBid: z.number().min(100),
  bidIncrement: z.number().min(100),
  endTime: z.string().optional(),
});

export async function createAuctionItem(input: {
  title: string;
  description: string;
  startingBid: number;
  bidIncrement: number;
  endTime?: string;
}) {
  await requireAdmin();

  const parsed = auctionItemSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const item = await prisma.auctionItem.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      startingBid: parsed.data.startingBid,
      bidIncrement: parsed.data.bidIncrement,
      endTime: parsed.data.endTime ? new Date(parsed.data.endTime) : null,
    },
  });

  return { item };
}

export async function getAuctionItemForEdit(itemId: string) {
  await requireAdmin();

  const item = await prisma.auctionItem.findUnique({
    where: { id: itemId },
  });

  if (!item) return { error: "Item not found" };
  return { item };
}

export async function updateAuctionItem(
  itemId: string,
  input: {
    title: string;
    description: string;
    startingBid: number;
    bidIncrement: number;
    endTime?: string;
  }
) {
  await requireAdmin();

  const parsed = auctionItemSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const item = await prisma.auctionItem.update({
    where: { id: itemId },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      startingBid: parsed.data.startingBid,
      bidIncrement: parsed.data.bidIncrement,
      endTime: parsed.data.endTime ? new Date(parsed.data.endTime) : null,
    },
  });

  return { item };
}

export async function updateAuctionItemStatus(
  itemId: string,
  status: "draft" | "active" | "completed" | "cancelled"
) {
  await requireAdmin();

  const item = await prisma.auctionItem.update({
    where: { id: itemId },
    data: { status },
  });

  if (status === "active") {
    sseManager.broadcast("auction-started", {
      auctionItemId: item.id,
      title: item.title,
    });
  } else if (status === "completed") {
    // Determine winner
    const highestBid = await prisma.bid.findFirst({
      where: { auctionItemId: itemId },
      orderBy: { amount: "desc" },
    });

    if (highestBid) {
      await prisma.auctionItem.update({
        where: { id: itemId },
        data: { winnerId: highestBid.userId },
      });

      // Fire-and-forget winner email
      const winner = await prisma.user.findUnique({
        where: { id: highestBid.userId },
        select: { email: true },
      });
      if (winner?.email) {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const emailTemplate = auctionWinnerEmail({
          itemTitle: item.title,
          winningBid: highestBid.amount,
          itemUrl: `${baseUrl}/auction/${itemId}`,
        });
        sendEmail({ to: winner.email, ...emailTemplate });
      }
    }

    sseManager.broadcast("auction-ended", {
      auctionItemId: item.id,
      title: item.title,
    });
  }

  return { item };
}

export async function promoteToAdmin(userId: string) {
  await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: { role: "admin" },
  });

  return { success: true };
}

export async function demoteFromAdmin(userId: string) {
  await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: { role: "user" },
  });

  return { success: true };
}

// Event access code management
export async function fetchEventAccessCode() {
  await requireAdmin();
  return { code: await getEventAccessCode() };
}

export async function updateEventAccessCode(code: string) {
  await requireAdmin();
  const trimmed = code.trim();
  if (trimmed.length < 3) {
    return { error: "Access code must be at least 3 characters" };
  }
  await setEventAccessCode(trimmed);
  return { success: true };
}

export async function updateMaxRegistrations(value: string) {
  await requireAdmin();
  const num = parseInt(value);
  if (isNaN(num) || num < 0) return { error: "Must be a non-negative number" };
  await prisma.siteSetting.upsert({
    where: { key: "MAX_REGISTRATIONS" },
    update: { value: num.toString() },
    create: { key: "MAX_REGISTRATIONS", value: num.toString() },
  });
  return { success: true };
}

// Delete actions
export async function deleteRegistration(id: string) {
  await requireAdmin();
  await prisma.teamJoinRequest.deleteMany({ where: { registrationId: id } });
  await prisma.golferRegistration.delete({ where: { id } });
  return { success: true };
}

export async function deleteSponsor(id: string) {
  await requireAdmin();
  await prisma.sponsorRegistration.delete({ where: { id } });
  return { success: true };
}

export async function deleteAuctionItem(id: string) {
  await requireAdmin();
  await prisma.auctionFavorite.deleteMany({ where: { auctionItemId: id } });
  await prisma.bid.deleteMany({ where: { auctionItemId: id } });
  await prisma.auctionItem.delete({ where: { id } });
  return { success: true };
}

export async function deleteDonation(id: string) {
  await requireAdmin();
  await prisma.donation.delete({ where: { id } });
  return { success: true };
}

// Dashboard stats
export async function getDashboardStats() {
  await requireAdmin();

  const [
    golferCount,
    sponsorCount,
    activeAuctions,
    golferRevenue,
    sponsorRevenue,
    donationRevenue,
    userCount,
    donationCount,
  ] = await Promise.all([
    prisma.golferRegistration.count({ where: { paymentStatus: "completed" } }),
    prisma.sponsorRegistration.count({ where: { paymentStatus: "completed" } }),
    prisma.auctionItem.count({ where: { status: "active" } }),
    prisma.golferRegistration.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: "completed" },
    }),
    prisma.sponsorRegistration.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: "completed" },
    }),
    prisma.donation.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: "completed" },
    }),
    prisma.user.count(),
    prisma.donation.count({ where: { paymentStatus: "completed" } }),
  ]);

  return {
    golferCount,
    sponsorCount,
    activeAuctions,
    totalRevenue:
      (golferRevenue._sum.amount || 0) + (sponsorRevenue._sum.amount || 0) + (donationRevenue._sum.amount || 0),
    userCount,
    donationCount,
  };
}
