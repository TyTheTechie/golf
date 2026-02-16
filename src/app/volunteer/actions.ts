"use server";

import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { volunteerConfirmationEmail } from "@/lib/email-templates";

const volunteerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Valid email is required"),
  phone: z.string().optional(),
  roles: z.array(z.string()).min(1, "Select at least one role"),
  shirtSize: z.string().optional(),
  notes: z.string().optional(),
});

export async function submitVolunteerSignup(input: {
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  shirtSize?: string;
  notes?: string;
}): Promise<{ success?: boolean; error?: string }> {
  const parsed = volunteerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, phone, roles, shirtSize, notes } = parsed.data;

  await prisma.volunteer.create({
    data: {
      name,
      email,
      phone: phone || null,
      roles: JSON.stringify(roles),
      shirtSize: shirtSize || null,
      notes: notes || null,
    },
  });

  const emailTemplate = volunteerConfirmationEmail({ name, roles });
  sendEmail({ to: email, ...emailTemplate });

  return { success: true };
}
