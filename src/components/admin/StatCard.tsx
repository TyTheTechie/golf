import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export default function StatCard({ label, value, icon: Icon, color = "text-accent" }: StatCardProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-muted-bg ${color}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
