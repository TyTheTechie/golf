import { prisma } from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";
import ExportButton from "@/components/admin/ExportButton";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminRegistrationsPage() {
  const registrations = await prisma.golferRegistration.findMany({
    orderBy: { createdAt: "desc" },
  });

  const columns = [
    { key: "type", label: "Type", render: (r: typeof registrations[0]) => (
      <span className="capitalize font-medium">{r.type}</span>
    )},
    { key: "teamName", label: "Team / Player", render: (r: typeof registrations[0]) =>
      r.teamName || r.player1Name
    },
    { key: "player1Email", label: "Email" },
    { key: "amount", label: "Amount", render: (r: typeof registrations[0]) => (
      <span className="font-medium text-accent">${(r.amount / 100).toFixed(2)}</span>
    )},
    { key: "paymentStatus", label: "Status", render: (r: typeof registrations[0]) => (
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
    { key: "createdAt", label: "Date", render: (r: typeof registrations[0]) =>
      new Date(r.createdAt).toLocaleDateString()
    },
    { key: "actions", label: "", render: (r: typeof registrations[0]) => (
      <DeleteButton id={r.id} type="registration" />
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Golfer Registrations</h1>
        <ExportButton href="/api/admin/export/registrations" label="Export CSV" />
      </div>
      <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
        <DataTable columns={columns} data={registrations} keyField="id" />
      </div>
    </div>
  );
}
