import {
  DeleteUserButton,
  PlaceholderDeleteUserButton,
} from "@/components/delete-user-button";
import UserRoleSelect from "@/components/user-role-select";
import { Role } from "@prisma/client";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role?: string;
};

export default function UsersTable({ users }: { users: UserRow[] }) {
  const sortedUsers = [...users].sort((a, b) => {
    const roleA = a.role ?? "USER";
    const roleB = b.role ?? "USER";

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
            <th className="px-2 py-2 text-center">Role</th>
            <th className="px-2 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id} className="border-b text-sm text-left">
              <td className="px-4 py-2">{user.id.slice(0, 8)}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2 text-center">
                <UserRoleSelect userId={user.id} role={user.role as Role} />
              </td>
              <td className="px-4 py-2 text-center">
                {user.role === "USER" ? (
                  <DeleteUserButton userId={user.id} />
                ) : (
                  <PlaceholderDeleteUserButton />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
