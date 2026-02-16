import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
]);

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const sponsorId = formData.get("sponsorId") as string | null;

    if (!file || !sponsorId) {
      return NextResponse.json(
        { error: "File and sponsorId are required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: PNG, JPG, SVG, WebP" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 2MB" },
        { status: 400 }
      );
    }

    // Verify sponsor exists and has completed payment
    const sponsor = await prisma.sponsorRegistration.findUnique({
      where: { id: sponsorId },
    });

    if (!sponsor) {
      return NextResponse.json(
        { error: "Sponsor registration not found" },
        { status: 404 }
      );
    }

    if (sponsor.paymentStatus !== "completed") {
      return NextResponse.json(
        { error: "Sponsor payment not completed" },
        { status: 403 }
      );
    }

    // Determine file extension from MIME type
    const extMap: Record<string, string> = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/svg+xml": "svg",
      "image/webp": "webp",
    };
    const ext = extMap[file.type];
    const filename = `${sponsorId}-${Date.now()}.${ext}`;

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "sponsors");
    await mkdir(uploadDir, { recursive: true });

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(uploadDir, filename), buffer);

    // Update sponsor record with logo URL
    const logoUrl = `/uploads/sponsors/${filename}`;
    await prisma.sponsorRegistration.update({
      where: { id: sponsorId },
      data: { logoUrl },
    });

    return NextResponse.json({ url: logoUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
