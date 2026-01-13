"use client";

import { changePasswordAction } from "@/actions/change-password.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "better-auth/api";

import { useState } from "react";
import { toast } from "sonner";

const ChangePasswordForm = () => {
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    const formData = new FormData(event.currentTarget);
    const { error } = await changePasswordAction(formData);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Password changed successfully!");
      (event.target as HTMLFormElement).reset();
      setIsPending(false);
    }
  }

  return (
    <form className="max-w-sm w-full space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input type="password" id="currentPassword" name="currentPassword" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input type="password" id="newPassword" name="newPassword" />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Updating..." : "Change Password"}
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
