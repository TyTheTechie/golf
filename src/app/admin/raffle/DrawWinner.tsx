"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Sparkles } from "lucide-react";
import { drawWinner } from "./actions";

interface Prize {
  id: string;
  name: string;
  ticketId: string | null;
  ticket: { number: number; user: { name: string | null; email: string | null } | null } | null;
}

export default function DrawWinner({ prize }: { prize: Prize }) {
  const router = useRouter();
  const [result, setResult] = useState<{ winnerName: string; ticketNumber: number } | null>(null);
  const [error, setError] = useState("");
  const [animating, setAnimating] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDraw() {
    setError("");
    setAnimating(true);

    // Brief animation delay
    setTimeout(() => {
      startTransition(async () => {
        const res = await drawWinner(prize.id);
        setAnimating(false);
        if (res.error) {
          setError(res.error);
        } else {
          setResult({ winnerName: res.winnerName!, ticketNumber: res.ticketNumber! });
          router.refresh();
        }
      });
    }, 1500);
  }

  if (prize.ticketId) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Trophy size={14} className="text-gold" />
        <span className="text-gold-dark font-medium">
          Ticket #{prize.ticket?.number} — {prize.ticket?.user?.name || "Anonymous"}
        </span>
      </div>
    );
  }

  if (result) {
    return (
      <div className="flex items-center gap-2 text-sm bg-gold/10 px-3 py-2 rounded-lg">
        <Sparkles size={14} className="text-gold" />
        <span className="font-medium text-gold-dark">
          Winner: {result.winnerName} (Ticket #{result.ticketNumber})
        </span>
      </div>
    );
  }

  return (
    <div>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <button
        onClick={handleDraw}
        disabled={isPending || animating}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          animating
            ? "bg-gold/20 text-gold-dark animate-pulse"
            : "bg-gold text-white hover:bg-gold-dark"
        } disabled:opacity-50`}
      >
        {animating ? "Drawing..." : "Draw Winner"}
      </button>
    </div>
  );
}
