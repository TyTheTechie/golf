import { prisma } from "@/lib/prisma";
import UserList from "./UserList";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Users</h1>
      <UserList users={users} />
    </div>
  );
}
