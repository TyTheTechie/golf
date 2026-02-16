"use client";

import { useState, useEffect, useTransition } from "react";
import { getScores, updateScore } from "./actions";
import { PARS } from "@/lib/scoring";

export default function ScoringForm({ registrationId }: { registrationId: string }) {
  const [scores, setScores] = useState<(number | null)[]>(Array(18).fill(null));
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState<number | null>(null);

  useEffect(() => {
    if (!registrationId) return;
    getScores(registrationId).then((data) => {
      const s = Array(18).fill(null) as (number | null)[];
      for (const score of data) {
        s[score.hole - 1] = score.strokes;
      }
      setScores(s);
    });
  }, [registrationId]);

  function handleChange(hole: number, value: string) {
    const strokes = parseInt(value);
    if (!value) {
      const updated = [...scores];
      updated[hole - 1] = null;
      setScores(updated);
      return;
    }
    if (isNaN(strokes) || strokes < 1 || strokes > 15) return;

    const updated = [...scores];
    updated[hole - 1] = strokes;
    setScores(updated);

    startTransition(async () => {
      await updateScore(registrationId, hole, strokes);
      setSaved(hole);
      setTimeout(() => setSaved(null), 1000);
    });
  }

  const totalStrokes = scores.reduce((sum: number, s) => sum + (s || 0), 0);
  const totalPar = scores.reduce((sum: number, s, i) => sum + (s != null ? PARS[i] : 0), 0);
  const toPar = totalStrokes - totalPar;

  return (
    <div>
      <div className="grid grid-cols-9 gap-1 mb-2">
        {/* Front 9 */}
        {Array.from({ length: 9 }).map((_, i) => {
          const hole = i + 1;
          const par = PARS[i];
          const score = scores[i];
          const bg =
            score == null ? "" :
            score < par ? "bg-red-50 border-red-300" :
            score === par ? "bg-white" :
            score === par + 1 ? "bg-yellow-50 border-yellow-300" :
            "bg-orange-50 border-orange-300";

          return (
            <div key={hole} className="text-center">
              <div className="text-xs text-muted mb-0.5">H{hole}</div>
              <div className="text-[10px] text-muted/60 mb-0.5">P{par}</div>
              <input
                type="number"
                min={1}
                max={15}
                value={score ?? ""}
                onChange={(e) => handleChange(hole, e.target.value)}
                disabled={isPending}
                className={`w-full text-center text-sm py-1.5 border rounded ${bg || "border-card-border bg-white"} focus:ring-2 focus:ring-accent outline-none ${
                  saved === hole ? "ring-2 ring-green-400" : ""
                }`}
              />
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-9 gap-1 mb-4">
        {/* Back 9 */}
        {Array.from({ length: 9 }).map((_, i) => {
          const hole = i + 10;
          const par = PARS[i + 9];
          const score = scores[i + 9];
          const bg =
            score == null ? "" :
            score < par ? "bg-red-50 border-red-300" :
            score === par ? "bg-white" :
            score === par + 1 ? "bg-yellow-50 border-yellow-300" :
            "bg-orange-50 border-orange-300";

          return (
            <div key={hole} className="text-center">
              <div className="text-xs text-muted mb-0.5">H{hole}</div>
              <div className="text-[10px] text-muted/60 mb-0.5">P{par}</div>
              <input
                type="number"
                min={1}
                max={15}
                value={score ?? ""}
                onChange={(e) => handleChange(hole, e.target.value)}
                disabled={isPending}
                className={`w-full text-center text-sm py-1.5 border rounded ${bg || "border-card-border bg-white"} focus:ring-2 focus:ring-accent outline-none ${
                  saved === hole ? "ring-2 ring-green-400" : ""
                }`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="font-medium">Total: {totalStrokes || "—"}</span>
        <span className={`font-medium ${toPar < 0 ? "text-red-600" : toPar === 0 ? "text-foreground" : "text-yellow-600"}`}>
          {totalStrokes > 0 ? (toPar > 0 ? `+${toPar}` : toPar === 0 ? "E" : toPar) : "—"}
        </span>
      </div>
    </div>
  );
}
