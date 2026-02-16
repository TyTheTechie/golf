"use server";

import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { square, PRICES } from "@/lib/square";
import { auth } from "@/auth";
import { validateAccessCode, generateInviteCode } from "@/lib/access-code";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
import { golferConfirmationEmail } from "@/lib/email-templates";
import { sendSMS } from "@/lib/sms";
import { registrationConfirmation } from "@/lib/sms-templates";

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
  promoCode: z.string().optional(),
});

export async function submitGolferRegistration(input: {
  type: string;
  teamName?: string;
  players: { name: string; email: string; phone: string }[];
  paymentToken: string;
  accessCode: string;
  promoCode?: string;
}): Promise<{ registrationId?: string; error?: string }> {
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { type, teamName, players, paymentToken, accessCode, promoCode } = parsed.data;

  const codeResult = await validateAccessCode(accessCode);
  if (!codeResult.valid) {
    return { error: "Invalid access code. Please check your invitation." };
  }

  // Check capacity
  const maxRegSetting = await prisma.siteSetting.findUnique({ where: { key: "MAX_REGISTRATIONS" } });
  if (maxRegSetting) {
    const currentCount = await prisma.golferRegistration.count({
      where: { paymentStatus: "completed" },
    });
    if (currentCount >= parseInt(maxRegSetting.value)) {
      return { error: "registration-full" };
    }
  }

  let amount = type === "individual" ? PRICES.individual : PRICES.team;
  let promoCodeId: string | undefined;
  let discountAmount = 0;

  // Validate promo code
  if (promoCode) {
    const promo = await prisma.promoCode.findUnique({ where: { code: promoCode.toUpperCase() } });
    if (!promo || !promo.active) {
      return { error: "Invalid promo code" };
    }
    if (promo.maxUses > 0 && promo.currentUses >= promo.maxUses) {
      return { error: "This promo code has reached its usage limit" };
    }
    if (promo.expiresAt && new Date() > promo.expiresAt) {
      return { error: "This promo code has expired" };
    }

    discountAmount = promo.type === "percentage"
      ? Math.round(amount * (promo.value / 100))
      : promo.value;
    discountAmount = Math.min(discountAmount, amount);
    promoCodeId = promo.id;
    amount = amount - discountAmount;
  }

  // Process Square payment
  let paymentId: string | undefined;
  if (amount > 0) {
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
  }

  // Save registration (use transaction to also update promo usage)
  const registration = await prisma.$transaction(async (tx) => {
    const reg = await tx.golferRegistration.create({
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
        amount: amount + discountAmount, // store original amount
        discountAmount,
        promoCodeId: promoCodeId || null,
        paymentId: paymentId || null,
        paymentStatus: "completed",
      },
    });

    if (promoCodeId) {
      await tx.promoCode.update({
        where: { id: promoCodeId },
        data: { currentUses: { increment: 1 } },
      });
    }

    return reg;
  });

  // For team registrations: assign captain and generate invite code
  let finalInviteCode: string | undefined;
  if (type === "team") {
    const updateData: { captainUserId?: string; inviteCode?: string } = {};

    const session = await auth();
    if (session?.user?.id && session.user.email?.toLowerCase() === players[0].email.toLowerCase()) {
      updateData.captainUserId = session.user.id;
    }

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
    amount: amount + discountAmount,
    inviteCode: finalInviteCode,
  });
  sendEmail({ to: players[0].email, ...emailTemplate });

  // Fire-and-forget SMS
  if (players[0].phone) {
    sendSMS({ to: players[0].phone, body: registrationConfirmation(players[0].name, type) });
  }

  return { registrationId: registration.id };
}
