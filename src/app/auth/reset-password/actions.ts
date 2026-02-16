"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ success?: boolean; error?: string }> {
  if (newPassword.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    return { error: "Invalid or expired reset link. Please request a new one." };
  }

  if (new Date() > resetToken.expires) {
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
    return { error: "This reset link has expired. Please request a new one." };
  }

  const user = await prisma.user.findUnique({
    where: { email: resetToken.email },
  });

  if (!user) {
    return { error: "Account not found." };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  // Delete all tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email: resetToken.email },
  });

  return { success: true };
}
