"use server";

import { z } from "zod/v4";
import { sendAdminEmail } from "@/lib/email";
import { accessRequestEmail } from "@/lib/email-templates";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  message: z.string().optional(),
});

export async function submitAccessRequest(input: {
  name: string;
  email: string;
  message: string;
}): Promise<{ success?: boolean; error?: string }> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, message } = parsed.data;

  const template = accessRequestEmail({
    requesterName: name,
    requesterEmail: email,
    message: message || undefined,
  });

  await sendAdminEmail(template);

  return { success: true };
}
