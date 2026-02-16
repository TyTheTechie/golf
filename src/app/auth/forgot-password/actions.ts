"use server";

import { z } from "zod/v4";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { passwordResetEmail } from "@/lib/email-templates";

const schema = z.object({
  email: z.email("Please enter a valid email address"),
});

export async function requestPasswordReset(
  email: string
): Promise<{ success?: boolean; error?: string }> {
  const parsed = schema.safeParse({ email });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const normalizedEmail = parsed.data.email.toLowerCase();

  // Always return success to prevent email enumeration
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user || !user.password) {
    // User doesn't exist or uses OAuth only — silently succeed
    return { success: true };
  }

  // Delete any existing tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email: normalizedEmail },
  });

  // Generate a secure token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      email: normalizedEmail,
      token,
      expires,
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

  const emailTemplate = passwordResetEmail({ resetUrl });
  sendEmail({ to: normalizedEmail, ...emailTemplate });

  return { success: true };
}
