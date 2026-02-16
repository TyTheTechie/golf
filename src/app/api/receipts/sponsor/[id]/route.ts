import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateSponsorReceipt } from "@/lib/pdf-receipts";
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
  const sponsor = await prisma.sponsorRegistration.findUnique({ where: { id } });
  if (!sponsor) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (
    session.user.role !== "admin" &&
    session.user.email?.toLowerCase() !== sponsor.contactEmail.toLowerCase()
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const pdf = generateSponsorReceipt(sponsor);

  return new Response(pdf.buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="sponsor-receipt-${id.slice(0, 8)}.pdf"`,
    },
  });
}
