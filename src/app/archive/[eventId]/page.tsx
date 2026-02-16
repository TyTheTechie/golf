import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import { ArrowLeft, Trophy, MapPin, Calendar } from "lucide-react";

const MEDAL_COLORS = [
  "bg-yellow-100 text-yellow-700 border-yellow-300",
  "bg-gray-100 text-gray-600 border-gray-300",
  "bg-amber-100 text-amber-700 border-amber-300",
];

export default async function ArchiveEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      results: { orderBy: { place: "asc" } },
      photos: { orderBy: { sortOrder: "asc" }, take: 12 },
    },
  });

  if (!event) notFound();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12 pt-24">
          <Link href="/archive" className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-6">
            <ArrowLeft size={16} /> Past Events
          </Link>

          <div className="mb-8">
            <span className="text-sm text-accent font-semibold uppercase tracking-wider">{event.year}</span>
            <h1 className="text-3xl font-bold text-foreground mt-1">{event.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted">
              <span className="flex items-center gap-1"><MapPin size={14} /> {event.venue}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(event.date).toLocaleDateString()}</span>
            </div>
            <p className="text-muted mt-3">{event.description}</p>
          </div>

          {/* Results - Podium */}
          {event.results.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Trophy size={20} className="text-gold" /> Results
              </h2>

              <div className="space-y-3">
                {event.results.map((result) => {
                  const medalClass = result.place <= 3 ? MEDAL_COLORS[result.place - 1] : "bg-muted-bg text-foreground border-card-border";
                  return (
                    <div key={result.id} className={`flex items-center gap-4 p-4 rounded-xl border ${medalClass}`}>
                      <div className="text-2xl font-bold w-10 text-center">
                        {result.place <= 3 ? <Trophy size={24} /> : `#${result.place}`}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{result.teamName}</h3>
                        <p className="text-sm opacity-70">{result.playerNames}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold">{result.score}</span>
                        <p className="text-xs opacity-70">strokes</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Event Photos */}
          {event.photos.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Photos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {event.photos.map((photo) => (
                  <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-muted-bg">
                    <img src={photo.url} alt={photo.caption || "Event photo"} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
