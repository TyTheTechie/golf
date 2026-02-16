"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sseManager } from "@/lib/sse-manager";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
}

export async function getRegistrationsForScoring() {
  return prisma.golferRegistration.findMany({
    where: { paymentStatus: "completed" },
    select: { id: true, player1Name: true, teamName: true, type: true },
    orderBy: { player1Name: "asc" },
  });
}

export async function getScores(registrationId: string) {
  return prisma.score.findMany({
    where: { registrationId },
    orderBy: { hole: "asc" },
  });
}

export async function updateScore(
  registrationId: string,
  hole: number,
  strokes: number
): Promise<{ success?: boolean; error?: string }> {
  await requireAdmin();

  if (hole < 1 || hole > 18) return { error: "Invalid hole number" };
  if (strokes < 1 || strokes > 15) return { error: "Invalid strokes" };

  await prisma.score.upsert({
    where: { registrationId_hole: { registrationId, hole } },
    update: { strokes },
    create: { registrationId, hole, strokes },
  });

  // Broadcast score update for real-time leaderboard
  sseManager.broadcast("score-update", { registrationId, hole, strokes });

  return { success: true };
}
