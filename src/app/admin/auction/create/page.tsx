"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createAuctionItem } from "../../actions";

export default function CreateAuctionItemPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startingBid, setStartingBid] = useState("25.00");
  const [bidIncrement, setBidIncrement] = useState("5.00");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await createAuctionItem({
      title,
      description,
      imageUrl: imageUrl || undefined,
      startingBid: Math.round(parseFloat(startingBid) * 100),
      bidIncrement: Math.round(parseFloat(bidIncrement) * 100),
      endTime: endTime || undefined,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/auction");
    }
  }

  return (
    <div>
      <Link
        href="/admin/auction"
        className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-6"
      >
        <ArrowLeft size={16} /> Back to Auction
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-6">Create Auction Item</h1>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-xl bg-card-bg border border-card-border rounded-xl p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Starting Bid ($) *</label>
            <input
              type="number"
              value={startingBid}
              onChange={(e) => setStartingBid(e.target.value)}
              required
              min="1"
              step="0.01"
              className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Bid Increment ($) *</label>
            <input
              type="number"
              value={bidIncrement}
              onChange={(e) => setBidIncrement(e.target.value)}
              required
              min="1"
              step="0.01"
              className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">End Time (optional)</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Auction Item"}
        </button>
      </form>
    </div>
  );
}
