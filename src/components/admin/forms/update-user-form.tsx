"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UpdateUserFormProps {
  name: string;
  image: string;
}

const UpdateUserForm = ({
  name: initialName,
  image: initialImage,
}: UpdateUserFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const newName = formData.get("name") as string;
    const newImage = formData.get("image") as string;

    // Optional: Only send the request if something actually changed
    if (newName === initialName && newImage === initialImage) {
      toast.info("No changes detected");
      return;
    }

    await updateUser({
      name: newName || undefined,
      image: newImage || undefined,
      fetchOptions: {
        onRequest: () => setIsPending(true),
        onResponse: () => setIsPending(false),
        onError: (ctx) => {
          toast.error(ctx.error.message || "Something went wrong");
        },
        onSuccess: () => {
          toast.success("Profile updated!");
          // router.refresh() fetches new server data for the props
          router.refresh();
        },
      },
    });
  }

  return (
    <form className="max-w-sm w-full space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={initialName}
          placeholder="Your Name"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="image">Profile Image URL</Label>
        <Input
          type="url"
          id="image"
          name="image"
          defaultValue={initialImage}
          placeholder="https://..."
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
};

export default UpdateUserForm;
