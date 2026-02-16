import {
  CalendarDays,
  MapPin,
  Users,
  DollarSign,
} from "lucide-react";

const details = [
  {
    icon: CalendarDays,
    title: "Date & Time",
    content: "Sunday, September 21st, 2025 at 9:00 AM",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: MapPin,
    title: "Location",
    content: "Forest Park Golf Course, St. Louis, MO",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Users,
    title: "Format",
    content: "4-Person Scramble",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: DollarSign,
    title: "Entry Cost",
    content: null,
    lines: ["Individual: $125 per player", "Team: $500 per team"],
    color: "bg-amber-50 text-amber-600",
  },
];

export default function EventDetails() {
  return (
    <section id="details" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Event Details
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {details.map((item, i) => (
            <div
              key={item.title}
              className={`animate-fade-in-up stagger-${i + 1} group bg-card-bg rounded-2xl p-6 border border-card-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
            >
              <div
                className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <item.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {item.title}
              </h3>
              {item.content && (
                <p className="text-muted text-sm leading-relaxed">
                  {item.content}
                </p>
              )}
              {item.lines && (
                <div className="space-y-1">
                  {item.lines.map((line) => (
                    <p key={line} className="text-muted text-sm">
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
