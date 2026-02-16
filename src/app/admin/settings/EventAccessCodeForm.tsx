"use client";

import { useState, useTransition } from "react";
import { updateEventAccessCode } from "../actions";
import { Check } from "lucide-react";

export default function EventAccessCodeForm({ currentCode }: { currentCode: string }) {
  const [code, setCode] = useState(currentCode);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const result = await updateEventAccessCode(code);
      if (result.error) {
        setError(result.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    });
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground font-mono text-lg tracking-wider focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
        placeholder="e.g. FORE2025"
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isPending || code.trim() === currentCode}
          className="px-5 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
            <Check size={16} />
            Saved
          </span>
        )}
      </div>
    </div>
  );
}
