"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addEventResult } from "./actions";

export default function ResultForm({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [place, setPlace] = useState("1");
  const [teamName, setTeamName] = useState("");
  const [playerNames, setPlayerNames] = useState("");
  const [score, setScore] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await addEventResult({
        eventId,
        place: parseInt(place),
        teamName,
        playerNames,
        score: parseInt(score),
      });
      if (result.error) {
        setError(result.error);
      } else {
        setTeamName("");
        setPlayerNames("");
        setScore("");
        setPlace(String(parseInt(place) + 1));
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-4 gap-2">
        <div>
          <label className="block text-xs text-muted mb-1">Place</label>
          <input type="number" value={place} onChange={(e) => setPlace(e.target.value)} min={1} required
            className="w-full px-3 py-2 border border-card-border rounded-lg bg-white text-foreground text-sm focus:ring-2 focus:ring-accent outline-none" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Team Name</label>
          <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} required
            className="w-full px-3 py-2 border border-card-border rounded-lg bg-white text-foreground text-sm focus:ring-2 focus:ring-accent outline-none" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Players</label>
          <input type="text" value={playerNames} onChange={(e) => setPlayerNames(e.target.value)} required placeholder="Names, comma-separated"
            className="w-full px-3 py-2 border border-card-border rounded-lg bg-white text-foreground text-sm focus:ring-2 focus:ring-accent outline-none" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Score</label>
          <input type="number" value={score} onChange={(e) => setScore(e.target.value)} required
            className="w-full px-3 py-2 border border-card-border rounded-lg bg-white text-foreground text-sm focus:ring-2 focus:ring-accent outline-none" />
        </div>
      </div>
      <button type="submit" disabled={isPending}
        className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50">
        {isPending ? "Adding..." : "Add Result"}
      </button>
    </form>
  );
}
