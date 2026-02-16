"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";
import { sendEmail } from "@/lib/email";
import { donationConfirmationEmail } from "@/lib/email-templates";

const donationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Valid email is required"),
  amount: z.number().min(100, "Minimum donation is $1.00"),
  message: z.string().optional(),
});

export async function submitDonation(input: {
  name: string;
  email: string;
  amount: number;
  message?: string;
}) {
  const parsed = donationSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const donation = await prisma.donation.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      amount: parsed.data.amount,
      message: parsed.data.message,
      paymentStatus: "completed", // For now, mark as completed directly
    },
  });

  // Fire-and-forget confirmation email
  const emailTemplate = donationConfirmationEmail({
    name: parsed.data.name,
    amount: parsed.data.amount,
  });
  sendEmail({ to: parsed.data.email, ...emailTemplate });

  return { donation: { id: donation.id } };
}
