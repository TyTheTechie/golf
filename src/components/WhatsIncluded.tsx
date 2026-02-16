import {
  Flag,
  Car,
  Gift,
  UtensilsCrossed,
  Wine,
  Award,
  PartyPopper,
  Coffee,
} from "lucide-react";

const items = [
  { icon: Flag, label: "18 Holes of Golf" },
  { icon: Car, label: "Golf Cart" },
  { icon: Gift, label: "Tournament Gift Bag" },
  { icon: Coffee, label: "Lunch Service" },
  { icon: UtensilsCrossed, label: "Dinner" },
  { icon: Wine, label: "Beverages Throughout Event" },
  { icon: Award, label: "Awards Ceremony" },
  { icon: PartyPopper, label: "Chance to Win Prizes" },
];

export default function WhatsIncluded() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            What&apos;s Included
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <div
              key={item.label}
              className={`animate-fade-in-up stagger-${(i % 4) + 1} group flex flex-col items-center text-center p-5 bg-card-bg rounded-2xl border border-card-border hover:border-accent/30 hover:shadow-md transition-all duration-300`}
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
                <item.icon size={22} className="text-accent" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
