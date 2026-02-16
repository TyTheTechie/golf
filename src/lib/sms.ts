import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const globalForTwilio = globalThis as unknown as {
  twilioClient: twilio.Twilio | undefined;
};

const client: twilio.Twilio | null =
  accountSid && authToken
    ? (globalForTwilio.twilioClient ?? twilio(accountSid, authToken))
    : null;

if (accountSid && authToken && process.env.NODE_ENV !== "production") {
  globalForTwilio.twilioClient = client!;
}

export async function sendSMS({
  to,
  body,
}: {
  to: string;
  body: string;
}) {
  if (!client || !fromNumber) {
    console.warn("[sms] Twilio not configured — skipping SMS to:", to);
    return;
  }

  try {
    await client.messages.create({
      body,
      from: fromNumber,
      to,
    });
  } catch (err) {
    console.error("[sms] Failed to send to", to, err);
  }
}
