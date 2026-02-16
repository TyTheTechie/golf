import Link from "next/link";
import { getMyRegistrations } from "./actions";
import { formatCents } from "@/lib/square";
import { Users, UserCircle, ArrowRight, Search, Heart, Settings } from "lucide-react";
import QRCodeDisplay from "@/components/QRCodeDisplay";

export default async function PortalPage() {
  const registrations = await getMyRegistrations();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 pt-24">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Portal</h1>
            <p className="text-muted mt-1">View your registrations and manage your teams</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/portal/favorites"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-card-border text-muted hover:text-accent hover:border-accent/30 transition-colors"
            >
              <Heart size={16} />
              Favorites
            </Link>
            <Link
              href="/portal/profile"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-card-border text-muted hover:text-accent hover:border-accent/30 transition-colors"
            >
              <Settings size={16} />
              Profile
            </Link>
          </div>
        </div>

        {registrations.length === 0 ? (
          <div className="bg-card-bg border border-card-border rounded-xl p-10 text-center">
            <UserCircle size={48} className="mx-auto text-muted mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Registrations Found</h2>
            <p className="text-muted mb-6">
              We couldn&apos;t find any registrations matching your email address.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register/golfer"
                className="px-5 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors"
              >
                Register Now
              </Link>
              <Link
                href="/portal/teams"
                className="px-5 py-2.5 border border-card-border rounded-lg font-medium text-foreground hover:bg-muted-bg transition-colors inline-flex items-center gap-2 justify-center"
              >
                <Search size={16} />
                Browse Open Teams
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {registrations.map((reg) => (
                <div
                  key={reg.id}
                  className="bg-card-bg border border-card-border rounded-xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {reg.type === "team" ? (
                          <Users size={18} className="text-accent" />
                        ) : (
                          <UserCircle size={18} className="text-accent" />
                        )}
                        <span className="text-xs uppercase tracking-wider font-semibold text-accent">
                          {reg.type === "team" ? "Team" : "Individual"}
                        </span>
                        {reg.isCaptain && (
                          <span className="text-xs bg-gold/20 text-gold-dark px-2 py-0.5 rounded-full font-medium">
                            Captain
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {reg.teamName || reg.player1Name}
                      </h3>
                      <p className="text-sm text-muted mt-1">
                        Registered {new Date(reg.createdAt).toLocaleDateString()} &middot; {formatCents(reg.amount)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        reg.paymentStatus === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {reg.paymentStatus === "completed" ? "Paid" : "Pending"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { name: reg.player1Name, email: reg.player1Email },
                      { name: reg.player2Name, email: reg.player2Email },
                      { name: reg.player3Name, email: reg.player3Email },
                      { name: reg.player4Name, email: reg.player4Email },
                    ].map((player, i) =>
                      reg.type === "team" || i === 0 ? (
                        <div
                          key={i}
                          className={`text-sm px-3 py-2 rounded-lg ${
                            player.name
                              ? "bg-muted-bg text-foreground"
                              : "bg-muted-bg/50 text-muted border border-dashed border-card-border"
                          }`}
                        >
                          {player.name || "Open Slot"}
                        </div>
                      ) : null
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-card-border flex items-start justify-between">
                    <div>
                      {reg.type === "team" && reg.isCaptain && (
                        <Link
                          href={`/portal/team/${reg.id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
                        >
                          Manage Team <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                    {reg.paymentStatus === "completed" && (
                      <QRCodeDisplay registrationId={reg.id} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/portal/teams"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
              >
                <Search size={16} />
                Browse Open Teams
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
