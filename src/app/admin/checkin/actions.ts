"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
}

export async function checkInRegistration(id: string) {
  await requireAdmin();

  const reg = await prisma.golferRegistration.findUnique({ where: { id } });
  if (!reg) return { error: "Registration not found" };
  if (reg.checkedIn) return { error: "Already checked in" };

  await prisma.golferRegistration.update({
    where: { id },
    data: { checkedIn: true, checkedInAt: new Date() },
  });

  return { success: true, playerName: reg.player1Name };
}

export async function getCheckInStats() {
  const total = await prisma.golferRegistration.count({ where: { paymentStatus: "completed" } });
  const checkedIn = await prisma.golferRegistration.count({ where: { checkedIn: true } });
  const recent = await prisma.golferRegistration.findMany({
    where: { checkedIn: true },
    orderBy: { checkedInAt: "desc" },
    take: 20,
    select: { id: true, player1Name: true, teamName: true, type: true, checkedInAt: true },
  });
  return { total, checkedIn, recent };
}
