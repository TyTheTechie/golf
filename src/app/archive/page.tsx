import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import { Calendar, Trophy, ArrowRight, ArrowLeft } from "lucide-react";

export default async function ArchivePage() {
  const events = await prisma.event.findMany({
    where: { isActive: false },
    include: { _count: { select: { results: true } } },
    orderBy: { year: "desc" },
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12 pt-24">
          <Link href="/" className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-6">
            <ArrowLeft size={16} /> Home
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <Calendar size={28} className="text-accent" />
            <h1 className="text-3xl font-bold text-foreground">Past Events</h1>
          </div>

          {events.length === 0 ? (
            <div className="bg-card-bg border border-card-border rounded-xl p-10 text-center">
              <Trophy size={48} className="mx-auto text-muted mb-4" />
              <p className="text-muted">No past events to display yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/archive/${event.id}`}
                  className="bg-card-bg border border-card-border rounded-xl p-6 hover:border-accent/50 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-bold text-accent">{event.year}</span>
                    <ArrowRight size={18} className="text-muted group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{event.name}</h3>
                  <p className="text-sm text-muted mb-2">{event.venue}</p>
                  <p className="text-sm text-muted line-clamp-2">{event.description}</p>
                  {event._count.results > 0 && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-gold-dark font-medium">
                      <Trophy size={14} /> {event._count.results} results
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
