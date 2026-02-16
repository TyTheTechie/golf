"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Trophy, ArrowLeft, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import { getLeaderboardData } from "./actions";

interface LeaderboardEntry {
  registrationId: string;
  teamName: string;
  playerName: string;
  type: string;
  holesPlayed: number;
  totalStrokes: number;
  toPar: number;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const data = await getLeaderboardData();
    setEntries(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // SSE for real-time updates
  useEffect(() => {
    const eventSource = new EventSource("/api/auction/events");
    eventSource.addEventListener("score-update", () => {
      loadData();
    });
    return () => eventSource.close();
  }, [loadData]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12 pt-24">
          <Link href="/" className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-6">
            <ArrowLeft size={16} /> Home
          </Link>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Trophy size={28} className="text-gold" />
              <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
            </div>
            <button onClick={loadData} className="p-2 rounded-lg text-muted hover:text-accent hover:bg-muted-bg transition-colors">
              <RefreshCw size={18} />
            </button>
          </div>

          {loading ? (
            <p className="text-muted text-center py-12">Loading scores...</p>
          ) : entries.length === 0 ? (
            <div className="bg-card-bg border border-card-border rounded-xl p-10 text-center">
              <Trophy size={48} className="mx-auto text-muted mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No Scores Yet</h2>
              <p className="text-muted">Scores will appear here once the tournament begins.</p>
            </div>
          ) : (
            <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border bg-muted-bg/50">
                    <th className="text-left px-4 py-3 font-medium text-foreground w-12">#</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Player / Team</th>
                    <th className="text-center px-4 py-3 font-medium text-foreground">Holes</th>
                    <th className="text-center px-4 py-3 font-medium text-foreground">Strokes</th>
                    <th className="text-center px-4 py-3 font-medium text-foreground">To Par</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, i) => {
                    const rank = i + 1;
                    const medalColor =
                      rank === 1 ? "text-yellow-500" :
                      rank === 2 ? "text-gray-400" :
                      rank === 3 ? "text-amber-700" : "text-foreground";

                    return (
                      <tr key={entry.registrationId} className="border-b border-card-border last:border-0">
                        <td className={`px-4 py-3 font-bold ${medalColor}`}>
                          {rank <= 3 ? <Trophy size={16} className="inline" /> : null} {rank}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{entry.teamName || entry.playerName}</div>
                          {entry.teamName && <div className="text-xs text-muted">{entry.playerName}</div>}
                        </td>
                        <td className="px-4 py-3 text-center">{entry.holesPlayed}</td>
                        <td className="px-4 py-3 text-center font-medium">{entry.totalStrokes}</td>
                        <td className={`px-4 py-3 text-center font-bold ${
                          entry.toPar < 0 ? "text-red-600" :
                          entry.toPar === 0 ? "text-foreground" :
                          "text-yellow-600"
                        }`}>
                          {entry.toPar > 0 ? `+${entry.toPar}` : entry.toPar === 0 ? "E" : entry.toPar}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
