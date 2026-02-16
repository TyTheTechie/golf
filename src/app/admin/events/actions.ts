"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
}

const eventSchema = z.object({
  name: z.string().min(2),
  year: z.number().int().min(2000),
  date: z.string().min(1),
  venue: z.string().min(2),
  description: z.string().min(2),
});

export async function createEvent(input: {
  name: string;
  year: number;
  date: string;
  venue: string;
  description: string;
}) {
  await requireAdmin();
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.event.create({
    data: {
      name: parsed.data.name,
      year: parsed.data.year,
      date: new Date(parsed.data.date),
      venue: parsed.data.venue,
      description: parsed.data.description,
    },
  });
  return { success: true };
}

export async function getEvents() {
  return prisma.event.findMany({
    include: { _count: { select: { results: true, registrations: true } } },
    orderBy: { year: "desc" },
  });
}

export async function setActiveEvent(id: string) {
  await requireAdmin();
  await prisma.$transaction([
    prisma.event.updateMany({ data: { isActive: false } }),
    prisma.event.update({ where: { id }, data: { isActive: true } }),
  ]);
  return { success: true };
}

const resultSchema = z.object({
  eventId: z.string(),
  place: z.number().int().min(1).max(10),
  teamName: z.string().min(1),
  playerNames: z.string().min(1),
  score: z.number().int(),
});

export async function addEventResult(input: {
  eventId: string;
  place: number;
  teamName: string;
  playerNames: string;
  score: number;
}) {
  await requireAdmin();
  const parsed = resultSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.eventResult.create({ data: parsed.data });
  return { success: true };
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  await prisma.eventResult.deleteMany({ where: { eventId: id } });
  await prisma.event.delete({ where: { id } });
  return { success: true };
}
