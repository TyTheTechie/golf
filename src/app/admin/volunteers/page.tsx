import { prisma } from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";
import ExportButton from "@/components/admin/ExportButton";

export default async function AdminVolunteersPage() {
  const volunteers = await prisma.volunteer.findMany({
    orderBy: { createdAt: "desc" },
  });

  const columns = [
    { key: "name", label: "Name", render: (r: typeof volunteers[0]) => (
      <span className="font-medium">{r.name}</span>
    )},
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone", render: (r: typeof volunteers[0]) => r.phone || "—" },
    { key: "roles", label: "Roles", render: (r: typeof volunteers[0]) => {
      const roles = JSON.parse(r.roles) as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <span key={role} className="px-2 py-0.5 bg-accent/10 text-accent rounded text-xs font-medium capitalize">
              {role}
            </span>
          ))}
        </div>
      );
    }},
    { key: "shirtSize", label: "Shirt", render: (r: typeof volunteers[0]) => r.shirtSize || "—" },
    { key: "createdAt", label: "Signed Up", render: (r: typeof volunteers[0]) =>
      new Date(r.createdAt).toLocaleDateString()
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Volunteers</h1>
          <p className="text-muted text-sm mt-1">{volunteers.length} volunteers signed up</p>
        </div>
        <ExportButton href="/api/admin/export/volunteers" label="Export CSV" />
      </div>
      <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
        <DataTable columns={columns} data={volunteers} keyField="id" />
      </div>
    </div>
  );
}
