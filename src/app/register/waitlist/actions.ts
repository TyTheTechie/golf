"use server";

import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { sendAdminEmail } from "@/lib/email";

const waitlistSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Valid email is required"),
  phone: z.string().optional(),
  type: z.enum(["individual", "team"]),
});

export async function submitWaitlist(input: {
  name: string;
  email: string;
  phone?: string;
  type: string;
}): Promise<{ success?: boolean; error?: string }> {
  const parsed = waitlistSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.waitlistEntry.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      type: parsed.data.type,
    },
  });

  sendAdminEmail({
    subject: `New Waitlist Entry: ${parsed.data.name}`,
    html: `<p>${parsed.data.name} (${parsed.data.email}) joined the ${parsed.data.type} waitlist.</p>`,
  });

  return { success: true };
}
