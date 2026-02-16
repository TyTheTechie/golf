"use client";

import { useRouter } from "next/navigation";
import { promoteToAdmin, demoteFromAdmin } from "../actions";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
}

export default function UserList({ users }: { users: User[] }) {
  const router = useRouter();

  async function handleToggleRole(userId: string, currentRole: string) {
    if (currentRole === "admin") {
      await demoteFromAdmin(userId);
    } else {
      await promoteToAdmin(userId);
    }
    router.refresh();
  }

  if (users.length === 0) {
    return <p className="text-muted text-center py-12">No users yet.</p>;
  }

  return (
    <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-card-border">
            <th className="text-left py-3 px-4 font-medium text-muted">Name</th>
            <th className="text-left py-3 px-4 font-medium text-muted">Email</th>
            <th className="text-left py-3 px-4 font-medium text-muted">Role</th>
            <th className="text-left py-3 px-4 font-medium text-muted">Joined</th>
            <th className="text-left py-3 px-4 font-medium text-muted">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-card-border/50 hover:bg-muted-bg/50">
              <td className="py-3 px-4 text-foreground font-medium">{user.name || "—"}</td>
              <td className="py-3 px-4 text-foreground">{user.email}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="py-3 px-4 text-muted">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => handleToggleRole(user.id, user.role)}
                  className="text-xs text-accent hover:underline"
                >
                  {user.role === "admin" ? "Demote" : "Make Admin"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
