import { updateUserStatusAction } from "@/actions/update-user-status";
import {
  DeleteUserButton,
  PlaceholderDeleteUserButton,
} from "@/components/delete-user-button";
import UserRoleSelect from "@/components/user-role-select";

import { Role, Status } from "@prisma/client";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role?: string;
  status?: Status | string;
};

function StatusBadge({ status }: { status?: string }) {
  const s = (status ?? "PENDING").toUpperCase();

  // simple “badge” styles without needing a component lib
  const base =
    "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium";
  const variant =
    s === "APPROVED"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : s === "PENDING"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : s === "SUSPENDED"
          ? "bg-red-50 text-red-700 border-red-200"
          : s === "REJECTED"
            ? "bg-rose-50 text-rose-700 border-rose-200"
            : "bg-slate-50 text-slate-700 border-slate-200";

  return <span className={`${base} ${variant}`}>{s}</span>;
}

export default function UsersTable({ users }: { users: UserRow[] }) {
  const sortedUsers = [...users].sort((a, b) => {
    const roleA = (a.role ?? "USER").toUpperCase();
    const roleB = (b.role ?? "USER").toUpperCase();

    if (roleA === "ADMIN" && roleB !== "ADMIN") return -1;
    if (roleA !== "ADMIN" && roleB === "ADMIN") return 1;
    return 0;
  });

  return (
    <div className="w-full overflow-x-auto">
      <table className="table-auto min-w-full whitespace-nowrap">
        <thead>
          <tr className="border-b text-sm text-left">
            <th className="px-2 py-2">ID</th>
            <th className="px-2 py-2">Name</th>
            <th className="px-2 py-2">Email</th>
            <th className="px-2 py-2 text-center">Status</th>
            <th className="px-2 py-2 text-center">Role</th>
            <th className="px-2 py-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {sortedUsers.map((user) => {
            const status = (user.status ?? "PENDING").toString().toUpperCase();
            const role = (user.role ?? "USER").toString().toUpperCase();

            return (
              <tr key={user.id} className="border-b text-sm text-left">
                <td className="px-4 py-2">{user.id.slice(0, 8)}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>

                <td className="px-4 py-2 text-center">
                  <StatusBadge status={status} />
                </td>

                <td className="px-4 py-2 text-center">
                  <UserRoleSelect userId={user.id} role={role as Role} />
                </td>

                <td className="px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* ✅ Approval buttons only when status is PENDING */}
                    {status === "PENDING" && (
                      <>
                        <form
                          action={async () => {
                            "use server";
                            await updateUserStatusAction(
                              user.id,
                              Status.APPROVED,
                            );
                          }}
                        >
                          <button className="rounded-lg border px-3 py-2">
                            Approve
                          </button>
                        </form>

                        <form
                          action={async () => {
                            "use server";
                            await updateUserStatusAction(
                              user.id,
                              Status.REJECTED,
                            );
                          }}
                        >
                          <button className="rounded-lg border px-3 py-2">
                            Reject
                          </button>
                        </form>

                        <form
                          action={async () => {
                            "use server";
                            await updateUserStatusAction(
                              user.id,
                              Status.SUSPENDED,
                            );
                          }}
                        >
                          <button className="rounded-lg border px-3 py-2">
                            Suspend
                          </button>
                        </form>
                      </>
                    )}

                    {/* ✅ Keep your existing delete controls intact */}
                    {role === "USER" ? (
                      <DeleteUserButton userId={user.id} />
                    ) : (
                      <PlaceholderDeleteUserButton />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
