"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user as { id: string; email: string };
}

export async function getProfile() {
  const user = await requireUser();
  return prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, username: true, email: true },
  });
}

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, hyphens, and underscores"
    ),
});

export async function updateProfile(input: { name: string; username: string }) {
  const user = await requireUser();

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Check username uniqueness
  const existing = await prisma.user.findUnique({
    where: { username: parsed.data.username },
  });
  if (existing && existing.id !== user.id) {
    return { error: "This username is already taken" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name, username: parsed.data.username },
  });

  return { success: true };
}
