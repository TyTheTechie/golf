"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sseManager } from "@/lib/sse-manager";
import { sendEmail } from "@/lib/email";
import { outbidNotificationEmail } from "@/lib/email-templates";

export async function placeBid(
  auctionItemId: string,
  amount: number
): Promise<{ error?: string; success?: boolean }> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be signed in to bid" };
  }

  // Use a transaction for atomicity
  try {
    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.auctionItem.findUnique({
        where: { id: auctionItemId },
        include: { bids: { orderBy: { amount: "desc" }, take: 1 } },
      });

      if (!item) throw new Error("Auction item not found");
      if (item.status !== "active") throw new Error("This auction is not active");
      if (item.endTime && new Date() > item.endTime)
        throw new Error("This auction has ended");

      const minimumBid = item.currentBid > 0
        ? item.currentBid + item.bidIncrement
        : item.startingBid;

      if (amount < minimumBid) {
        throw new Error(
          `Bid must be at least $${(minimumBid / 100).toFixed(2)}`
        );
      }

      const previousHighBidder = item.bids[0]?.userId;

      const bid = await tx.bid.create({
        data: {
          amount,
          userId: session.user.id,
          auctionItemId,
        },
      });

      await tx.auctionItem.update({
        where: { id: auctionItemId },
        data: { currentBid: amount },
      });

      return { bid, previousHighBidder };
    });

    // Broadcast the new bid to all connected clients
    sseManager.broadcast("bid-update", {
      auctionItemId,
      amount,
      bidderName: session.user.name || "Anonymous",
      bidId: result.bid.id,
      timestamp: result.bid.createdAt.toISOString(),
    });

    // Notify the outbid user
    if (
      result.previousHighBidder &&
      result.previousHighBidder !== session.user.id
    ) {
      const item = await prisma.auctionItem.findUnique({
        where: { id: auctionItemId },
      });
      sseManager.notifyUser(result.previousHighBidder, "outbid", {
        auctionItemId,
        itemTitle: item?.title,
        newAmount: amount,
      });

      // Fire-and-forget outbid email
      const previousUser = await prisma.user.findUnique({
        where: { id: result.previousHighBidder },
        select: { email: true },
      });
      if (previousUser?.email && item) {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const emailTemplate = outbidNotificationEmail({
          itemTitle: item.title,
          newAmount: amount,
          itemUrl: `${baseUrl}/auction/${auctionItemId}`,
        });
        sendEmail({ to: previousUser.email, ...emailTemplate });
      }
    }

    return { success: true };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

export async function getAuctionItems() {
  return prisma.auctionItem.findMany({
    where: { status: "active" },
    include: {
      bids: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { name: true } } },
      },
      _count: { select: { bids: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAuctionItem(id: string) {
  return prisma.auctionItem.findUnique({
    where: { id },
    include: {
      bids: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, id: true } } },
      },
    },
  });
}
