"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Plus, CheckCircle, Star } from "lucide-react";
import { createEvent, setActiveEvent } from "./actions";
import ResultForm from "./ResultForm";

interface EventData {
  id: string;
  name: string;
  year: number;
  date: Date;
  venue: string;
  description: string;
  isActive: boolean;
  _count: { results: number; registrations: number };
}

export default function EventManager({ initialEvents }: { initialEvents: EventData[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [showResults, setShowResults] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await createEvent({
        name,
        year: parseInt(year),
        date,
        venue,
        description,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setShowForm(false);
        setName("");
        setDate("");
        setVenue("");
        setDescription("");
        router.refresh();
      }
    });
  }

  function handleSetActive(id: string) {
    startTransition(async () => {
      await setActiveEvent(id);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calendar size={24} className="text-accent" /> Events
          </h1>
          <p className="text-muted text-sm mt-1">{initialEvents.length} events</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors"
        >
          <Plus size={16} /> Create Event
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-card-bg border border-card-border rounded-xl p-6 mb-6 space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Event Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Year *</label>
              <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required min={2000}
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Date *</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Venue *</label>
              <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} required
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={2}
              className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none resize-none" />
          </div>
          <button type="submit" disabled={isPending}
            className="px-5 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50">
            {isPending ? "Creating..." : "Create Event"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {initialEvents.map((event) => (
          <div key={event.id} className="bg-card-bg border border-card-border rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-foreground">{event.name}</h3>
                  {event.isActive && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <Star size={12} /> Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted">
                  {event.year} &middot; {event.venue} &middot; {event._count.registrations} registrations &middot; {event._count.results} results
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!event.isActive && (
                  <button
                    onClick={() => handleSetActive(event.id)}
                    disabled={isPending}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-accent border border-accent/30 rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <CheckCircle size={14} /> Set Active
                  </button>
                )}
                <button
                  onClick={() => setShowResults(showResults === event.id ? null : event.id)}
                  className="px-3 py-1.5 text-xs font-medium text-foreground border border-card-border rounded-lg hover:bg-muted-bg transition-colors"
                >
                  {showResults === event.id ? "Hide Results" : "Add Results"}
                </button>
              </div>
            </div>
            {showResults === event.id && (
              <div className="mt-4 pt-4 border-t border-card-border">
                <ResultForm eventId={event.id} />
              </div>
            )}
          </div>
        ))}
        {initialEvents.length === 0 && (
          <div className="bg-card-bg border border-card-border rounded-xl p-10 text-center text-muted">
            No events created yet
          </div>
        )}
      </div>
    </div>
  );
}
