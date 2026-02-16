"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.email) {
    throw new Error("Unauthorized");
  }
  return session.user as { id: string; email: string; name?: string | null };
}

export async function getMyRegistrations() {
  const user = await requireUser();
  const email = user.email.toLowerCase();

  const registrations = await prisma.golferRegistration.findMany({
    where: {
      paymentStatus: "completed",
      OR: [
        { player1Email: { equals: email } },
        { player2Email: { equals: email } },
        { player3Email: { equals: email } },
        { player4Email: { equals: email } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return registrations.map((r) => ({
    ...r,
    isCaptain: r.captainUserId === user.id,
  }));
}

export async function getTeamDetails(registrationId: string) {
  const user = await requireUser();

  const registration = await prisma.golferRegistration.findUnique({
    where: { id: registrationId },
    include: {
      joinRequests: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!registration) return { error: "Registration not found" };
  if (registration.captainUserId !== user.id) return { error: "Not the team captain" };

  return { data: registration };
}

export async function toggleJoinRequests(registrationId: string, open: boolean) {
  const user = await requireUser();

  const registration = await prisma.golferRegistration.findUnique({
    where: { id: registrationId },
  });

  if (!registration) return { error: "Registration not found" };
  if (registration.captainUserId !== user.id) return { error: "Not the team captain" };

  await prisma.golferRegistration.update({
    where: { id: registrationId },
    data: { openForJoinRequests: open },
  });

  return { data: { openForJoinRequests: open } };
}

export async function requestToJoinTeam(registrationId: string) {
  const user = await requireUser();

  const registration = await prisma.golferRegistration.findUnique({
    where: { id: registrationId },
  });

  if (!registration) return { error: "Team not found" };
  if (!registration.openForJoinRequests) return { error: "Team is not accepting requests" };
  if (registration.type !== "team") return { error: "Not a team registration" };

  // Check if all slots are full
  const filledSlots = [
    registration.player1Name,
    registration.player2Name,
    registration.player3Name,
    registration.player4Name,
  ].filter(Boolean).length;
  if (filledSlots >= 4) return { error: "Team is full" };

  // Check for existing pending request
  const existing = await prisma.teamJoinRequest.findFirst({
    where: {
      registrationId,
      userId: user.id,
      status: "pending",
    },
  });
  if (existing) return { error: "You already have a pending request for this team" };

  await prisma.teamJoinRequest.create({
    data: {
      registrationId,
      userId: user.id,
      playerName: user.name || "",
      playerEmail: user.email,
    },
  });

  return { data: { success: true } };
}

export async function approveJoinRequest(requestId: string) {
  const user = await requireUser();

  const request = await prisma.teamJoinRequest.findUnique({
    where: { id: requestId },
    include: { registration: true },
  });

  if (!request) return { error: "Request not found" };
  if (request.registration.captainUserId !== user.id) return { error: "Not the team captain" };
  if (request.status !== "pending") return { error: "Request is not pending" };

  const reg = request.registration;

  // Find first empty slot
  let slotField: string | null = null;
  if (!reg.player2Name) slotField = "player2";
  else if (!reg.player3Name) slotField = "player3";
  else if (!reg.player4Name) slotField = "player4";

  if (!slotField) return { error: "Team is full" };

  await prisma.$transaction([
    prisma.golferRegistration.update({
      where: { id: reg.id },
      data: {
        [`${slotField}Name`]: request.playerName,
        [`${slotField}Email`]: request.playerEmail,
        [`${slotField}Phone`]: request.playerPhone,
      },
    }),
    prisma.teamJoinRequest.update({
      where: { id: requestId },
      data: { status: "approved" },
    }),
  ]);

  return { data: { success: true, slot: slotField } };
}

export async function rejectJoinRequest(requestId: string) {
  const user = await requireUser();

  const request = await prisma.teamJoinRequest.findUnique({
    where: { id: requestId },
    include: { registration: true },
  });

  if (!request) return { error: "Request not found" };
  if (request.registration.captainUserId !== user.id) return { error: "Not the team captain" };
  if (request.status !== "pending") return { error: "Request is not pending" };

  await prisma.teamJoinRequest.update({
    where: { id: requestId },
    data: { status: "rejected" },
  });

  return { data: { success: true } };
}

export async function transferCaptain(registrationId: string, newCaptainEmail: string) {
  const user = await requireUser();

  const registration = await prisma.golferRegistration.findUnique({
    where: { id: registrationId },
  });

  if (!registration) return { error: "Registration not found" };
  if (registration.captainUserId !== user.id) return { error: "Not the team captain" };

  // Find user by email
  const newCaptain = await prisma.user.findUnique({
    where: { email: newCaptainEmail.toLowerCase() },
  });

  if (!newCaptain) return { error: "That player does not have an account yet" };

  await prisma.golferRegistration.update({
    where: { id: registrationId },
    data: { captainUserId: newCaptain.id },
  });

  return { data: { success: true, newCaptainName: newCaptain.name } };
}

export async function getOpenTeams() {
  const user = await requireUser();

  const teams = await prisma.golferRegistration.findMany({
    where: {
      type: "team",
      openForJoinRequests: true,
      paymentStatus: "completed",
    },
    orderBy: { createdAt: "desc" },
  });

  // Filter to teams with empty slots and add request status
  const teamsWithStatus = await Promise.all(
    teams
      .filter((t) => {
        const filled = [t.player1Name, t.player2Name, t.player3Name, t.player4Name].filter(Boolean).length;
        return filled < 4;
      })
      .map(async (t) => {
        const myRequest = await prisma.teamJoinRequest.findFirst({
          where: { registrationId: t.id, userId: user.id },
          orderBy: { createdAt: "desc" },
        });
        const filledSlots = [t.player1Name, t.player2Name, t.player3Name, t.player4Name].filter(Boolean).length;
        return {
          id: t.id,
          teamName: t.teamName,
          player1Name: t.player1Name,
          filledSlots,
          openSlots: 4 - filledSlots,
          myRequestStatus: myRequest?.status || null,
        };
      })
  );

  return teamsWithStatus;
}
