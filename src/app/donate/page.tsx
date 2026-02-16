"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ArrowLeft, CheckCircle } from "lucide-react";
import { submitDonation } from "./actions";

const PRESET_AMOUNTS = [2500, 5000, 10000, 25000]; // in cents

export default function DonatePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [customAmount, setCustomAmount] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function selectPreset(cents: number) {
    setAmount((cents / 100).toFixed(2));
    setCustomAmount(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const amountCents = Math.round(parseFloat(amount) * 100);
    if (isNaN(amountCents) || amountCents < 100) {
      setError("Minimum donation is $1.00");
      setSubmitting(false);
      return;
    }

    const result = await submitDonation({ name, email, amount: amountCents, message: message || undefined });
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setSubmitting(false);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Thank You!</h1>
          <p className="text-muted mb-6">
            Your generous donation of ${amount} will make a real difference. Thank you for supporting our charities.
          </p>
          <Link
            href="/"
            className="px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-12 pt-24">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-6"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="text-center mb-8">
          <Heart size={40} className="text-accent mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-foreground">Make a Donation</h1>
          <p className="text-muted mt-2">
            Every dollar goes directly to supporting our partner charities.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-card-bg border border-card-border rounded-xl p-6 space-y-5"
        >
          <div className="grid grid-cols-2 gap-3">
            {PRESET_AMOUNTS.map((cents) => (
              <button
                key={cents}
                type="button"
                onClick={() => selectPreset(cents)}
                className={`py-3 rounded-lg font-semibold text-lg border-2 transition-colors ${
                  amount === (cents / 100).toFixed(2) && !customAmount
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-card-border text-foreground hover:border-accent/50"
                }`}
              >
                ${(cents / 100).toFixed(0)}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Custom Amount ($)
            </label>
            <input
              type="number"
              value={customAmount ? amount : ""}
              onChange={(e) => {
                setAmount(e.target.value);
                setCustomAmount(true);
              }}
              onFocus={() => setCustomAmount(true)}
              placeholder="Enter amount"
              min="1"
              step="0.01"
              className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Leave a kind word..."
              className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !amount}
            className="w-full py-3 bg-accent text-white rounded-lg font-medium text-lg hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {submitting ? "Processing..." : `Donate ${amount ? `$${parseFloat(amount).toFixed(2)}` : ""}`}
          </button>

          <p className="text-xs text-muted text-center">
            Donations are processed securely. You will receive a confirmation email.
          </p>
        </form>
      </div>
    </div>
  );
}
