"use client";

import { useRouter } from "next/navigation";
import { updateAuctionItemStatus } from "../actions";

interface AuctionItem {
  id: string;
  title: string;
  status: string;
  currentBid: number;
  startingBid: number;
  endTime: Date | null;
  _count: { bids: number };
}

const statusActions: Record<string, { label: string; next: "draft" | "active" | "completed" | "cancelled"; color: string }[]> = {
  draft: [
    { label: "Start Auction", next: "active", color: "bg-green-600 hover:bg-green-700" },
    { label: "Cancel", next: "cancelled", color: "bg-red-600 hover:bg-red-700" },
  ],
  active: [
    { label: "Complete", next: "completed", color: "bg-blue-600 hover:bg-blue-700" },
    { label: "Cancel", next: "cancelled", color: "bg-red-600 hover:bg-red-700" },
  ],
  completed: [],
  cancelled: [
    { label: "Reopen as Draft", next: "draft", color: "bg-gray-600 hover:bg-gray-700" },
  ],
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  active: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AuctionAdminList({ items }: { items: AuctionItem[] }) {
  const router = useRouter();

  async function handleStatusChange(itemId: string, status: "draft" | "active" | "completed" | "cancelled") {
    await updateAuctionItemStatus(itemId, status);
    router.refresh();
  }

  if (items.length === 0) {
    return <p className="text-muted text-center py-12">No auction items yet.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-card-bg border border-card-border rounded-xl p-5 flex items-center justify-between gap-4"
        >
          <div className="min-w-0">
            <h3 className="font-medium text-foreground">{item.title}</h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                {item.status}
              </span>
              <span>
                {item.currentBid > 0
                  ? `$${(item.currentBid / 100).toFixed(2)} current`
                  : `$${(item.startingBid / 100).toFixed(2)} starting`}
              </span>
              <span>{item._count.bids} bids</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {(statusActions[item.status] || []).map((action) => (
              <button
                key={action.next}
                onClick={() => handleStatusChange(item.id, action.next)}
                className={`px-3 py-1.5 text-white text-xs font-medium rounded-lg transition-colors ${action.color}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
