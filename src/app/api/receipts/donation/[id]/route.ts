import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateDonationReceipt } from "@/lib/pdf-receipts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const donation = await prisma.donation.findUnique({ where: { id } });
  if (!donation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Allow owner (by email) or admin
  if (
    session.user.role !== "admin" &&
    session.user.email?.toLowerCase() !== donation.email.toLowerCase()
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const pdf = generateDonationReceipt(donation);

  return new Response(pdf.buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="donation-receipt-${id.slice(0, 8)}.pdf"`,
    },
  });
}
