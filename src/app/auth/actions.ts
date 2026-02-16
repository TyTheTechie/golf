"use server";

import { z } from "zod/v4";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { validateAccessCode } from "@/lib/access-code";

export type AuthActionState = {
  error?: string;
  success?: boolean;
};

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  accessCode: z.string().min(1, "Event access code is required"),
});

const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    accessCode: formData.get("accessCode"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, username, email, password, accessCode } = parsed.data;

  const codeResult = await validateAccessCode(accessCode);
  if (!codeResult.valid) {
    return { error: "Invalid access code" };
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return { error: "An account with this email already exists" };
  }

  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) {
    return { error: "This username is already taken" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: { name, username, email, password: hashedPassword },
  });

  // If signed up with a team invite code, auto-create a pending join request
  if (codeResult.type === "team") {
    const reg = await prisma.golferRegistration.findUnique({
      where: { id: codeResult.registrationId },
    });
    if (reg) {
      // Check team isn't full (count filled player slots)
      const filledSlots = [reg.player1Name, reg.player2Name, reg.player3Name, reg.player4Name].filter(Boolean).length;
      if (filledSlots < 4) {
        await prisma.teamJoinRequest.create({
          data: {
            registrationId: codeResult.registrationId,
            userId: newUser.id,
            playerName: name,
            playerEmail: email,
          },
        });
      }
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch {
    // User was created successfully even if auto-signin fails
    return { success: true };
  }
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    throw error;
  }
}
