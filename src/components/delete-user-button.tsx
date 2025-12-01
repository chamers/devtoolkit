"use client";
import { TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useAuthState } from "@/hooks/useAuthState";
import { deleteUserAction } from "@/actions/delete-user.action";
import { toast } from "sonner";

interface DeleteUserButtonProps {
  userId: string;
}

export const DeleteUserButton = ({ userId }: DeleteUserButtonProps) => {
  const { loading, setLoading } = useAuthState();
  async function handleClick() {
    setLoading(true);
    const result = await deleteUserAction({ userId });
    // Next.js may redirect *inside* the server action — if that happens,
    // this code may not run (which is correct).
    setLoading(false);
    if (!result?.ok) {
      toast.error(result?.message ?? "Unable to delete user.");
      return;
    }

    // Deleted successfully
    toast.success("User deleted successfully.");
  }
  return (
    <Button
      size="icon"
      variant="destructive"
      aria-label="Delete User"
      className="size-7 rounded-sm"
      disabled={loading}
      onClick={handleClick}
    >
      <span className="sr-only">Delete User</span>
      <TrashIcon />
    </Button>
  );
};

export const PlaceholderDeleteUserButton = () => {
  return (
    <Button
      size="icon"
      variant="destructive"
      aria-label="Delete User"
      className="size-7 rounded-sm"
      disabled
    >
      <span className="sr-only">Delete User</span>
      <TrashIcon />
    </Button>
  );
};
