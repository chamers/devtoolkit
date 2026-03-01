import UsersTable from "@/components/admin/users-table";
import ReturnButton from "@/components/return-button";
import prisma from "@/db";
import { Status } from "@prisma/client";

export default async function Page() {
  const users = await prisma.user.findMany({
    where: { status: Status.PENDING },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="w-full flex justify-start">
        <ReturnButton href="/admin/dashboard" label="Dashboard" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Approvals</h1>
        <p className="text-sm text-slate-500">
          Review pending accounts and approve, reject, or suspend them.
        </p>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
