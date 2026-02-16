"use client";

import { useState, useEffect, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { ScanLine, CheckCircle, AlertCircle } from "lucide-react";
import { checkInRegistration, getCheckInStats } from "./actions";
import { Suspense } from "react";

function CheckInContent() {
  const searchParams = useSearchParams();
  const [registrationId, setRegistrationId] = useState(searchParams.get("id") || "");
  const [stats, setStats] = useState<{ total: number; checkedIn: number; recent: { id: string; player1Name: string; teamName: string | null; type: string; checkedInAt: Date | null }[] }>({ total: 0, checkedIn: 0, recent: [] });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadStats();
  }, []);

  // Auto check-in from QR scan
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setRegistrationId(id);
      handleCheckIn(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function loadStats() {
    getCheckInStats().then(setStats);
  }

  function handleCheckIn(id?: string) {
    const targetId = id || registrationId.trim();
    if (!targetId) return;

    setMessage(null);
    startTransition(async () => {
      const result = await checkInRegistration(targetId);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: `Checked in: ${result.playerName}` });
        setRegistrationId("");
        loadStats();
      }
    });
  }

  const pct = stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <ScanLine size={24} className="text-accent" />
        <h1 className="text-2xl font-bold text-foreground">Check-in</h1>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card-bg border border-card-border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-accent">{stats.checkedIn}</p>
          <p className="text-sm text-muted">Checked In</p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          <p className="text-sm text-muted">Total Registrations</p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-gold">{pct}%</p>
          <p className="text-sm text-muted">Attendance</p>
        </div>
      </div>

      <div className="bg-card-bg border border-card-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">Manual Check-in</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={registrationId}
            onChange={(e) => setRegistrationId(e.target.value)}
            placeholder="Enter registration ID"
            className="flex-1 px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none font-mono text-sm"
          />
          <button
            onClick={() => handleCheckIn()}
            disabled={isPending || !registrationId.trim()}
            className="px-5 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {isPending ? "..." : "Check In"}
          </button>
        </div>

        {message && (
          <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 text-sm ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}>
            {message.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}
      </div>

      <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
        <h2 className="text-lg font-semibold text-foreground px-4 py-3 border-b border-card-border">
          Recently Checked In
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border bg-muted-bg/50">
              <th className="text-left px-4 py-2 font-medium text-foreground">Player</th>
              <th className="text-left px-4 py-2 font-medium text-foreground">Team</th>
              <th className="text-left px-4 py-2 font-medium text-foreground">Time</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent.map((r) => (
              <tr key={r.id} className="border-b border-card-border last:border-0">
                <td className="px-4 py-2 font-medium">{r.player1Name}</td>
                <td className="px-4 py-2 text-muted">{r.teamName || "Individual"}</td>
                <td className="px-4 py-2 text-muted">
                  {r.checkedInAt ? new Date(r.checkedInAt).toLocaleTimeString() : "—"}
                </td>
              </tr>
            ))}
            {stats.recent.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-muted">No check-ins yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CheckInPage() {
  return (
    <Suspense fallback={<div className="p-4 text-muted">Loading...</div>}>
      <CheckInContent />
    </Suspense>
  );
}
