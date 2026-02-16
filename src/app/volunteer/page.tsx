"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, HandHeart, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import { submitVolunteerSignup } from "./actions";

const ROLES = [
  { id: "setup", label: "Event Setup" },
  { id: "registration", label: "Registration Desk" },
  { id: "beverage", label: "Beverage Cart" },
  { id: "scoring", label: "Scoring" },
  { id: "auction", label: "Auction Helper" },
  { id: "cleanup", label: "Cleanup" },
];

const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

export default function VolunteerPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [shirtSize, setShirtSize] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function toggleRole(role: string) {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await submitVolunteerSignup({
      name,
      email,
      phone: phone || undefined,
      roles,
      shirtSize: shirtSize || undefined,
      notes: notes || undefined,
    });

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
            <h2 className="text-2xl font-bold text-foreground mb-2">Thank You!</h2>
            <p className="text-muted mb-6">
              Your volunteer signup has been received. We&apos;ll be in touch with event-day details.
            </p>
            <Link
              href="/"
              className="px-5 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors"
            >
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
        <div className="max-w-xl mx-auto px-4 py-12 pt-24">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-6"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <HandHeart size={28} className="text-accent" />
            <h1 className="text-3xl font-bold text-foreground">Volunteer Signup</h1>
          </div>
          <p className="text-muted mb-8">
            Help make this tournament a success! Sign up to volunteer and choose the roles that interest you.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card-bg border border-card-border rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card-bg border border-card-border rounded-xl p-6">
              <label className="block text-sm font-medium text-foreground mb-3">Volunteer Roles *</label>
              <div className="grid sm:grid-cols-2 gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => toggleRole(role.id)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all border ${
                      roles.includes(role.id)
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-card-border text-foreground/70 hover:border-accent/50"
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card-bg border border-card-border rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">T-Shirt Size</label>
                <select
                  value={shirtSize}
                  onChange={(e) => setShirtSize(e.target.value)}
                  className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                >
                  <option value="">Select size...</option>
                  {SHIRT_SIZES.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any dietary restrictions, availability notes, etc."
                  className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || roles.length === 0}
              className="w-full py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Sign Up to Volunteer"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
