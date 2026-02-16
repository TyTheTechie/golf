import { Heart, Users, Calendar } from "lucide-react";

const stats = [
  { icon: Calendar, value: "6", label: "Years Running" },
  { icon: Users, value: "500+", label: "Past Participants" },
  { icon: Heart, value: "$150K+", label: "Total Raised" },
];

export default function About() {
  return (
    <section id="about" className="py-20 px-4 bg-muted-bg/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            About the Event
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-muted leading-relaxed mb-4">
              The JMC Charities Golf Event brings together golf enthusiasts and
              community members for a day of fun, competition, and giving back.
              Now in its 6th year, this annual event has become a beloved
              tradition in the St. Louis area.
            </p>
            <p className="text-muted leading-relaxed mb-4">
              All proceeds support children&apos;s charities and community
              organizations that make a difference in the lives of those who
              need it most. Whether you&apos;re a seasoned golfer or a beginner,
              there&apos;s a place for you at our event.
            </p>
            <p className="text-muted leading-relaxed">
              Join us at the beautiful Forest Park Golf Course for 18 holes of
              scramble-format golf, great food, exciting prizes, and the chance
              to support incredible causes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center p-5 bg-card-bg rounded-2xl border border-card-border"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                  <stat.icon size={20} className="text-accent" />
                </div>
                <span className="text-2xl font-bold text-accent">
                  {stat.value}
                </span>
                <span className="text-xs text-muted mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
