"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const charities = [
  {
    name: "Wings of Hope",
    description:
      "We are an aviation nonprofit delivering humanitarian programs around the globe to lift people in need toward health and self-sufficiency. We do this by providing access \u2013 to health care, resources and support. We envision a world in which all people have access to the resources they need to create a better life.",
    url: "https://wingsofhope.ngo/",
    color: "from-sky-500 to-blue-600",
  },
  {
    name: "Shriners Children's",
    description:
      "Shriners Children's is changing lives every day through innovative pediatric specialty care, world-class research, and outstanding medical education. All without regard to the families' ability to pay.",
    url: "https://www.shrinerschildrens.org/",
    color: "from-red-500 to-rose-600",
  },
  {
    name: "St. Louis Children's Hospital",
    description:
      "St. Louis Children's Hospital is a premier children's hospital consistently ranked among the top pediatric hospitals in the nation, providing expert care for children of all ages and medical conditions.",
    url: "https://www.stlouischildrens.org/",
    color: "from-emerald-500 to-green-600",
  },
  {
    name: "Make-A-Wish Foundation",
    description:
      "Make-A-Wish creates life-changing wishes for children with critical illnesses. A wish experience can be a game-changer, giving kids the strength to fight harder, to get better, to grow up.",
    url: "https://wish.org/",
    color: "from-blue-500 to-indigo-600",
  },
];

export default function Charities() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c === 0 ? charities.length - 1 : c - 1));
  const next = () =>
    setCurrent((c) => (c === charities.length - 1 ? 0 : c + 1));

  const charity = charities[current];

  return (
    <section id="charities" className="py-20 px-4 bg-muted-bg/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Supporting Great Causes
          </h2>
          <p className="text-muted">
            Meet the organizations making a difference in our community
          </p>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full mt-3" />
        </div>

        <div className="mt-10 bg-card-bg rounded-2xl border border-card-border shadow-sm overflow-hidden">
          <div
            className={`h-2 bg-gradient-to-r ${charity.color} transition-colors duration-500`}
          />
          <div className="p-8 sm:p-10">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {charity.name}
            </h3>
            <p className="text-muted leading-relaxed mb-6">
              {charity.description}
            </p>
            <a
              href={charity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent font-medium hover:text-accent-dark transition-colors"
            >
              Learn More <ExternalLink size={16} />
            </a>
          </div>

          <div className="flex items-center justify-between px-8 pb-6">
            <button
              onClick={prev}
              className="p-2 rounded-lg bg-muted-bg hover:bg-card-border transition-colors"
              aria-label="Previous beneficiary"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {charities.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === current
                      ? "bg-accent w-6"
                      : "bg-card-border hover:bg-muted"
                  }`}
                  aria-label={`Go to beneficiary ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-2 rounded-lg bg-muted-bg hover:bg-card-border transition-colors"
              aria-label="Next beneficiary"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
