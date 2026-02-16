"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AuctionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Auction error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold text-foreground mb-2">
          Auction Error
        </h2>
        <p className="text-muted mb-6">
          We had trouble loading the auction. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2 border border-card-border rounded-lg font-medium text-foreground hover:bg-muted-bg transition-colors"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
