import ReturnButton from "@/components/return-button";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import prisma from "@/db";
import {
  DeleteUserButton,
  PlaceholderDeleteUserButton,
} from "@/components/delete-user-button";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/signin");
  if (session.user.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="w-full flex justify-start">
            <ReturnButton href="/profile" label="Profile" />
          </div>
          <div className="flex flex-col space-y-4">
            <h1>Admin Dashboard</h1>
            <p className="p-2 rounded-md text-lg bg-red-600 text-white font-bold">
              FORBIDDEN
            </p>
          </div>
        </div>
      </div>
    );
  }
  const users = await prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="w-full flex justify-start">
          <ReturnButton href="/profile" label="Profile" />
        </div>
        <div className="flex flex-col space-y-4">
          <h1>Admin Dashboard</h1>
          <p className="p-2 rounded-md text-lg bg-green-600 text-white font-bold">
            ACCESS GRANTED
          </p>
        </div>
      </div>
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
            {users.map((user) => (
              <tr key={user.id} className="border-b text-sm text-left">
                <td className="px-4 py-2">{user.id.slice(0, 8)}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 text-center">{user.role}</td>
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
    </div>
  );
};
export default Page;
