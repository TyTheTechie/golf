"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import Link from "next/link";

interface OutbidInfo {
  auctionItemId: string;
  itemTitle: string;
  newAmount: number;
}

export default function OutbidToast() {
  const [notifications, setNotifications] = useState<OutbidInfo[]>([]);

  useEffect(() => {
    function handleOutbid(e: CustomEvent<OutbidInfo>) {
      setNotifications((prev) => [...prev, e.detail]);
      // Auto-dismiss after 8s
      setTimeout(() => {
        setNotifications((prev) => prev.slice(1));
      }, 8000);
    }

    window.addEventListener("outbid", handleOutbid as EventListener);
    return () => window.removeEventListener("outbid", handleOutbid as EventListener);
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((n, i) => (
        <div
          key={`${n.auctionItemId}-${i}`}
          className="bg-white border border-red-200 rounded-xl p-4 shadow-lg animate-fade-in-up"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">You&apos;ve been outbid!</p>
              <p className="text-xs text-muted mt-0.5">
                {n.itemTitle} - New bid: ${(n.newAmount / 100).toFixed(2)}
              </p>
              <Link
                href={`/auction/${n.auctionItemId}`}
                className="text-xs text-accent font-medium hover:underline mt-1 inline-block"
              >
                Bid Again &rarr;
              </Link>
            </div>
            <button
              onClick={() => setNotifications((prev) => prev.filter((_, idx) => idx !== i))}
              className="p-1 hover:bg-muted-bg rounded"
            >
              <X size={14} className="text-muted" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
