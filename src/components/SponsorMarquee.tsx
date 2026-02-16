"use client";

interface Sponsor {
  id: string;
  companyName: string;
  logoUrl: string | null;
  tier: string;
}

export default function SponsorMarquee({ sponsors }: { sponsors: Sponsor[] }) {
  // Duplicate list for seamless loop
  const items = [...sponsors, ...sponsors];

  return (
    <div className="relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee hover:[animation-play-state:paused]">
        {items.map((sponsor, i) => (
          <div
            key={`${sponsor.id}-${i}`}
            className="flex-shrink-0 mx-4 flex flex-col items-center justify-center"
            title={`${sponsor.companyName} — ${sponsor.tier} Sponsor`}
          >
            {sponsor.logoUrl ? (
              <div className="w-36 h-20 flex items-center justify-center p-2">
                <img
                  src={sponsor.logoUrl}
                  alt={sponsor.companyName}
                  className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-[filter] duration-300"
                />
              </div>
            ) : (
              <div className="w-36 h-20 flex items-center justify-center rounded-lg bg-muted-bg border border-card-border px-3">
                <span className="text-sm font-medium text-foreground text-center leading-tight">
                  {sponsor.companyName}
                </span>
              </div>
            )}
            <span className="text-[10px] text-muted mt-1 uppercase tracking-wider">
              {sponsor.tier}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
