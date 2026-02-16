"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { getOpenTeams, requestToJoinTeam } from "../actions";
import { ArrowLeft, Users, Send, CheckCircle, Clock, XCircle } from "lucide-react";

type OpenTeam = {
  id: string;
  teamName: string | null;
  player1Name: string;
  filledSlots: number;
  openSlots: number;
  myRequestStatus: string | null;
};

export default function BrowseTeamsPage() {
  const [teams, setTeams] = useState<OpenTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    const data = await getOpenTeams();
    setTeams(data);
    setLoading(false);
  }

  function handleRequest(teamId: string) {
    startTransition(async () => {
      const result = await requestToJoinTeam(teamId);
      if (result.error) {
        alert(result.error);
      } else {
        await loadTeams();
      }
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12 pt-24">
        <Link
          href="/portal"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Back to Portal
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Browse Open Teams</h1>
          <p className="text-sm text-muted mt-1">
            Find a team looking for players and send a join request
          </p>
        </div>

        {loading ? (
          <div className="text-center text-muted py-10">Loading teams...</div>
        ) : teams.length === 0 ? (
          <div className="bg-card-bg border border-card-border rounded-xl p-10 text-center">
            <Users size={40} className="mx-auto text-muted mb-3" />
            <h2 className="text-lg font-semibold text-foreground mb-1">No Open Teams</h2>
            <p className="text-sm text-muted">
              No teams are currently accepting join requests. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-card-bg border border-card-border rounded-xl p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {team.teamName || `${team.player1Name}'s Team`}
                    </h3>
                    <p className="text-sm text-muted mt-0.5">
                      Captain: {team.player1Name}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs bg-muted-bg px-2.5 py-1 rounded-full text-foreground">
                        {team.filledSlots}/4 players
                      </span>
                      <span className="text-xs text-accent font-medium">
                        {team.openSlots} {team.openSlots === 1 ? "spot" : "spots"} open
                      </span>
                    </div>
                  </div>

                  <div>
                    {team.myRequestStatus === "pending" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-yellow-600 bg-yellow-100 px-3 py-1.5 rounded-lg">
                        <Clock size={14} />
                        Pending
                      </span>
                    ) : team.myRequestStatus === "approved" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-100 px-3 py-1.5 rounded-lg">
                        <CheckCircle size={14} />
                        Approved
                      </span>
                    ) : team.myRequestStatus === "rejected" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-100 px-3 py-1.5 rounded-lg">
                        <XCircle size={14} />
                        Rejected
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRequest(team.id)}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50"
                      >
                        <Send size={14} />
                        Request to Join
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
