interface Bid {
  id: string;
  amount: number;
  createdAt: string | Date;
  user: { name: string | null };
}

export default function BidHistory({ bids }: { bids: Bid[] }) {
  if (bids.length === 0) {
    return <p className="text-sm text-muted py-4 text-center">No bids yet. Be the first!</p>;
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {bids.map((bid, i) => (
        <div
          key={bid.id}
          className={`flex items-center justify-between p-2.5 rounded-lg text-sm ${
            i === 0 ? "bg-accent/5 border border-accent/20" : "bg-muted-bg"
          }`}
        >
          <div>
            <span className="font-medium text-foreground">
              {bid.user.name || "Anonymous"}
            </span>
            {i === 0 && (
              <span className="ml-2 text-xs bg-accent text-white px-1.5 py-0.5 rounded-full">
                Highest
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="font-bold text-accent">
              ${(bid.amount / 100).toFixed(2)}
            </span>
            <span className="block text-xs text-muted">
              {new Date(bid.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
