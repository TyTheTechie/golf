import { prisma } from "@/lib/prisma";

const PAR = [4, 4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 3, 5, 4, 4, 3, 4, 5]; // standard par 72

export interface LeaderboardEntry {
  registrationId: string;
  teamName: string;
  playerName: string;
  type: string;
  holesPlayed: number;
  totalStrokes: number;
  toPar: number;
  scores: (number | null)[];
}

export async function calculateLeaderboard(): Promise<LeaderboardEntry[]> {
  const registrations = await prisma.golferRegistration.findMany({
    where: { paymentStatus: "completed" },
    include: {
      scores: { orderBy: { hole: "asc" } },
    },
  });

  const entries: LeaderboardEntry[] = registrations
    .filter((r) => r.scores.length > 0)
    .map((r) => {
      const scores: (number | null)[] = Array(18).fill(null);
      let totalStrokes = 0;
      let holesPlayed = 0;
      let parTotal = 0;

      for (const s of r.scores) {
        scores[s.hole - 1] = s.strokes;
        totalStrokes += s.strokes;
        holesPlayed++;
        parTotal += PAR[s.hole - 1] || 4;
      }

      return {
        registrationId: r.id,
        teamName: r.teamName || "",
        playerName: r.player1Name,
        type: r.type,
        holesPlayed,
        totalStrokes,
        toPar: totalStrokes - parTotal,
        scores,
      };
    });

  entries.sort((a, b) => a.toPar - b.toPar);
  return entries;
}

export function getParForHole(hole: number): number {
  return PAR[hole - 1] || 4;
}

export const PARS = PAR;
