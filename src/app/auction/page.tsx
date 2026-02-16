"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Gavel } from "lucide-react";
import AuctionItemCard from "@/components/auction/AuctionItemCard";
import BidModal from "@/components/auction/BidModal";
import OutbidToast from "@/components/auction/OutbidToast";
import { getAuctionItems, placeBid } from "./actions";

interface AuctionItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  startingBid: number;
  currentBid: number;
  bidIncrement: number;
  endTime: Date | null;
  _count: { bids: number };
}

export default function AuctionPage() {
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [bidItem, setBidItem] = useState<AuctionItem | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getAuctionItems().then((data) => {
      if (!cancelled) setItems(data as unknown as AuctionItem[]);
    });
    return () => { cancelled = true; };
  }, []);

  // SSE connection for real-time updates
  useEffect(() => {
    const eventSource = new EventSource("/api/auction/events");

    eventSource.addEventListener("bid-update", (e) => {
      const data = JSON.parse(e.data);
      setItems((prev) =>
        prev.map((item) =>
          item.id === data.auctionItemId
            ? {
                ...item,
                currentBid: data.amount,
                _count: { bids: item._count.bids + 1 },
              }
            : item
        )
      );
      // Also update modal if open
      setBidItem((prev) => {
        if (!prev || prev.id !== data.auctionItemId) return prev;
        return { ...prev, currentBid: data.amount };
      });
    });

    eventSource.addEventListener("outbid", (e) => {
      const data = JSON.parse(e.data);
      window.dispatchEvent(new CustomEvent("outbid", { detail: data }));
    });

    eventSource.onerror = () => {
      // Reconnect after 5s
      eventSource.close();
      setTimeout(() => {
        // Will re-mount the effect
      }, 5000);
    };

    return () => eventSource.close();
  }, []);

  async function handleBid(amount: number) {
    if (!bidItem) return;
    setError("");
    const result = await placeBid(bidItem.id, amount);
    if (result.error) {
      setError(result.error);
    } else {
      setBidItem(null);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Gavel className="text-accent" size={32} />
              Live Auction
            </h1>
            <p className="text-muted mt-1">
              Place your bids on exclusive items - all proceeds benefit our charities.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            &larr; Back to Home
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-20">
            <Gavel size={48} className="text-muted/30 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-foreground mb-2">
              No Active Auctions
            </h2>
            <p className="text-muted">
              Check back soon - auction items will appear here when bidding opens.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <AuctionItemCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                imageUrl={item.imageUrl}
                currentBid={item.currentBid}
                startingBid={item.startingBid}
                endTime={item.endTime?.toISOString() ?? null}
                bidCount={item._count.bids}
                onBid={() => setBidItem(item)}
              />
            ))}
          </div>
        )}
      </div>

      {bidItem && (
        <BidModal
          itemTitle={bidItem.title}
          currentBid={bidItem.currentBid}
          startingBid={bidItem.startingBid}
          bidIncrement={bidItem.bidIncrement}
          onBid={handleBid}
          onClose={() => setBidItem(null)}
        />
      )}

      <OutbidToast />
    </div>
  );
}
