"use server";

import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { square } from "@/lib/square";
import { SPONSOR_TIERS } from "@/lib/sponsor-tiers";
import { validateAccessCode } from "@/lib/access-code";
import crypto from "crypto";

const sponsorSchema = z.object({
  tier: z.enum(["platinum", "gold", "silver", "bronze", "hole"]),
  companyName: z.string().min(2),
  contactName: z.string().min(2),
  contactEmail: z.email(),
  contactPhone: z.string().optional(),
  paymentToken: z.string().min(1),
  accessCode: z.string().min(1, "Event access code is required"),
});

export async function submitSponsorRegistration(input: {
  tier: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  paymentToken: string;
  accessCode: string;
}): Promise<{ registrationId?: string; error?: string }> {
  const parsed = sponsorSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { tier, companyName, contactName, contactEmail, contactPhone, paymentToken, accessCode } =
    parsed.data;

  const codeResult = await validateAccessCode(accessCode);
  if (!codeResult.valid) {
    return { error: "Invalid access code. Please check your invitation." };
  }

  const tierConfig = SPONSOR_TIERS.find((t) => t.id === tier);
  if (!tierConfig) {
    return { error: "Invalid sponsorship tier" };
  }

  const amount = tierConfig.price;

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

  const registration = await prisma.sponsorRegistration.create({
    data: {
      companyName,
      contactName,
      contactEmail,
      contactPhone: contactPhone || null,
      tier,
      amount,
      paymentId,
      paymentStatus: "completed",
    },
  });

  return { registrationId: registration.id };
}
