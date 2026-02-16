"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getTeamDetails,
  toggleJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  transferCaptain,
} from "../../actions";
import {
  ArrowLeft,
  Check,
  X,
  UserPlus,
  Crown,
  Users,
  ToggleLeft,
  ToggleRight,
  Copy,
  Share2,
} from "lucide-react";

type Registration = {
  id: string;
  teamName: string | null;
  inviteCode: string | null;
  openForJoinRequests: boolean;
  player1Name: string;
  player1Email: string;
  player2Name: string | null;
  player2Email: string | null;
  player3Name: string | null;
  player3Email: string | null;
  player4Name: string | null;
  player4Email: string | null;
  captainUserId: string | null;
  joinRequests: {
    id: string;
    status: string;
    playerName: string;
    playerEmail: string;
    createdAt: string;
    user: { id: string; name: string | null; email: string };
  }[];
};

export default function TeamManagementPage() {
  const params = useParams();
  const router = useRouter();
  const registrationId = params.registrationId as string;
  const [team, setTeam] = useState<Registration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [transferTarget, setTransferTarget] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadTeam();
  }, [registrationId]);

  async function loadTeam() {
    const result = await getTeamDetails(registrationId);
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setTeam(result.data as unknown as Registration);
    }
  }

  function handleToggle() {
    if (!team) return;
    startTransition(async () => {
      const result = await toggleJoinRequests(registrationId, !team.openForJoinRequests);
      if (!result.error) {
        setTeam({ ...team, openForJoinRequests: !team.openForJoinRequests });
      }
    });
  }

  function handleApprove(requestId: string) {
    startTransition(async () => {
      const result = await approveJoinRequest(requestId);
      if (result.error) {
        alert(result.error);
      } else {
        await loadTeam();
      }
    });
  }

  function handleReject(requestId: string) {
    startTransition(async () => {
      const result = await rejectJoinRequest(requestId);
      if (!result.error) {
        await loadTeam();
      }
    });
  }

  function handleTransfer(email: string) {
    if (!confirm(`Transfer captain role to the player with email ${email}? You will lose management access.`)) return;
    startTransition(async () => {
      const result = await transferCaptain(registrationId, email);
      if (result.error) {
        alert(result.error);
      } else {
        router.push("/portal");
      }
    });
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-card-bg border border-card-border rounded-xl p-10 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <Link href="/portal" className="text-accent mt-4 inline-block hover:underline">
              Back to Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="max-w-3xl mx-auto px-4 text-center text-muted">Loading...</div>
      </div>
    );
  }

  const players = [
    { name: team.player1Name, email: team.player1Email, slot: 1 },
    { name: team.player2Name, email: team.player2Email, slot: 2 },
    { name: team.player3Name, email: team.player3Email, slot: 3 },
    { name: team.player4Name, email: team.player4Email, slot: 4 },
  ];

  const pendingRequests = team.joinRequests.filter((r) => r.status === "pending");
  const pastRequests = team.joinRequests.filter((r) => r.status !== "pending");

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

        <div className="flex items-center gap-3 mb-8">
          <Users size={24} className="text-accent" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {team.teamName || "Team Management"}
            </h1>
            <p className="text-sm text-muted">Manage your team roster and join requests</p>
          </div>
        </div>

        {/* Roster */}
        <div className="bg-card-bg border border-card-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Team Roster</h2>
          <div className="space-y-3">
            {players.map((p) => (
              <div
                key={p.slot}
                className={`flex items-center justify-between px-4 py-3 rounded-lg ${
                  p.name ? "bg-muted-bg" : "bg-muted-bg/50 border border-dashed border-card-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted w-5">#{p.slot}</span>
                  {p.name ? (
                    <div>
                      <div className="font-medium text-foreground flex items-center gap-2">
                        {p.name}
                        {p.slot === 1 && (
                          <Crown size={14} className="text-gold" />
                        )}
                      </div>
                      <div className="text-xs text-muted">{p.email}</div>
                    </div>
                  ) : (
                    <span className="text-muted italic">Open Slot</span>
                  )}
                </div>
                {p.name && p.email && p.slot !== 1 && (() => {
                  const email = p.email!;
                  return (
                    <button
                      onClick={() =>
                        transferTarget === email
                          ? handleTransfer(email)
                          : setTransferTarget(email)
                      }
                      disabled={isPending}
                      className="text-xs px-3 py-1.5 rounded-lg border border-card-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-50"
                    >
                      {transferTarget === email ? "Confirm Transfer" : "Make Captain"}
                    </button>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>

        {/* Invite Code */}
        {team.inviteCode && (
          <div className="bg-card-bg border border-card-border rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Share2 size={18} className="text-accent" />
              <h2 className="text-lg font-semibold text-foreground">Team Invite Code</h2>
            </div>
            <p className="text-sm text-muted mb-3">
              Share this code with teammates so they can sign up and auto-request to join your team.
            </p>
            <div className="flex items-center gap-3">
              <code className="flex-1 px-4 py-2.5 bg-muted-bg rounded-lg font-mono text-lg tracking-wider text-foreground text-center">
                {team.inviteCode}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(team.inviteCode!);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors text-sm"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {/* Join Requests Toggle */}
        <div className="bg-card-bg border border-card-border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Join Requests</h2>
              <p className="text-sm text-muted mt-0.5">
                {team.openForJoinRequests
                  ? "Players can request to join your team"
                  : "Join requests are disabled"}
              </p>
            </div>
            <button
              onClick={handleToggle}
              disabled={isPending}
              className="flex items-center gap-2 text-sm font-medium disabled:opacity-50"
            >
              {team.openForJoinRequests ? (
                <ToggleRight size={28} className="text-accent" />
              ) : (
                <ToggleLeft size={28} className="text-muted" />
              )}
            </button>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="bg-card-bg border border-card-border rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <UserPlus size={18} className="text-accent" />
              Pending Requests
              <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                {pendingRequests.length}
              </span>
            </h2>
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between px-4 py-3 bg-muted-bg rounded-lg"
                >
                  <div>
                    <div className="font-medium text-foreground">{req.playerName}</div>
                    <div className="text-xs text-muted">{req.playerEmail}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(req.id)}
                      disabled={isPending}
                      className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
                      title="Approve"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      disabled={isPending}
                      className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
                      title="Reject"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Requests */}
        {pastRequests.length > 0 && (
          <div className="bg-card-bg border border-card-border rounded-xl p-6">
            <h2 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">
              Past Requests
            </h2>
            <div className="space-y-2">
              {pastRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between px-4 py-2.5 bg-muted-bg/50 rounded-lg text-sm"
                >
                  <span className="text-foreground">{req.playerName}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      req.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
