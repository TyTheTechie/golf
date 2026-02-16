import { prisma } from "@/lib/prisma";

export type AccessCodeResult =
  | { valid: true; type: "event" }
  | { valid: true; type: "team"; registrationId: string }
  | { valid: false };

const AMBIGUITY_FREE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export async function validateAccessCode(code: string): Promise<AccessCodeResult> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { valid: false };

  // Check event access code from DB
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "EVENT_ACCESS_CODE" },
  });

  if (setting && normalized === setting.value.trim().toUpperCase()) {
    return { valid: true, type: "event" };
  }

  // Check team invite codes
  const registration = await prisma.golferRegistration.findFirst({
    where: {
      inviteCode: normalized,
      paymentStatus: "completed",
      type: "team",
    },
  });

  if (registration) {
    return { valid: true, type: "team", registrationId: registration.id };
  }

  return { valid: false };
}

export async function getEventAccessCode(): Promise<string | null> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "EVENT_ACCESS_CODE" },
  });
  return setting?.value ?? null;
}

export async function setEventAccessCode(code: string): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key: "EVENT_ACCESS_CODE" },
    update: { value: code.trim().toUpperCase() },
    create: { key: "EVENT_ACCESS_CODE", value: code.trim().toUpperCase() },
  });
}

export function generateInviteCode(): string {
  const chars = AMBIGUITY_FREE_CHARS;
  let result = "TEAM-";
  for (let i = 0; i < 4; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
