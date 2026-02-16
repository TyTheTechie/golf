"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="text-center py-16">
      <h2 className="text-xl font-bold text-foreground mb-2">
        Something went wrong
      </h2>
      <p className="text-muted mb-6">{error.message || "An unexpected error occurred."}</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="px-5 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/admin"
          className="px-5 py-2 border border-card-border rounded-lg font-medium text-foreground hover:bg-muted-bg transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
