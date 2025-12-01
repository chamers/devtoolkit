// "use client";

// import { useSession } from "@/lib/auth-client";
// import { Button } from "./ui/button";
// import Link from "next/link";

// const GetStartedButton = () => {
//   const { data: session, isPending } = useSession();
//   if (isPending) {
//     return (
//       <Button size="lg" className="opacity-50" asChild>
//         Get Started
//       </Button>
//     );
//   }

//   const href = session ? "/profile" : "/signin";
//   return (
//     <div className="flex flex-col items-center gap-4">
//       <Button size="lg" asChild>
//         <Link href={href}>Get Started</Link>
//       </Button>
//       {session && (
//         <p className="flex items-center gap-2">
//           <span
//             data-role={session.user.role}
//             className="size-4 rounded-full animate-pulse data-[role=USER]:bg-blue-600 data-[role=ADMIN]:bg-red-600"
//           />{" "}
//           Welcome back, {session.user.name}! 🤗
//         </p>
//       )}
//     </div>
//   );
// };
// export default GetStartedButton;

"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "./ui/button";
import Link from "next/link";
import { RoleBadge } from "./role-badge";

const GetStartedButton = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Button size="lg" className="opacity-50" disabled>
          Loading…
        </Button>
      </div>
    );
  }

  const isLoggedIn = !!session;

  // Determine route + label
  let href = "/signup";
  let label = "Get started";

  if (isLoggedIn) {
    if (session.user.role === "ADMIN") {
      href = "/admin/dashboard";
      label = "Go to dashboard";
    } else {
      href = "/profile";
      label = "Go to your profile";
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Primary action button */}
      <Button size="lg" asChild>
        <Link href={href}>{label}</Link>
      </Button>

      {/* Secondary text */}
      {isLoggedIn ? (
        <div className="flex flex-col items-center gap-1 text-sm">
          <div className="flex items-center gap-2">
            <RoleBadge role={session.user.role as string} />
            <span>Welcome back, {session.user.name}! 🤗</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-medium underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
};

export default GetStartedButton;
