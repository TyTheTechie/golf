import { getRegistrationTrend, getRevenueBreakdown, getAuctionPerformance } from "./actions";
import RegistrationTrendChart from "@/components/admin/charts/RegistrationTrendChart";
import RevenueBreakdownChart from "@/components/admin/charts/RevenueBreakdownChart";
import AuctionPerformanceChart from "@/components/admin/charts/AuctionPerformanceChart";

export default async function AdminAnalyticsPage() {
  const [trend, revenue, auction] = await Promise.all([
    getRegistrationTrend(30),
    getRevenueBreakdown(),
    getAuctionPerformance(),
  ]);

  const totalRevenue = revenue.reduce((sum, r) => sum + r.value, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted text-sm mt-1">
          Total Revenue: <span className="font-semibold text-accent">${(totalRevenue / 100).toLocaleString()}</span>
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-card-bg border border-card-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Registration Trend (30 days)</h2>
          <RegistrationTrendChart data={trend} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card-bg border border-card-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Revenue Breakdown</h2>
            <RevenueBreakdownChart data={revenue} />
          </div>

          <div className="bg-card-bg border border-card-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Auction Performance</h2>
            <AuctionPerformanceChart data={auction} />
          </div>
        </div>
      </div>
    </div>
  );
}
