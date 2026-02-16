"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { waitlistNotificationEmail } from "@/lib/email-templates";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
}

export async function getWaitlistEntries() {
  return prisma.waitlistEntry.findMany({ orderBy: { createdAt: "desc" } });
}

export async function notifyWaitlistEntry(id: string) {
  await requireAdmin();

  const entry = await prisma.waitlistEntry.findUnique({ where: { id } });
  if (!entry) return { error: "Not found" };

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const emailTemplate = waitlistNotificationEmail({
    name: entry.name,
    registerUrl: `${baseUrl}/register/golfer`,
  });

  await sendEmail({ to: entry.email, ...emailTemplate });

  await prisma.waitlistEntry.update({
    where: { id },
    data: { notifiedAt: new Date() },
  });

  return { success: true };
}

export async function deleteWaitlistEntry(id: string) {
  await requireAdmin();
  await prisma.waitlistEntry.delete({ where: { id } });
  return { success: true };
}
