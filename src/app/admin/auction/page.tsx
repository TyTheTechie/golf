import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AuctionAdminList from "./AuctionAdminList";

export default async function AdminAuctionPage() {
  const items = await prisma.auctionItem.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bids: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Auction Items</h1>
        <Link
          href="/admin/auction/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors"
        >
          <Plus size={18} /> New Item
        </Link>
      </div>

      <AuctionAdminList items={items} />
    </div>
  );
}
