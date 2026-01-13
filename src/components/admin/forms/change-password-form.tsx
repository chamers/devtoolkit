// "use client";

// import { changePasswordAction } from "@/actions/change-password.action";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { changePassword } from "better-auth/api";

// import { useState } from "react";
// import { toast } from "sonner";

// const ChangePasswordForm = () => {
//   const [isPending, setIsPending] = useState(false);

//   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setIsPending(true);
//     const formData = new FormData(event.currentTarget);
//     const { error } = await changePasswordAction(formData);
//     if (error) {
//       toast.error(error);
//     } else {
//       toast.success("Password changed successfully!");
//       (event.target as HTMLFormElement).reset();
//       setIsPending(false);
//     }
//   }

//   return (
//     <form className="max-w-sm w-full space-y-4" onSubmit={handleSubmit}>
//       <div className="flex flex-col gap-2">
//         <Label htmlFor="currentPassword">Current Password</Label>
//         <Input type="password" id="currentPassword" name="currentPassword" />
//       </div>
//       <div className="flex flex-col gap-2">
//         <Label htmlFor="newPassword">New Password</Label>
//         <Input type="password" id="newPassword" name="newPassword" />
//       </div>

//       <Button type="submit" className="w-full" disabled={isPending}>
//         {isPending ? "Updating..." : "Change Password"}
//       </Button>
//     </form>
//   );
// };

// export default ChangePasswordForm;

// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { authClient } from "@/lib/auth-client"; // Use your client instance
// import { useState } from "react";
// import { toast } from "sonner";

// const ChangePasswordForm = () => {
//   const [isPending, setIsPending] = useState(false);

//   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     const formData = new FormData(event.currentTarget);
//     const currentPassword = formData.get("currentPassword") as string;
//     const newPassword = formData.get("newPassword") as string;

//     if (!currentPassword || !newPassword) {
//       toast.error("Please fill in all password fields");
//       return;
//     }

//     await authClient.changePassword({
//       newPassword: newPassword,
//       currentPassword: currentPassword,
//       revokeOtherSessions: true, // Optional: logs out other devices for security
//       fetchOptions: {
//         onRequest: () => setIsPending(true),
//         onResponse: () => setIsPending(false),
//         onSuccess: () => {
//           toast.success("Password changed successfully!");
//           (event.target as HTMLFormElement).reset();
//         },
//         onError: (ctx) => {
//           toast.error(ctx.error.message || "Failed to change password");
//         },
//       },
//     });
//   }

//   return (
//     <form className="max-w-sm w-full space-y-4" onSubmit={handleSubmit}>
//       <div className="flex flex-col gap-2">
//         <Label htmlFor="currentPassword">Current Password</Label>
//         <Input
//           type="password"
//           id="currentPassword"
//           name="currentPassword"
//           placeholder="••••••••"
//         />
//       </div>
//       <div className="flex flex-col gap-2">
//         <Label htmlFor="newPassword">New Password</Label>
//         <Input
//           type="password"
//           id="newPassword"
//           name="newPassword"
//           placeholder="••••••••"
//         />
//       </div>

//       <Button type="submit" className="w-full" disabled={isPending}>
//         {isPending ? "Updating..." : "Update Password"}
//       </Button>
//     </form>
//   );
// };

// export default ChangePasswordForm;

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/lib/auth-client";
import { useState, useMemo } from "react";
import { toast } from "sonner";

const ChangePasswordForm = () => {
  const [isPending, setIsPending] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const strength = useMemo(() => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;
    return score;
  }, [newPassword]);

  const strengthColor = [
    "bg-gray-200",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ][strength];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;

    if (strength < 2) {
      toast.error("Password is too weak. Please include more variety.");
      return;
    }

    await changePassword({
      newPassword: newPassword,
      currentPassword: currentPassword,
      revokeOtherSessions: true,
      fetchOptions: {
        onRequest: () => setIsPending(true),
        onResponse: () => setIsPending(false),
        onSuccess: () => {
          toast.success("Password updated successfully!");
          (event.target as HTMLFormElement).reset();
          setNewPassword("");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to change password");
        },
      },
    });
  }

  return (
    <form className="max-w-sm w-full space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          type="password"
          id="currentPassword"
          name="currentPassword"
          placeholder="Enter your current password" // Added placeholder
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          type="password"
          id="newPassword"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter your new password" // Added placeholder
          required
        />

        {/* Strength Meter Bar */}
        <div className="flex gap-1 h-1.5 mt-1">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-full w-full rounded-full transition-colors duration-300 ${
                strength >= step ? strengthColor : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground italic">
          Minimum 8 characters, include numbers and symbols.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || strength < 2}
      >
        {isPending ? "Updating..." : "Change Password"}
      </Button>

      {/* Visual hint for why the button might be "light orange" (disabled) */}
      {newPassword && strength < 2 && (
        <p className="text-[10px] text-red-500 text-center">
          Password too weak to submit
        </p>
      )}
    </form>
  );
};

export default ChangePasswordForm;
