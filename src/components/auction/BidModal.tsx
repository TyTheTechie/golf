"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface BidModalProps {
  itemTitle: string;
  currentBid: number;
  startingBid: number;
  bidIncrement: number;
  onBid: (amount: number) => Promise<void>;
  onClose: () => void;
}

export default function BidModal({
  itemTitle,
  currentBid,
  startingBid,
  bidIncrement,
  onBid,
  onClose,
}: BidModalProps) {
  const minimumBid = currentBid > 0 ? currentBid + bidIncrement : startingBid;
  const [amount, setAmount] = useState(minimumBid);
  const [loading, setLoading] = useState(false);

  const quickBids = [
    minimumBid,
    minimumBid + bidIncrement,
    minimumBid + bidIncrement * 2,
    minimumBid + bidIncrement * 5,
  ];

  async function handleSubmit() {
    setLoading(true);
    await onBid(amount);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-card-bg rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Place a Bid</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted-bg rounded-lg transition-colors"
          >
            <X size={20} className="text-muted" />
          </button>
        </div>

        <p className="text-sm text-muted mb-4">{itemTitle}</p>

        <div className="bg-muted-bg rounded-lg p-3 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Current Bid</span>
            <span className="font-bold text-foreground">
              ${(currentBid / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-muted">Minimum Bid</span>
            <span className="font-medium text-accent">
              ${(minimumBid / 100).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Quick Bid
          </label>
          <div className="grid grid-cols-2 gap-2">
            {quickBids.map((qb) => (
              <button
                key={qb}
                onClick={() => setAmount(qb)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  amount === qb
                    ? "bg-accent text-white"
                    : "bg-muted-bg text-foreground hover:bg-accent/10"
                }`}
              >
                ${(qb / 100).toFixed(2)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-1">
            Custom Amount ($)
          </label>
          <input
            type="number"
            value={(amount / 100).toFixed(2)}
            onChange={(e) => setAmount(Math.round(parseFloat(e.target.value) * 100) || minimumBid)}
            min={(minimumBid / 100).toFixed(2)}
            step="0.01"
            className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || amount < minimumBid}
          className="w-full py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Placing Bid..." : `Bid $${(amount / 100).toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
