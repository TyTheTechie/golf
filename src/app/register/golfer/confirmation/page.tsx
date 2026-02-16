import Link from "next/link";
import { CheckCircle, Share2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CopyInviteCode from "./CopyInviteCode";

export default async function GolferConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (!id) notFound();

  const registration = await prisma.golferRegistration.findUnique({
    where: { id },
  });

  if (!registration) notFound();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="bg-card-bg border border-card-border rounded-2xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-accent" size={36} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Registration Confirmed!
          </h1>
          <p className="text-muted mb-6">
            Thank you for registering for the JMC Charities Golf Tournament.
          </p>

          <div className="bg-muted-bg rounded-lg p-4 text-left space-y-2 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-muted">Type</span>
              <span className="text-foreground font-medium capitalize">{registration.type}</span>
            </div>
            {registration.teamName && (
              <div className="flex justify-between">
                <span className="text-muted">Team</span>
                <span className="text-foreground font-medium">{registration.teamName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">Player 1</span>
              <span className="text-foreground">{registration.player1Name}</span>
            </div>
            {registration.player2Name && (
              <div className="flex justify-between">
                <span className="text-muted">Player 2</span>
                <span className="text-foreground">{registration.player2Name}</span>
              </div>
            )}
            {registration.player3Name && (
              <div className="flex justify-between">
                <span className="text-muted">Player 3</span>
                <span className="text-foreground">{registration.player3Name}</span>
              </div>
            )}
            {registration.player4Name && (
              <div className="flex justify-between">
                <span className="text-muted">Player 4</span>
                <span className="text-foreground">{registration.player4Name}</span>
              </div>
            )}
            <hr className="border-card-border" />
            <div className="flex justify-between font-medium">
              <span className="text-foreground">Amount Paid</span>
              <span className="text-accent">${(registration.amount / 100).toFixed(2)}</span>
            </div>
          </div>

          {registration.inviteCode && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-center gap-2 mb-1">
                <Share2 size={16} className="text-amber-700" />
                <h3 className="font-semibold text-amber-800">Team Invite Code</h3>
              </div>
              <p className="text-sm text-amber-700 mb-3">
                Share this code with your teammates. They can use it when creating their account to auto-request to join your team.
              </p>
              <CopyInviteCode code={registration.inviteCode} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
