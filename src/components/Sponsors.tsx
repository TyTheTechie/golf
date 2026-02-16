import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SPONSOR_TIERS } from "@/lib/sponsor-tiers";
import SponsorMarquee from "./SponsorMarquee";

export default async function Sponsors() {
  const sponsors = await prisma.sponsorRegistration.findMany({
    where: { paymentStatus: "completed" },
    orderBy: { createdAt: "asc" },
  });

  if (sponsors.length === 0) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Our Sponsors
          </h2>
          <p className="text-muted mb-6">
            Help make this event possible
          </p>
          <div className="w-16 h-1 bg-gold mx-auto rounded-full mb-8" />
          <Link
            href="/register/sponsor"
            className="inline-block px-6 py-3 bg-gold text-white rounded-lg font-medium hover:bg-gold-dark transition-colors"
          >
            Become a Sponsor
          </Link>
        </div>
      </section>
    );
  }

  // Sort sponsors by tier order (platinum first)
  const tierOrder = SPONSOR_TIERS.map((t) => t.id);
  const sorted = [...sponsors].sort(
    (a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier)
  );

  const sponsorData = sorted.map((s) => ({
    id: s.id,
    companyName: s.companyName,
    logoUrl: s.logoUrl,
    tier: SPONSOR_TIERS.find((t) => t.id === s.tier)?.name ?? s.tier,
  }));

  return (
    <section className="py-16 px-4 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Our Sponsors
        </h2>
        <p className="text-muted">
          Thank you to our generous sponsors for making this event possible
        </p>
        <div className="w-16 h-1 bg-gold mx-auto rounded-full mt-3" />
      </div>

      <SponsorMarquee sponsors={sponsorData} />

      <div className="text-center mt-8">
        <Link
          href="/register/sponsor"
          className="text-sm text-gold font-medium hover:text-gold-dark transition-colors"
        >
          Interested in sponsoring? Learn more &rarr;
        </Link>
      </div>
    </section>
  );
}
