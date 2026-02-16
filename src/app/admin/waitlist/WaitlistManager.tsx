"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell, Trash2, Mail, CheckCircle } from "lucide-react";
import { notifyWaitlistEntry, deleteWaitlistEntry } from "./actions";

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  type: string;
  createdAt: Date;
  notifiedAt: Date | null;
}

export default function WaitlistManager({ initialEntries }: { initialEntries: WaitlistEntry[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleNotify(id: string) {
    startTransition(async () => {
      await notifyWaitlistEntry(id);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteWaitlistEntry(id);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Waitlist</h1>
          <p className="text-muted text-sm mt-1">
            {initialEntries.length} entries &middot; {initialEntries.filter((e) => e.notifiedAt).length} notified
          </p>
        </div>
      </div>

      <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border bg-muted-bg/50">
              <th className="text-left px-4 py-3 font-medium text-foreground">Name</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Email</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Type</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Joined</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Status</th>
              <th className="text-right px-4 py-3 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialEntries.map((entry) => (
              <tr key={entry.id} className="border-b border-card-border last:border-0">
                <td className="px-4 py-3 font-medium">{entry.name}</td>
                <td className="px-4 py-3 text-muted">{entry.email}</td>
                <td className="px-4 py-3 capitalize">{entry.type}</td>
                <td className="px-4 py-3 text-muted">{new Date(entry.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {entry.notifiedAt ? (
                    <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                      <CheckCircle size={14} /> Notified {new Date(entry.notifiedAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-muted text-xs">
                      <Mail size={14} /> Waiting
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    {!entry.notifiedAt && (
                      <button
                        onClick={() => handleNotify(entry.id)}
                        disabled={isPending}
                        className="flex items-center gap-1 text-sm text-accent hover:text-accent-dark font-medium"
                      >
                        <Bell size={14} /> Notify
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(entry.id)}
                      disabled={isPending}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {initialEntries.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No waitlist entries</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
