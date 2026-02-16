"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Users, ArrowLeft, ArrowRight, Check, KeyRound } from "lucide-react";
import SquarePaymentForm from "@/components/payment/SquarePaymentForm";
import { submitGolferRegistration } from "./actions";

type RegistrationType = "individual" | "team";

interface PlayerInfo {
  name: string;
  email: string;
  phone: string;
}

const PRICES = { individual: 12500, team: 50000 };
const steps = ["Type", "Players", "Review & Pay"];

export default function GolferRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [type, setType] = useState<RegistrationType>("individual");
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState<PlayerInfo[]>([
    { name: "", email: "", phone: "" },
    { name: "", email: "", phone: "" },
    { name: "", email: "", phone: "" },
    { name: "", email: "", phone: "" },
  ]);
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const amount = PRICES[type];
  const playerCount = type === "individual" ? 1 : 4;

  function updatePlayer(index: number, field: keyof PlayerInfo, value: string) {
    setPlayers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function canProceedFromPlayers() {
    for (let i = 0; i < playerCount; i++) {
      if (!players[i].name || !players[i].email) return false;
    }
    if (type === "team" && !teamName) return false;
    return true;
  }

  async function handlePayment(token: string) {
    setLoading(true);
    setError("");

    const result = await submitGolferRegistration({
      type,
      teamName: type === "team" ? teamName : undefined,
      players: players.slice(0, playerCount),
      paymentToken: token,
      accessCode,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push(`/register/golfer/confirmation?id=${result.registrationId}`);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/register" className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-8">
          <ArrowLeft size={16} /> Back to Registration
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-2">Golfer Registration</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= step
                    ? "bg-accent text-white"
                    : "bg-card-border text-muted"
                }`}
              >
                {i < step ? <Check size={16} /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:inline ${i <= step ? "text-foreground" : "text-muted"}`}>
                {label}
              </span>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${i < step ? "bg-accent" : "bg-card-border"}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Step 0: Choose type */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="bg-card-bg border border-card-border rounded-xl p-5">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <KeyRound size={16} className="text-accent" />
                Event Access Code *
              </label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none uppercase tracking-wider"
                placeholder="Enter code from your invitation"
                required
              />
              <p className="text-xs text-muted mt-1.5">You should have received this code with your event invitation.</p>
            </div>

            <p className="text-muted mb-4">Choose your registration type:</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setType("individual")}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  type === "individual"
                    ? "border-accent bg-accent/5"
                    : "border-card-border hover:border-accent/50"
                }`}
              >
                <User size={28} className="text-accent mb-3" />
                <h3 className="font-bold text-lg text-foreground">Individual</h3>
                <p className="text-muted text-sm mt-1">Single player registration</p>
                <p className="text-accent font-bold text-xl mt-2">$125</p>
              </button>

              <button
                onClick={() => setType("team")}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  type === "team"
                    ? "border-accent bg-accent/5"
                    : "border-card-border hover:border-accent/50"
                }`}
              >
                <Users size={28} className="text-accent mb-3" />
                <h3 className="font-bold text-lg text-foreground">Team of 4</h3>
                <p className="text-muted text-sm mt-1">Register your full team</p>
                <p className="text-accent font-bold text-xl mt-2">$500</p>
              </button>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setStep(1)}
                disabled={!accessCode.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Player details */}
        {step === 1 && (
          <div className="space-y-6">
            {type === "team" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  placeholder="Enter team name"
                  required
                />
              </div>
            )}

            {Array.from({ length: playerCount }).map((_, i) => (
              <div key={i} className="bg-card-bg border border-card-border rounded-xl p-5">
                <h3 className="font-medium text-foreground mb-3">
                  {type === "individual" ? "Player Details" : `Player ${i + 1}`}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-muted mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={players[i].name}
                      onChange={(e) => updatePlayer(i, "name", e.target.value)}
                      className="w-full px-3 py-2 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-1">Email *</label>
                    <input
                      type="email"
                      value={players[i].email}
                      onChange={(e) => updatePlayer(i, "email", e.target.value)}
                      className="w-full px-3 py-2 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-1">Phone</label>
                    <input
                      type="tel"
                      value={players[i].phone}
                      onChange={(e) => updatePlayer(i, "phone", e.target.value)}
                      className="w-full px-3 py-2 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(0)}
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-card-border text-foreground rounded-lg font-medium hover:bg-muted-bg transition-colors"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedFromPlayers()}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
              >
                Review & Pay <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review & Pay */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-card-bg border border-card-border rounded-xl p-5">
              <h3 className="font-medium text-foreground mb-3">Registration Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Type</span>
                  <span className="text-foreground font-medium capitalize">{type}</span>
                </div>
                {type === "team" && (
                  <div className="flex justify-between">
                    <span className="text-muted">Team Name</span>
                    <span className="text-foreground font-medium">{teamName}</span>
                  </div>
                )}
                <hr className="border-card-border my-2" />
                {players.slice(0, playerCount).map((p, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-muted">{type === "team" ? `Player ${i + 1}` : "Player"}</span>
                    <span className="text-foreground">{p.name} ({p.email})</span>
                  </div>
                ))}
              </div>
            </div>

            <SquarePaymentForm
              amount={amount}
              onPaymentToken={handlePayment}
              loading={loading}
            />

            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-card-border text-foreground rounded-lg font-medium hover:bg-muted-bg transition-colors"
            >
              <ArrowLeft size={18} /> Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
