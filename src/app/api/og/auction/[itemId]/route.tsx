import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params;
  const item = await prisma.auctionItem.findUnique({ where: { id: itemId } });

  const title = item?.title || "Auction Item";
  const bid = item?.currentBid || item?.startingBid || 0;
  const bidLabel = item?.currentBid ? "Current Bid" : "Starting Bid";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f9f0",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "20px",
            border: "3px solid #d4e8d4",
            maxWidth: "90%",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#9971;</div>
          <div style={{ fontSize: 20, color: "#2d6a2d", fontWeight: 700, marginBottom: 8 }}>
            JMC Charities Auction
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#1a2e1a", textAlign: "center", marginBottom: 24 }}>
            {title}
          </div>
          <div style={{ fontSize: 16, color: "#6b8f6b", marginBottom: 8 }}>
            {bidLabel}
          </div>
          <div style={{ fontSize: 48, fontWeight: 800, color: "#2d6a2d" }}>
            ${(bid / 100).toFixed(2)}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
