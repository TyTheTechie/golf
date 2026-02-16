"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Star, KeyRound } from "lucide-react";
import SquarePaymentForm from "@/components/payment/SquarePaymentForm";
import { SPONSOR_TIERS } from "@/lib/sponsor-tiers";
import { submitSponsorRegistration } from "./actions";

const steps = ["Tier", "Company Info", "Review & Pay"];

export default function SponsorRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedTier, setSelectedTier] = useState("gold");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tier = SPONSOR_TIERS.find((t) => t.id === selectedTier)!;

  function canProceedFromInfo() {
    return companyName && contactName && contactEmail;
  }

  async function handlePayment(token: string) {
    setLoading(true);
    setError("");

    const result = await submitSponsorRegistration({
      tier: selectedTier,
      companyName,
      contactName,
      contactEmail,
      contactPhone,
      paymentToken: token,
      accessCode,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push(`/register/sponsor/confirmation?id=${result.registrationId}`);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/register" className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-8">
          <ArrowLeft size={16} /> Back to Registration
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-2">Sponsor Registration</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= step ? "bg-gold text-white" : "bg-card-border text-muted"
                }`}
              >
                {i < step ? <Check size={16} /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:inline ${i <= step ? "text-foreground" : "text-muted"}`}>
                {label}
              </span>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${i < step ? "bg-gold" : "bg-card-border"}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Step 0: Tier selection */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="bg-card-bg border border-card-border rounded-xl p-5">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <KeyRound size={16} className="text-gold" />
                Event Access Code *
              </label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-gold focus:border-gold outline-none uppercase tracking-wider"
                placeholder="Enter code from your invitation"
                required
              />
              <p className="text-xs text-muted mt-1.5">You should have received this code with your event invitation.</p>
            </div>

            <p className="text-muted mb-4">Choose your sponsorship tier:</p>
            <div className="space-y-3">
              {SPONSOR_TIERS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTier(t.id)}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                    selectedTier === t.id
                      ? "border-gold bg-gold/5"
                      : "border-card-border hover:border-gold/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Star
                        size={20}
                        className={selectedTier === t.id ? "text-gold" : "text-muted"}
                      />
                      <h3 className="font-bold text-lg text-foreground">{t.name}</h3>
                    </div>
                    <span className="text-gold-dark font-bold text-xl">
                      ${(t.price / 100).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {t.benefits.map((b) => (
                      <span key={b} className="text-xs bg-muted-bg text-muted px-2 py-1 rounded-full">
                        {b}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setStep(1)}
                disabled={!accessCode.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-white rounded-lg font-medium hover:bg-gold-dark transition-colors disabled:opacity-50"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Company info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-card-bg border border-card-border rounded-xl p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Company Name *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-gold focus:border-gold outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Contact Name *</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-gold focus:border-gold outline-none"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Contact Email *</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-gold focus:border-gold outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-gold focus:border-gold outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(0)}
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-card-border text-foreground rounded-lg font-medium hover:bg-muted-bg transition-colors"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedFromInfo()}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-white rounded-lg font-medium hover:bg-gold-dark transition-colors disabled:opacity-50"
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
              <h3 className="font-medium text-foreground mb-3">Sponsorship Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Tier</span>
                  <span className="text-foreground font-medium">{tier.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Company</span>
                  <span className="text-foreground font-medium">{companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Contact</span>
                  <span className="text-foreground">{contactName} ({contactEmail})</span>
                </div>
              </div>
            </div>

            <SquarePaymentForm
              amount={tier.price}
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
