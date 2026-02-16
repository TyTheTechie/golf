import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
]);

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const EXT_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/svg+xml": "svg",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "sponsor";

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
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

    const ext = EXT_MAP[file.type];
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (type === "photo") {
      // Photo gallery upload — requires admin
      const session = await auth();
      if (!session?.user || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const caption = (formData.get("caption") as string) || null;
      const photoCount = await prisma.photo.count();
      const filename = `photo-${Date.now()}.${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "photos");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);

      const url = `/uploads/photos/${filename}`;
      await prisma.photo.create({
        data: { url, caption, sortOrder: photoCount },
      });

      return NextResponse.json({ url });
    }

    if (type === "auction") {
      // Auction image upload — requires admin
      const session = await auth();
      if (!session?.user || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const auctionItemId = formData.get("auctionItemId") as string | null;
      if (!auctionItemId) {
        return NextResponse.json(
          { error: "auctionItemId is required" },
          { status: 400 }
        );
      }

      const item = await prisma.auctionItem.findUnique({
        where: { id: auctionItemId },
      });
      if (!item) {
        return NextResponse.json(
          { error: "Auction item not found" },
          { status: 404 }
        );
      }

      const filename = `${auctionItemId}-${Date.now()}.${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "auctions");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);

      const imageUrl = `/uploads/auctions/${filename}`;
      await prisma.auctionItem.update({
        where: { id: auctionItemId },
        data: { imageUrl },
      });

      return NextResponse.json({ url: imageUrl });
    }

    // Sponsor logo upload (default)
    const sponsorId = formData.get("sponsorId") as string | null;
    if (!sponsorId) {
      return NextResponse.json(
        { error: "sponsorId is required" },
        { status: 400 }
      );
    }

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

    const filename = `${sponsorId}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "sponsors");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    const logoUrl = `/uploads/sponsors/${filename}`;
    await prisma.sponsorRegistration.update({
      where: { id: sponsorId },
      data: { logoUrl },
    });

    return NextResponse.json({ url: logoUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
