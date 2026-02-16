import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const registrations = await prisma.golferRegistration.findMany({
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "Type", "Team Name", "Invite Code",
    "Player 1 Name", "Player 1 Email", "Player 1 Phone",
    "Player 2 Name", "Player 2 Email", "Player 2 Phone",
    "Player 3 Name", "Player 3 Email", "Player 3 Phone",
    "Player 4 Name", "Player 4 Email", "Player 4 Phone",
    "Amount", "Payment Status", "Payment ID", "Date",
  ];

  const rows = registrations.map((r) => [
    r.type,
    r.teamName || "",
    r.inviteCode || "",
    r.player1Name, r.player1Email, r.player1Phone || "",
    r.player2Name || "", r.player2Email || "", r.player2Phone || "",
    r.player3Name || "", r.player3Email || "", r.player3Phone || "",
    r.player4Name || "", r.player4Email || "", r.player4Phone || "",
    (r.amount / 100).toFixed(2),
    r.paymentStatus,
    r.paymentId || "",
    new Date(r.createdAt).toISOString(),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="golfer-registrations-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
