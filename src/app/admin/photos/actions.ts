"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function deletePhoto(photoId: string) {
  await requireAdmin();

  const photo = await prisma.photo.findUnique({ where: { id: photoId } });
  if (!photo) return { error: "Photo not found" };

  // Delete file from disk
  try {
    const filePath = path.join(process.cwd(), "public", photo.url);
    await unlink(filePath);
  } catch {
    // File may not exist, continue with DB deletion
  }

  await prisma.photo.delete({ where: { id: photoId } });
  return { success: true };
}
