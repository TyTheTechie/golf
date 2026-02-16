import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const volunteers = await prisma.volunteer.findMany({
    orderBy: { createdAt: "desc" },
  });

  const header = "Name,Email,Phone,Roles,Shirt Size,Notes,Signed Up";
  const rows = volunteers.map((v) => {
    const roles = JSON.parse(v.roles).join("; ");
    return [
      v.name,
      v.email,
      v.phone || "",
      roles,
      v.shirtSize || "",
      (v.notes || "").replace(/,/g, ";"),
      new Date(v.createdAt).toLocaleDateString(),
    ].map((f) => `"${f}"`).join(",");
  });

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="volunteers-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
