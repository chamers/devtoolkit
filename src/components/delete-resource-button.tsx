"use client";

import { TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useAuthState } from "@/hooks/useAuthState";

import { toast } from "sonner";
import { deleteResourceAction } from "@/actions/delete-resource.action";

interface DeleteResourceButtonProps {
  resourceId: string;
}

export const DeleteResourceButton = ({
  resourceId,
}: DeleteResourceButtonProps) => {
  const { loading, setLoading } = useAuthState();

  async function handleClick() {
    setLoading(true);
    const result = await deleteResourceAction({ resourceId });
    setLoading(false);

    if (!result?.ok) {
      toast.error(result?.message ?? "Unable to delete resource.");
      return;
    }

    toast.success("Resource deleted successfully.");
  }

  return (
    <Button
      size="icon"
      variant="destructive"
      aria-label="Delete Resource"
      className="size-7 rounded-sm"
      disabled={loading}
      onClick={handleClick}
    >
      <span className="sr-only">Delete Resource</span>
      <TrashIcon />
    </Button>
  );
};

export const PlaceholderDeleteResourceButton = () => {
  return (
    <Button
      size="icon"
      variant="destructive"
      aria-label="Delete Resource"
      className="size-7 rounded-sm"
      disabled
    >
      <span className="sr-only">Delete Resource</span>
      <TrashIcon />
    </Button>
  );
};
