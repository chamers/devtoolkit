// import ReturnButton from "@/components/return-button";
// import ResetPasswordForm from "@/components/auth/reset-password-form";

// interface PageProps {
//   searchParams: { token?: string; error?: string };
// }

// export default function Page({ searchParams }: PageProps) {
//   const { token, error } = searchParams;

//   return (
//     <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
//       <div className="space-y-8">
//         <ReturnButton href="/signin" label="signin" />
//         <h1 className="text-3xl font-semibold">Reset Password</h1>
//       </div>

//       {error && (
//         <p className="text-destructive">
//           This reset link is invalid or expired. Please request a new one.
//         </p>
//       )}

//       {!error && !token && (
//         <p className="text-destructive">
//           Missing reset token. Please request a new password reset.
//         </p>
//       )}

//       {!error && token && (
//         <>
//           <p className="text-muted-foreground">
//             Please enter your new password.
//           </p>
//           <ResetPasswordForm />
//         </>
//       )}
//     </div>
//   );
// }

// src/app/(auth)/reset-password/page.tsx
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
