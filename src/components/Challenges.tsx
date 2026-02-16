import { Target, Zap, Trophy, ShoppingBag, Gift, CircleDollarSign } from "lucide-react";

const challenges = [
  {
    icon: Target,
    title: "Closest to the Pin",
    description:
      "Test your accuracy! Hit closest to the pin on designated par 3 holes.",
    prize: "TBA",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Longest Drive",
    description:
      "Show off your power! Hit the longest drive that stays in the fairway on the designated hole.",
    prize: "TBA",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Trophy,
    title: "Team Awards",
    description: "Top 3 teams will be recognized.",
    prize: "1st, 2nd, and 3rd Place Teams",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    icon: ShoppingBag,
    title: "Silent Auction",
    description: "Bid on exclusive items and experiences",
    prize: "Various Premium Items",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Gift,
    title: "Raffle Prizes",
    description: "Multiple chances to win throughout the event",
    prize: "Multiple Prizes Available",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: CircleDollarSign,
    title: "$10,000 Hole in One Challenge",
    description: "Sponsored by Bob Brockland Buick GMC",
    prize: "$10,000",
    gradient: "from-accent to-accent-light",
  },
];

export default function Challenges() {
  return (
    <section id="challenges" className="py-20 px-4 bg-muted-bg/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Challenges
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((item, i) => (
            <div
              key={item.title}
              className={`animate-fade-in-up stagger-${(i % 3) + 1} group relative bg-card-bg rounded-2xl overflow-hidden border border-card-border shadow-sm hover:shadow-lg transition-all duration-300`}
            >
              <div
                className={`h-1.5 bg-gradient-to-r ${item.gradient}`}
              />
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0`}
                  >
                    <item.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed mb-3">
                      {item.description}
                    </p>
                    <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                      {item.prize}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
