import Link from "next/link";
import { Users, Building2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-accent mb-6">
            <span className="text-3xl">&#9971;</span>
            JMC Charities
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Register for the Tournament
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Choose your registration type below to get started.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/register/golfer"
            className="group bg-card-bg border border-card-border rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="p-3 bg-accent/10 rounded-xl w-fit mb-4">
              <Users className="text-accent" size={32} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Golfer Registration</h2>
            <p className="text-muted mb-4">
              Register as an individual ($125) or as a team of 4 ($500). Includes
              18 holes, cart, meals, and more.
            </p>
            <span className="inline-flex items-center gap-1 text-accent font-medium group-hover:gap-2 transition-all">
              Register as Golfer <ArrowRight size={18} />
            </span>
          </Link>

          <Link
            href="/register/sponsor"
            className="group bg-card-bg border border-card-border rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="p-3 bg-gold/10 rounded-xl w-fit mb-4">
              <Building2 className="text-gold" size={32} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Sponsor Registration</h2>
            <p className="text-muted mb-4">
              Support our charities with a sponsorship package. Tiers from
              $250 Hole Sponsor to $5,000 Platinum.
            </p>
            <span className="inline-flex items-center gap-1 text-gold-dark font-medium group-hover:gap-2 transition-all">
              Become a Sponsor <ArrowRight size={18} />
            </span>
          </Link>
        </div>

        <div className="text-center mt-8 space-y-2">
          <Link href="/" className="text-muted hover:text-accent transition-colors text-sm block">
            &larr; Back to Home
          </Link>
          <Link
            href="/register/request-access"
            className="text-accent hover:text-accent-dark transition-colors text-sm"
          >
            Don&apos;t have an access code? Request one here
          </Link>
        </div>
      </div>
    </div>
  );
}
