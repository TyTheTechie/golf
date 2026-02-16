"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle } from "lucide-react";
import { getProfile, updateProfile } from "./actions";

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getProfile().then((data) => {
      if (data) {
        setName(data.name || "");
        setUsername(data.username || "");
      }
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const result = await updateProfile({ name, username });
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      await updateSession({ name });
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-12 pt-24">
        <Link
          href="/portal"
          className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-6"
        >
          <ArrowLeft size={16} /> Back to Portal
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-6">My Profile</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle size={16} /> Profile updated successfully
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-card-bg border border-card-border rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              value={session?.user?.email || ""}
              disabled
              className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-muted-bg text-muted cursor-not-allowed"
            />
            <p className="text-xs text-muted mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              pattern="^[a-zA-Z0-9_-]+$"
              className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
            <p className="text-xs text-muted mt-1">
              Letters, numbers, hyphens, and underscores only
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
