export const dynamic = "force-dynamic";

import ReturnButton from "@/components/return-button";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export default function Page() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/signin" label="signin" />
        <h1 className="text-3xl font-semibold">Reset Password</h1>
        <p className="text-muted-foreground">Please enter your new password.</p>
      </div>

      <ResetPasswordForm />
    </div>
  );
}
