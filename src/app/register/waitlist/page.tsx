"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import { submitWaitlist } from "./actions";

export default function WaitlistPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"individual" | "team">("individual");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await submitWaitlist({ name, email, phone: phone || undefined, type });
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="bg-card-bg border border-card-border rounded-xl p-10 text-center max-w-md">
            <CheckCircle size={48} className="mx-auto text-accent mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">You&apos;re on the Waitlist!</h2>
            <p className="text-muted mb-6">
              We&apos;ll notify you by email as soon as a spot opens up.
            </p>
            <Link href="/" className="px-5 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto px-4 py-12 pt-24">
          <Link href="/register" className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-6">
            <ArrowLeft size={16} /> Back
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <Clock size={28} className="text-gold" />
            <h1 className="text-3xl font-bold text-foreground">Join the Waitlist</h1>
          </div>
          <p className="text-muted mb-8">
            Registration is currently full, but spots may open up. Join the waitlist and we&apos;ll notify you!
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="bg-card-bg border border-card-border rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Registration Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as "individual" | "team")}
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none">
                <option value="individual">Individual ($125)</option>
                <option value="team">Team of 4 ($500)</option>
              </select>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gold text-white rounded-lg font-medium hover:bg-gold-dark transition-colors disabled:opacity-50">
              {loading ? "Joining..." : "Join Waitlist"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
