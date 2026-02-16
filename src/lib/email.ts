import { Resend } from "resend";

const globalForResend = globalThis as unknown as {
  resend: Resend | undefined;
};

const apiKey = process.env.RESEND_API_KEY;

export const resend: Resend | null = apiKey
  ? (globalForResend.resend ?? new Resend(apiKey))
  : null;

if (apiKey && process.env.NODE_ENV !== "production") {
  globalForResend.resend = resend!;
}

const FROM_EMAIL = process.env.FROM_EMAIL || "JMC Charities <noreply@jmccharities.org>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@jmccharities.org";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping email to:", to);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("[email] Failed to send to", to, err);
  }
}

export async function sendAdminEmail({
  subject,
  html,
}: {
  subject: string;
  html: string;
}) {
  await sendEmail({ to: ADMIN_EMAIL, subject, html });
}
