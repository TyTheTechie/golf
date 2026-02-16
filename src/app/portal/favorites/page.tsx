import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Heart, Gavel } from "lucide-react";
import { redirect } from "next/navigation";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const favorites = await prisma.auctionFavorite.findMany({
    where: { userId: session.user.id },
    include: {
      auctionItem: {
        include: { _count: { select: { bids: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 pt-24">
        <Link
          href="/portal"
          className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors text-sm mb-6"
        >
          <ArrowLeft size={16} /> Back to Portal
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Heart className="text-red-500" size={24} />
            My Favorites
          </h1>
          <p className="text-muted mt-1">Auction items you&apos;re watching</p>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-card-bg border border-card-border rounded-xl p-10 text-center">
            <Heart size={48} className="mx-auto text-muted/30 mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">No Favorites Yet</h2>
            <p className="text-muted mb-6">
              Heart auction items to save them here for quick access.
            </p>
            <Link
              href="/auction"
              className="px-5 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors inline-block"
            >
              Browse Auction
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {favorites.map(({ auctionItem: item }) => (
              <Link
                key={item.id}
                href={`/auction/${item.id}`}
                className="bg-card-bg border border-card-border rounded-xl p-5 flex items-center gap-4 hover:border-accent/30 transition-colors"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted-bg flex items-center justify-center shrink-0">
                    <Gavel size={24} className="text-muted" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.status === "active"
                        ? "bg-green-100 text-green-700"
                        : item.status === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {item.status}
                    </span>
                    <span>
                      {item.currentBid > 0
                        ? `$${(item.currentBid / 100).toFixed(2)}`
                        : `$${(item.startingBid / 100).toFixed(2)} starting`}
                    </span>
                    <span>{item._count.bids} bids</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
