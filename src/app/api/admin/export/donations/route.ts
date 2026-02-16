import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: "desc" },
  });

  const header = "Name,Email,Amount,Message,Payment Status,Date\n";
  const rows = donations
    .map(
      (d) =>
        `"${d.name}","${d.email}","$${(d.amount / 100).toFixed(2)}","${(d.message || "").replace(/"/g, '""')}","${d.paymentStatus}","${new Date(d.createdAt).toLocaleDateString()}"`
    )
    .join("\n");

  return new NextResponse(header + rows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="donations-${Date.now()}.csv"`,
    },
  });
}
