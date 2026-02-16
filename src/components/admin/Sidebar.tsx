"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Gavel,
  UserCog,
  Settings,
  ArrowLeft,
  Camera,
  Heart,
  Send,
  ClipboardList,
  ScanLine,
  Ticket,
  Tag,
  ListOrdered,
  HandHeart,
  Calendar,
  BarChart3,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Registrations", href: "/admin/registrations", icon: Users },
  { label: "Sponsors", href: "/admin/sponsors", icon: Building2 },
  { label: "Auction", href: "/admin/auction", icon: Gavel },
  { label: "Donations", href: "/admin/donations", icon: Heart },
  { label: "Photos", href: "/admin/photos", icon: Camera },
  { label: "Scoring", href: "/admin/scoring", icon: ClipboardList },
  { label: "Check-in", href: "/admin/checkin", icon: ScanLine },
  { label: "Raffle", href: "/admin/raffle", icon: Ticket },
  { label: "Promo Codes", href: "/admin/promos", icon: Tag },
  { label: "Waitlist", href: "/admin/waitlist", icon: ListOrdered },
  { label: "Volunteers", href: "/admin/volunteers", icon: HandHeart },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Users", href: "/admin/users", icon: UserCog },
  { label: "Email Blast", href: "/admin/email-blast", icon: Send },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card-bg border-r border-card-border min-h-screen p-4 hidden md:block">
      <div className="mb-6">
        <Link href="/" className="flex items-center gap-2 text-accent font-bold text-lg">
          <span className="text-xl">&#9971;</span>
          JMC Admin
        </Link>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-white"
                  : "text-foreground/70 hover:text-accent hover:bg-muted-bg"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-4 border-t border-card-border">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
