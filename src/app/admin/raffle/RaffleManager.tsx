"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ticket, Plus, Gift } from "lucide-react";
import { createPrize } from "./actions";
import DrawWinner from "./DrawWinner";

interface Prize {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  ticketId: string | null;
  ticket: { number: number; user: { name: string | null; email: string | null } | null } | null;
}

interface Stats {
  totalTickets: number;
  soldTickets: number;
  revenue: number;
  prizes: Prize[];
}

export default function RaffleManager({ initialStats }: { initialStats: Stats }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCreatePrize(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await createPrize({ name, description });
      if (result.error) {
        setError(result.error);
      } else {
        setShowForm(false);
        setName("");
        setDescription("");
        router.refresh();
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Ticket size={24} className="text-gold" /> Raffle
          </h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors"
        >
          <Plus size={16} /> Add Prize
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card-bg border border-card-border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-accent">{initialStats.soldTickets}</p>
          <p className="text-sm text-muted">Tickets Sold</p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-gold">${(initialStats.revenue / 100).toLocaleString()}</p>
          <p className="text-sm text-muted">Revenue</p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-foreground">{initialStats.prizes.length}</p>
          <p className="text-sm text-muted">Prizes</p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreatePrize} className="bg-card-bg border border-card-border rounded-xl p-6 mb-6 space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Prize Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={2}
              className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none resize-none" />
          </div>
          <button type="submit" disabled={isPending}
            className="px-5 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50">
            {isPending ? "Creating..." : "Create Prize"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {initialStats.prizes.map((prize) => (
          <div key={prize.id} className="bg-card-bg border border-card-border rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Gift size={20} className="text-gold mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground">{prize.name}</h3>
                <p className="text-sm text-muted">{prize.description}</p>
              </div>
            </div>
            <DrawWinner prize={prize} />
          </div>
        ))}
        {initialStats.prizes.length === 0 && (
          <div className="bg-card-bg border border-card-border rounded-xl p-10 text-center text-muted">
            No prizes created yet
          </div>
        )}
      </div>
    </div>
  );
}
