"use client";

import { useState, useEffect } from "react";
import { ClipboardList } from "lucide-react";
import { getRegistrationsForScoring } from "./actions";
import ScoringForm from "./ScoringForm";

interface Registration {
  id: string;
  player1Name: string;
  teamName: string | null;
  type: string;
}

export default function AdminScoringPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    getRegistrationsForScoring().then(setRegistrations);
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList size={24} className="text-accent" />
        <h1 className="text-2xl font-bold text-foreground">Scoring</h1>
      </div>

      <div className="bg-card-bg border border-card-border rounded-xl p-6 mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">Select Player / Team</label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none"
        >
          <option value="">Choose a registration...</option>
          {registrations.map((r) => (
            <option key={r.id} value={r.id}>
              {r.teamName ? `${r.teamName} (${r.player1Name})` : r.player1Name} — {r.type}
            </option>
          ))}
        </select>
      </div>

      {selectedId && (
        <div className="bg-card-bg border border-card-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Score Card
          </h2>
          <ScoringForm registrationId={selectedId} />
        </div>
      )}
    </div>
  );
}
