import { prisma } from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";
import ExportButton from "@/components/admin/ExportButton";

export default async function AdminDonationsPage() {
  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalDonations = donations
    .filter((d) => d.paymentStatus === "completed")
    .reduce((sum, d) => sum + d.amount, 0);

  const columns = [
    { key: "name", label: "Name", render: (r: typeof donations[0]) => (
      <span className="font-medium">{r.name}</span>
    )},
    { key: "email", label: "Email" },
    { key: "amount", label: "Amount", render: (r: typeof donations[0]) => (
      <span className="font-medium text-accent">${(r.amount / 100).toFixed(2)}</span>
    )},
    { key: "message", label: "Message", render: (r: typeof donations[0]) => (
      <span className="text-muted truncate max-w-[200px] inline-block">{r.message || "—"}</span>
    )},
    { key: "paymentStatus", label: "Status", render: (r: typeof donations[0]) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        r.paymentStatus === "completed"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}>
        {r.paymentStatus}
      </span>
    )},
    { key: "createdAt", label: "Date", render: (r: typeof donations[0]) =>
      new Date(r.createdAt).toLocaleDateString()
    },
    { key: "receipt", label: "Receipt", render: (r: typeof donations[0]) =>
      r.paymentStatus === "completed" ? (
        <a href={`/api/receipts/donation/${r.id}`} className="text-accent hover:text-accent-dark text-xs font-medium">
          Download PDF
        </a>
      ) : "—"
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Donations</h1>
          <p className="text-muted text-sm mt-1">
            Total: <span className="font-semibold text-accent">${(totalDonations / 100).toLocaleString()}</span> from {donations.filter(d => d.paymentStatus === "completed").length} donations
          </p>
        </div>
        <ExportButton href="/api/admin/export/donations" label="Export CSV" />
      </div>
      <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
        <DataTable columns={columns} data={donations} keyField="id" />
      </div>
    </div>
  );
}
