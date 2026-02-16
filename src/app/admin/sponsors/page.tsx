import { prisma } from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";
import { SPONSOR_TIERS } from "@/lib/sponsor-tiers";
import SponsorLogoUpload from "./SponsorLogoUpload";
import ExportButton from "@/components/admin/ExportButton";

export default async function AdminSponsorsPage() {
  const sponsors = await prisma.sponsorRegistration.findMany({
    orderBy: { createdAt: "desc" },
  });

  const columns = [
    { key: "logo", label: "Logo", render: (r: typeof sponsors[0]) => (
      <SponsorLogoUpload sponsorId={r.id} currentLogoUrl={r.logoUrl} />
    )},
    { key: "companyName", label: "Company", render: (r: typeof sponsors[0]) => (
      <span className="font-medium">{r.companyName}</span>
    )},
    { key: "tier", label: "Tier", render: (r: typeof sponsors[0]) => {
      const tier = SPONSOR_TIERS.find(t => t.id === r.tier);
      return <span className="capitalize font-medium">{tier?.name || r.tier}</span>;
    }},
    { key: "contactName", label: "Contact" },
    { key: "contactEmail", label: "Email" },
    { key: "amount", label: "Amount", render: (r: typeof sponsors[0]) => (
      <span className="font-medium text-gold-dark">${(r.amount / 100).toLocaleString()}</span>
    )},
    { key: "paymentStatus", label: "Status", render: (r: typeof sponsors[0]) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        r.paymentStatus === "completed"
          ? "bg-green-100 text-green-700"
          : r.paymentStatus === "failed"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700"
      }`}>
        {r.paymentStatus}
      </span>
    )},
    { key: "createdAt", label: "Date", render: (r: typeof sponsors[0]) =>
      new Date(r.createdAt).toLocaleDateString()
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Sponsor Registrations</h1>
        <ExportButton href="/api/admin/export/sponsors" label="Export CSV" />
      </div>
      <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
        <DataTable columns={columns} data={sponsors} keyField="id" />
      </div>
    </div>
  );
}
