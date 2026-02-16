"use client";

import Link from "next/link";
import Image from "next/image";
import { Gavel } from "lucide-react";
import AuctionCountdown from "./AuctionCountdown";

interface AuctionItemCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  currentBid: number;
  startingBid: number;
  endTime: string | null;
  bidCount: number;
  onBid: () => void;
}

export default function AuctionItemCard({
  id,
  title,
  description,
  imageUrl,
  currentBid,
  startingBid,
  endTime,
  bidCount,
  onBid,
}: AuctionItemCardProps) {
  const displayBid = currentBid > 0 ? currentBid : startingBid;
  const isStartingBid = currentBid === 0;

  return (
    <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      {imageUrl ? (
        <div className="h-48 bg-muted-bg relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
          <Gavel size={48} className="text-accent/30" />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <AuctionCountdown endTime={endTime} />
          <span className="text-xs text-muted">{bidCount} bid{bidCount !== 1 ? "s" : ""}</span>
        </div>

        <Link href={`/auction/${id}`}>
          <h3 className="text-lg font-bold text-foreground hover:text-accent transition-colors mb-1">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-muted line-clamp-2 mb-4">{description}</p>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs text-muted">
              {isStartingBid ? "Starting Bid" : "Current Bid"}
            </span>
            <p className="text-xl font-bold text-accent">
              ${(displayBid / 100).toFixed(2)}
            </p>
          </div>
          <button
            onClick={onBid}
            className="px-4 py-2 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors"
          >
            Place Bid
          </button>
        </div>
      </div>
    </div>
  );
}
