"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { sendEmailBlast } from "./actions";

export default function EmailBlastPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<"all" | "golfers" | "sponsors" | "donors">("all");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent?: number; error?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!confirm(`Send this email to ${audience === "all" ? "ALL registered participants" : audience}?`)) return;

    setSending(true);
    setResult(null);

    const res = await sendEmailBlast({ subject, message, audience });
    setResult(res);
    setSending(false);

    if (res.sent) {
      setSubject("");
      setMessage("");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Email Blast</h1>

      {result?.sent && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle size={16} />
          Email sent to {result.sent} recipient{result.sent !== 1 ? "s" : ""}.
        </div>
      )}

      {result?.error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {result.error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-card-bg border border-card-border rounded-xl p-6 space-y-4 max-w-2xl"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Audience
          </label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as typeof audience)}
            className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
          >
            <option value="all">All Participants</option>
            <option value="golfers">Golfers Only</option>
            <option value="sponsors">Sponsors Only</option>
            <option value="donors">Donors Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Subject *
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="Thank you for participating!"
            className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Message *
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={6}
            placeholder="Write your message here..."
            className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none"
          />
          <p className="text-xs text-muted mt-1">Plain text. Line breaks will be preserved.</p>
        </div>

        <button
          type="submit"
          disabled={sending}
          className="w-full py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Send size={16} />
          {sending ? "Sending..." : "Send Email Blast"}
        </button>
      </form>
    </div>
  );
}
