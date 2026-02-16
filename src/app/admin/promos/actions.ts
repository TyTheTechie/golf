"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
}

const createPromoSchema = z.object({
  code: z.string().min(2).transform((v) => v.toUpperCase()),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().positive(),
  maxUses: z.number().int().min(0).default(0),
  expiresAt: z.string().optional(),
});

export async function createPromoCode(input: {
  code: string;
  type: string;
  value: number;
  maxUses: number;
  expiresAt?: string;
}) {
  await requireAdmin();

  const parsed = createPromoSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await prisma.promoCode.findUnique({ where: { code: parsed.data.code } });
  if (existing) return { error: "This code already exists" };

  await prisma.promoCode.create({
    data: {
      code: parsed.data.code,
      type: parsed.data.type,
      value: parsed.data.value,
      maxUses: parsed.data.maxUses,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    },
  });

  return { success: true };
}

export async function togglePromoCode(id: string) {
  await requireAdmin();
  const promo = await prisma.promoCode.findUnique({ where: { id } });
  if (!promo) return { error: "Not found" };
  await prisma.promoCode.update({ where: { id }, data: { active: !promo.active } });
  return { success: true };
}

export async function getPromoCodes() {
  return prisma.promoCode.findMany({ orderBy: { createdAt: "desc" } });
}

export async function validatePromoCode(
  code: string,
  amountCents: number
): Promise<{ promoId?: string; discount?: number; error?: string }> {
  const promo = await prisma.promoCode.findUnique({ where: { code: code.toUpperCase() } });

  if (!promo || !promo.active) return { error: "Invalid promo code" };
  if (promo.maxUses > 0 && promo.currentUses >= promo.maxUses) return { error: "This code has reached its usage limit" };
  if (promo.expiresAt && new Date() > promo.expiresAt) return { error: "This code has expired" };

  const discount = promo.type === "percentage"
    ? Math.round(amountCents * (promo.value / 100))
    : promo.value;

  return { promoId: promo.id, discount: Math.min(discount, amountCents) };
}
