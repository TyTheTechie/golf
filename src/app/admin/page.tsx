import { Users, Building2, Gavel, DollarSign, UserCog, Heart } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import { getDashboardStats } from "./actions";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label="Golfer Registrations"
          value={stats.golferCount}
          icon={Users}
          color="text-accent"
        />
        <StatCard
          label="Sponsors"
          value={stats.sponsorCount}
          icon={Building2}
          color="text-gold"
        />
        <StatCard
          label="Active Auctions"
          value={stats.activeAuctions}
          icon={Gavel}
          color="text-purple-600"
        />
        <StatCard
          label="Total Revenue"
          value={`$${(stats.totalRevenue / 100).toLocaleString()}`}
          icon={DollarSign}
          color="text-emerald-600"
        />
        <StatCard
          label="Donations"
          value={stats.donationCount}
          icon={Heart}
          color="text-pink-600"
        />
        <StatCard
          label="Registered Users"
          value={stats.userCount}
          icon={UserCog}
          color="text-blue-600"
        />
      </div>
    </div>
  );
}
