"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { emailBlastTemplate } from "@/lib/email-templates";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function sendEmailBlast(input: {
  subject: string;
  message: string;
  audience: "all" | "golfers" | "sponsors" | "donors";
}) {
  await requireAdmin();

  if (!input.subject.trim() || !input.message.trim()) {
    return { error: "Subject and message are required" };
  }

  // Collect unique emails based on audience
  const emails = new Set<string>();

  if (input.audience === "all" || input.audience === "golfers") {
    const golfers = await prisma.golferRegistration.findMany({
      where: { paymentStatus: "completed" },
      select: { player1Email: true },
    });
    golfers.forEach((g) => emails.add(g.player1Email.toLowerCase()));
  }

  if (input.audience === "all" || input.audience === "sponsors") {
    const sponsors = await prisma.sponsorRegistration.findMany({
      where: { paymentStatus: "completed" },
      select: { contactEmail: true },
    });
    sponsors.forEach((s) => emails.add(s.contactEmail.toLowerCase()));
  }

  if (input.audience === "all" || input.audience === "donors") {
    const donors = await prisma.donation.findMany({
      where: { paymentStatus: "completed" },
      select: { email: true },
    });
    donors.forEach((d) => emails.add(d.email.toLowerCase()));
  }

  if (emails.size === 0) {
    return { error: "No recipients found for the selected audience" };
  }

  const template = emailBlastTemplate({
    subject: input.subject,
    message: input.message,
  });

  // Send emails (fire-and-forget each one)
  const emailArray = Array.from(emails);
  await Promise.allSettled(
    emailArray.map((to) =>
      sendEmail({ to, subject: template.subject, html: template.html })
    )
  );

  return { sent: emailArray.length };
}
