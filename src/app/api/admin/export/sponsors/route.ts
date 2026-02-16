import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sponsors = await prisma.sponsorRegistration.findMany({
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "Company Name", "Contact Name", "Contact Email", "Contact Phone",
    "Tier", "Amount", "Payment Status", "Payment ID", "Logo URL", "Date",
  ];

  const rows = sponsors.map((s) => [
    s.companyName,
    s.contactName,
    s.contactEmail,
    s.contactPhone || "",
    s.tier,
    (s.amount / 100).toFixed(2),
    s.paymentStatus,
    s.paymentId || "",
    s.logoUrl || "",
    new Date(s.createdAt).toISOString(),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="sponsor-registrations-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
