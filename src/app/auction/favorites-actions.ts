"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function toggleFavorite(auctionItemId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Must be signed in" };

  const existing = await prisma.auctionFavorite.findUnique({
    where: {
      userId_auctionItemId: {
        userId: session.user.id,
        auctionItemId,
      },
    },
  });

  if (existing) {
    await prisma.auctionFavorite.delete({ where: { id: existing.id } });
    return { favorited: false };
  }

  await prisma.auctionFavorite.create({
    data: { userId: session.user.id, auctionItemId },
  });
  return { favorited: true };
}

export async function getMyFavoriteIds(): Promise<string[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const favorites = await prisma.auctionFavorite.findMany({
    where: { userId: session.user.id },
    select: { auctionItemId: true },
  });

  return favorites.map((f) => f.auctionItemId);
}
