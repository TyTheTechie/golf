"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Home,
  Info,
  CalendarDays,
  Heart,
  Gavel,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Shield,
  ChevronDown,
  LayoutDashboard,
  MapPin,
  Camera,
  UserCircle,
  HandHeart,
  Calendar,
  Ticket,
  Trophy,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Home", href: "#home", icon: Home },
  { label: "About", href: "#about", icon: Info },
  { label: "Event Details", href: "#details", icon: CalendarDays },
  { label: "Venue", href: "#venue", icon: MapPin },
  { label: "Sponsors", href: "#charities", icon: Heart },
  { label: "Donate", href: "/donate", icon: Heart },
  { label: "Gallery", href: "/gallery", icon: Camera },
  { label: "Volunteer", href: "/volunteer", icon: HandHeart },
  { label: "Archive", href: "/archive", icon: Calendar },
  { label: "Auction", href: "/auction", icon: Gavel, requiresAuth: true },
  { label: "Raffle", href: "/raffle", icon: Ticket, requiresAuth: true },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy, requiresAuth: true },
  { label: "My Portal", href: "/portal", icon: LayoutDashboard, requiresAuth: true },
];

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card-bg/90 backdrop-blur-md border-b border-card-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-accent text-xl">
            <span className="text-2xl">&#9971;</span>
            <span>JMC Charities</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.requiresAuth && !session) return null;
              const isExternal = item.href.startsWith("#");
              const Component = isExternal ? "a" : Link;
              return (
                <Component
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-accent hover:bg-muted-bg transition-colors"
                >
                  <item.icon size={16} />
                  {item.label}
                </Component>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {session ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    <Shield size={16} />
                    Admin
                  </Link>
                )}
                <Link
                  href="/register"
                  className="px-4 py-2 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors"
                >
                  Register
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-accent hover:bg-muted-bg transition-colors"
                  >
                    <User size={16} />
                    {session.user.name?.split(" ")[0] || "Account"}
                    <ChevronDown size={14} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-card-bg border border-card-border rounded-lg shadow-lg py-1">
                      <Link
                        href="/portal"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground/70 hover:text-accent hover:bg-muted-bg transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        My Portal
                      </Link>
                      <Link
                        href="/portal/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground/70 hover:text-accent hover:bg-muted-bg transition-colors"
                      >
                        <UserCircle size={16} />
                        Profile
                      </Link>
                      <Link
                        href="/portal/favorites"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground/70 hover:text-accent hover:bg-muted-bg transition-colors"
                      >
                        <Heart size={16} />
                        My Favorites
                      </Link>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground/70 hover:text-accent hover:bg-muted-bg transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-accent hover:bg-muted-bg transition-colors"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dark transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-foreground hover:bg-muted-bg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card-bg border-t border-card-border">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              if (item.requiresAuth && !session) return null;
              const isExternal = item.href.startsWith("#");
              const Component = isExternal ? "a" : Link;
              return (
                <Component
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-foreground/70 hover:text-accent hover:bg-muted-bg transition-colors"
                >
                  <item.icon size={18} />
                  {item.label}
                </Component>
              );
            })}

            {session ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    <Shield size={18} />
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/portal"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-foreground/70 hover:text-accent hover:bg-muted-bg transition-colors"
                >
                  <LayoutDashboard size={18} />
                  My Portal
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block mt-2 px-4 py-2.5 bg-accent text-white rounded-lg font-medium text-center hover:bg-accent-dark transition-colors"
                >
                  Register Now
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-foreground/70 hover:text-accent hover:bg-muted-bg transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-foreground/70 hover:text-accent hover:bg-muted-bg transition-colors"
                >
                  <LogIn size={18} />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block mt-2 px-4 py-2.5 bg-accent text-white rounded-lg font-medium text-center hover:bg-accent-dark transition-colors"
                >
                  Register Now
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
