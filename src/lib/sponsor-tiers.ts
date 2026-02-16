export interface SponsorTier {
  id: string;
  name: string;
  price: number; // in cents
  color: string;
  benefits: string[];
}

export const SPONSOR_TIERS: SponsorTier[] = [
  {
    id: "platinum",
    name: "Platinum",
    price: 500000,
    color: "from-slate-600 to-slate-400",
    benefits: [
      "Exclusive banner at event entrance",
      "Logo on all tournament materials",
      "Foursome included",
      "Speaking opportunity at dinner",
      "Premium hole signage",
      "Social media promotion",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: 300000,
    color: "from-yellow-600 to-yellow-400",
    benefits: [
      "Logo on tournament materials",
      "Twosome included",
      "Premium hole signage",
      "Social media promotion",
      "Logo on event website",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    price: 150000,
    color: "from-gray-500 to-gray-300",
    benefits: [
      "Logo on select materials",
      "Hole signage",
      "Social media mention",
      "Logo on event website",
    ],
  },
  {
    id: "bronze",
    name: "Bronze",
    price: 75000,
    color: "from-amber-700 to-amber-500",
    benefits: [
      "Hole signage",
      "Name on event website",
      "Social media mention",
    ],
  },
  {
    id: "hole",
    name: "Hole Sponsor",
    price: 25000,
    color: "from-green-700 to-green-500",
    benefits: [
      "Custom sign at sponsored hole",
      "Name on event website",
    ],
  },
];

export function getTierById(id: string) {
  return SPONSOR_TIERS.find((t) => t.id === id);
}
