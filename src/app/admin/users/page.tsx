import UsersTable from "@/components/admin/users-table";
import ReturnButton from "@/components/return-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const headersList = await headers();

  const { users } = await auth.api.listUsers({
    headers: headersList,
    query: { sortBy: "name" },
  });

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="w-full flex justify-start">
        <ReturnButton href="/admin/dashboard" label="Dashboard" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-slate-500">Manage roles and remove users.</p>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
