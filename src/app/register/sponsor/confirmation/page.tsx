import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SPONSOR_TIERS } from "@/lib/sponsor-tiers";
import LogoUpload from "./LogoUpload";

export default async function SponsorConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (!id) notFound();

  const registration = await prisma.sponsorRegistration.findUnique({
    where: { id },
  });

  if (!registration) notFound();

  const tier = SPONSOR_TIERS.find((t) => t.id === registration.tier);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="bg-card-bg border border-card-border rounded-2xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-gold" size={36} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Sponsorship Confirmed!
          </h1>
          <p className="text-muted mb-6">
            Thank you for sponsoring the JMC Charities Golf Tournament.
          </p>

          <div className="bg-muted-bg rounded-lg p-4 text-left space-y-2 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-muted">Tier</span>
              <span className="text-foreground font-medium">{tier?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Company</span>
              <span className="text-foreground font-medium">{registration.companyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Contact</span>
              <span className="text-foreground">{registration.contactName}</span>
            </div>
            <hr className="border-card-border" />
            <div className="flex justify-between font-medium">
              <span className="text-foreground">Amount Paid</span>
              <span className="text-gold-dark">${(registration.amount / 100).toLocaleString()}</span>
            </div>
          </div>

          <div className="mb-6">
            <LogoUpload sponsorId={registration.id} />
          </div>

          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-gold text-white rounded-lg font-medium hover:bg-gold-dark transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
