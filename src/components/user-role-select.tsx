"use client";

import { useAuthState } from "@/hooks/useAuthState";
import { admin } from "@/lib/auth-client";
import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UserRoleSelectProps {
  userId: string;
  role: Role;
}

const UserRoleSelect = ({ userId, role }: UserRoleSelectProps) => {
  const { loading, setLoading } = useAuthState();
  const router = useRouter();
  async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = event.target.value as Role;
    const chanChangeRole = await admin.hasPermission({
      permissions: {
        user: ["set-role"],
      },
    });
    console.log(chanChangeRole);
    if (chanChangeRole.error)
      return toast.error("You do not have permission to change roles.");
    await admin.setRole({
      userId,
      role: newRole,
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("User role updated successfully.");
          router.refresh();
        },
      },
    });
  }
  return (
    <select
      value={role}
      onChange={handleChange}
      disabled={role === "ADMIN" || loading}
      className="px-3 py- text-sm disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="ADMIN">ADMIN</option>
      <option value="USER">USER</option>
    </select>
  );
};
export default UserRoleSelect;
