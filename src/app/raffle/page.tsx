"use client";

import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Ticket, ArrowLeft, Gift, Plus, Minus } from "lucide-react";
import Header from "@/components/Header";
import { getRafflePrizes, getMyTickets, purchaseTickets } from "./actions";

interface Prize {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  ticketId: string | null;
  ticket: { user: { name: string | null } | null } | null;
}

interface MyTicket {
  id: string;
  number: number;
  status: string;
  wonPrize: { name: string } | null;
}

export default function RafflePage() {
  const { data: session } = useSession();
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [myTickets, setMyTickets] = useState<MyTicket[]>([]);
  const [count, setCount] = useState(1);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getRafflePrizes().then(setPrizes);
    if (session?.user) {
      getMyTickets().then(setMyTickets);
    }
  }, [session]);

  function handlePurchase() {
    setError("");
    startTransition(async () => {
      const result = await purchaseTickets(count);
      if (result.error) {
        setError(result.error);
      } else {
        const tickets = await getMyTickets();
        setMyTickets(tickets);
        setCount(1);
      }
    });
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12 pt-24">
          <Link href="/" className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-6">
            <ArrowLeft size={16} /> Home
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <Ticket size={28} className="text-gold" />
            <h1 className="text-3xl font-bold text-foreground">Raffle</h1>
          </div>

          {/* Buy Tickets */}
          {session?.user && (
            <div className="bg-card-bg border border-card-border rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-2">Buy Raffle Tickets</h2>
              <p className="text-muted text-sm mb-4">$5.00 per ticket. Winners drawn during the event!</p>

              {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-card-border rounded-lg">
                  <button onClick={() => setCount(Math.max(1, count - 1))} className="p-2 hover:bg-muted-bg transition-colors rounded-l-lg">
                    <Minus size={16} />
                  </button>
                  <span className="px-4 font-bold text-lg">{count}</span>
                  <button onClick={() => setCount(Math.min(20, count + 1))} className="p-2 hover:bg-muted-bg transition-colors rounded-r-lg">
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-lg font-medium text-accent">${(count * 5).toFixed(2)}</span>
                <button
                  onClick={handlePurchase}
                  disabled={isPending}
                  className="px-5 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
                >
                  {isPending ? "Purchasing..." : "Buy Tickets"}
                </button>
              </div>
            </div>
          )}

          {/* My Tickets */}
          {myTickets.length > 0 && (
            <div className="bg-card-bg border border-card-border rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">My Tickets ({myTickets.length})</h2>
              <div className="flex flex-wrap gap-2">
                {myTickets.map((t) => (
                  <span key={t.id} className={`px-3 py-1.5 rounded-lg text-sm font-mono font-medium ${
                    t.status === "winner"
                      ? "bg-gold/20 text-gold-dark border border-gold"
                      : "bg-muted-bg text-foreground"
                  }`}>
                    #{t.number}
                    {t.wonPrize && ` - Won: ${t.wonPrize.name}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Prizes */}
          <h2 className="text-xl font-bold text-foreground mb-4">Prizes</h2>
          {prizes.length === 0 ? (
            <div className="bg-card-bg border border-card-border rounded-xl p-10 text-center">
              <Gift size={48} className="mx-auto text-muted mb-4" />
              <p className="text-muted">Raffle prizes will be announced soon!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {prizes.map((prize) => (
                <div key={prize.id} className="bg-card-bg border border-card-border rounded-xl p-5">
                  <Gift size={24} className="text-gold mb-2" />
                  <h3 className="font-semibold text-foreground">{prize.name}</h3>
                  <p className="text-sm text-muted mt-1">{prize.description}</p>
                  {prize.ticket && (
                    <p className="text-xs text-gold-dark mt-2 font-medium">
                      Won by {prize.ticket.user?.name || "Anonymous"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
