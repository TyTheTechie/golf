"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Gavel } from "lucide-react";
import AuctionCountdown from "@/components/auction/AuctionCountdown";
import BidHistory from "@/components/auction/BidHistory";
import BidModal from "@/components/auction/BidModal";
import OutbidToast from "@/components/auction/OutbidToast";
import { getAuctionItem, placeBid } from "../actions";

interface Bid {
  id: string;
  amount: number;
  createdAt: Date;
  user: { name: string | null; id: string };
}

interface AuctionItemDetail {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  startingBid: number;
  currentBid: number;
  bidIncrement: number;
  status: string;
  endTime: Date | null;
  bids: Bid[];
}

export default function AuctionItemPage() {
  const params = useParams();
  const itemId = params.itemId as string;
  const [item, setItem] = useState<AuctionItemDetail | null>(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [error, setError] = useState("");

  const loadItem = useCallback(async () => {
    const data = await getAuctionItem(itemId);
    if (data) setItem(data as unknown as AuctionItemDetail);
  }, [itemId]);

  useEffect(() => {
    let cancelled = false;
    getAuctionItem(itemId).then((data) => {
      if (!cancelled && data) setItem(data as unknown as AuctionItemDetail);
    });
    return () => { cancelled = true; };
  }, [itemId]);

  // SSE for real-time updates
  useEffect(() => {
    const eventSource = new EventSource("/api/auction/events");

    eventSource.addEventListener("bid-update", (e) => {
      const data = JSON.parse(e.data);
      if (data.auctionItemId === itemId) {
        // Reload item to get updated bid history
        loadItem();
      }
    });

    eventSource.addEventListener("outbid", (e) => {
      const data = JSON.parse(e.data);
      window.dispatchEvent(new CustomEvent("outbid", { detail: data }));
    });

    return () => eventSource.close();
  }, [itemId, loadItem]);

  async function handleBid(amount: number) {
    setError("");
    const result = await placeBid(itemId, amount);
    if (result.error) {
      setError(result.error);
    } else {
      setShowBidModal(false);
      loadItem();
    }
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const displayBid = item.currentBid > 0 ? item.currentBid : item.startingBid;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/auction"
          className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-8"
        >
          <ArrowLeft size={16} /> Back to Auction
        </Link>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div>
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full rounded-xl object-cover aspect-square"
              />
            ) : (
              <div className="w-full rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 aspect-square flex items-center justify-center">
                <Gavel size={64} className="text-accent/30" />
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <AuctionCountdown endTime={item.endTime?.toISOString?.() ?? (item.endTime as unknown as string)} />
            <h1 className="text-2xl font-bold text-foreground mt-2 mb-3">
              {item.title}
            </h1>
            <p className="text-muted mb-6">{item.description}</p>

            <div className="bg-muted-bg rounded-xl p-5 mb-6">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-sm text-muted">
                    {item.currentBid > 0 ? "Current Bid" : "Starting Bid"}
                  </span>
                  <p className="text-3xl font-bold text-accent">
                    ${(displayBid / 100).toFixed(2)}
                  </p>
                </div>
                <span className="text-sm text-muted">
                  {item.bids.length} bid{item.bids.length !== 1 ? "s" : ""}
                </span>
              </div>

              <button
                onClick={() => setShowBidModal(true)}
                disabled={item.status !== "active"}
                className="w-full mt-4 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
              >
                {item.status === "active" ? "Place Bid" : "Auction Ended"}
              </button>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-3">Bid History</h3>
              <BidHistory
                bids={item.bids.map((b) => ({
                  ...b,
                  createdAt: b.createdAt.toString(),
                  user: { name: b.user.name },
                }))}
              />
            </div>
          </div>
        </div>
      </div>

      {showBidModal && (
        <BidModal
          itemTitle={item.title}
          currentBid={item.currentBid}
          startingBid={item.startingBid}
          bidIncrement={item.bidIncrement}
          onBid={handleBid}
          onClose={() => setShowBidModal(false)}
        />
      )}

      <OutbidToast />
    </div>
  );
}
