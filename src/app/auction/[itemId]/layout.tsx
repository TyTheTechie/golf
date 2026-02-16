import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ itemId: string }>;
}): Promise<Metadata> {
  const { itemId } = await params;
  const item = await prisma.auctionItem.findUnique({ where: { id: itemId } });

  if (!item) {
    return { title: "Auction Item Not Found" };
  }

  const bid = item.currentBid || item.startingBid;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return {
    title: `${item.title} - JMC Charities Auction`,
    description: item.description,
    openGraph: {
      title: item.title,
      description: `Current bid: $${(bid / 100).toFixed(2)} - ${item.description}`,
      images: [`${baseUrl}/api/og/auction/${itemId}`],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: `Current bid: $${(bid / 100).toFixed(2)}`,
      images: [`${baseUrl}/api/og/auction/${itemId}`],
    },
  };
}

export default function AuctionItemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
