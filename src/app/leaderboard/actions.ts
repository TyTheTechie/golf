"use server";

import { calculateLeaderboard, LeaderboardEntry } from "@/lib/scoring";

export async function getLeaderboardData(): Promise<LeaderboardEntry[]> {
  return calculateLeaderboard();
}
