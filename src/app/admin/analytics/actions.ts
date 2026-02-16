"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
}

export async function getRegistrationTrend(days: number = 30) {
  await requireAdmin();

  const since = new Date();
  since.setDate(since.getDate() - days);

  const registrations = await prisma.golferRegistration.findMany({
    where: { createdAt: { gte: since }, paymentStatus: "completed" },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const grouped: Record<string, number> = {};
  for (const r of registrations) {
    const date = r.createdAt.toISOString().split("T")[0];
    grouped[date] = (grouped[date] || 0) + 1;
  }

  return Object.entries(grouped).map(([date, count]) => ({ date, count }));
}

export async function getRevenueBreakdown() {
  await requireAdmin();

  const [golfer, sponsor, donation, raffle] = await Promise.all([
    prisma.golferRegistration.aggregate({ _sum: { amount: true }, where: { paymentStatus: "completed" } }),
    prisma.sponsorRegistration.aggregate({ _sum: { amount: true }, where: { paymentStatus: "completed" } }),
    prisma.donation.aggregate({ _sum: { amount: true }, where: { paymentStatus: "completed" } }),
    prisma.raffleTicket.count({ where: { status: "sold" } }),
  ]);

  return [
    { name: "Golfer Registrations", value: golfer._sum.amount || 0 },
    { name: "Sponsorships", value: sponsor._sum.amount || 0 },
    { name: "Donations", value: donation._sum.amount || 0 },
    { name: "Raffle Tickets", value: raffle * 500 },
  ];
}

export async function getAuctionPerformance() {
  await requireAdmin();

  const items = await prisma.auctionItem.findMany({
    where: { status: { in: ["active", "completed"] } },
    include: { _count: { select: { bids: true } } },
    orderBy: { currentBid: "desc" },
    take: 10,
  });

  return items.map((item) => ({
    name: item.title.length > 20 ? item.title.slice(0, 20) + "..." : item.title,
    bids: item._count.bids,
    revenue: item.currentBid,
  }));
}
