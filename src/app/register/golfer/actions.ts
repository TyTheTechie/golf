"use server";

import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { square, PRICES } from "@/lib/square";
import { auth } from "@/auth";
import { validateAccessCode, generateInviteCode } from "@/lib/access-code";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
import { golferConfirmationEmail } from "@/lib/email-templates";

const playerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
});

const registrationSchema = z.object({
  type: z.enum(["individual", "team"]),
  teamName: z.string().optional(),
  players: z.array(playerSchema).min(1).max(4),
  paymentToken: z.string().min(1),
  accessCode: z.string().min(1, "Event access code is required"),
});

export async function submitGolferRegistration(input: {
  type: string;
  teamName?: string;
  players: { name: string; email: string; phone: string }[];
  paymentToken: string;
  accessCode: string;
}): Promise<{ registrationId?: string; error?: string }> {
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { type, teamName, players, paymentToken, accessCode } = parsed.data;

  const codeResult = await validateAccessCode(accessCode);
  if (!codeResult.valid) {
    return { error: "Invalid access code. Please check your invitation." };
  }
  const amount = type === "individual" ? PRICES.individual : PRICES.team;

  // Process Square payment
  let paymentId: string | undefined;
  try {
    const response = await square.payments.create({
      sourceId: paymentToken,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: BigInt(amount),
        currency: "USD",
      },
    });
    paymentId = response.payment?.id;
  } catch (err) {
    console.error("Square payment error:", err);
    return { error: "Payment failed. Please try again." };
  }

  // Save registration
  const registration = await prisma.golferRegistration.create({
    data: {
      type,
      teamName,
      player1Name: players[0].name,
      player1Email: players[0].email,
      player1Phone: players[0].phone || null,
      player2Name: players[1]?.name || null,
      player2Email: players[1]?.email || null,
      player2Phone: players[1]?.phone || null,
      player3Name: players[2]?.name || null,
      player3Email: players[2]?.email || null,
      player3Phone: players[2]?.phone || null,
      player4Name: players[3]?.name || null,
      player4Email: players[3]?.email || null,
      player4Phone: players[3]?.phone || null,
      amount,
      paymentId,
      paymentStatus: "completed",
    },
  });

  // Send confirmation email
  let finalInviteCode: string | undefined;

  // For team registrations: assign captain and generate invite code
  if (type === "team") {
    const updateData: { captainUserId?: string; inviteCode?: string } = {};

    const session = await auth();
    if (session?.user?.id && session.user.email?.toLowerCase() === players[0].email.toLowerCase()) {
      updateData.captainUserId = session.user.id;
    }

    // Generate unique invite code with collision retry
    for (let attempt = 0; attempt < 10; attempt++) {
      const code = generateInviteCode();
      const existing = await prisma.golferRegistration.findUnique({ where: { inviteCode: code } });
      if (!existing) {
        updateData.inviteCode = code;
        break;
      }
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.golferRegistration.update({
        where: { id: registration.id },
        data: updateData,
      });
    }
    finalInviteCode = updateData.inviteCode;
  }

  // Fire-and-forget confirmation email
  const emailTemplate = golferConfirmationEmail({
    playerName: players[0].name,
    type,
    teamName: teamName || undefined,
    amount,
    inviteCode: finalInviteCode,
  });
  sendEmail({ to: players[0].email, ...emailTemplate });

  return { registrationId: registration.id };
}
