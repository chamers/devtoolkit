// Central "approval gate" helper function to check if the user is authenticated and approved before allowing access to certain pages. This can be used in server-side functions or API routes to enforce access control based on user status.
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireApproved() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  if (!session) redirect("/signin");

  // Only approved users can proceed
  if (session.user.status !== "APPROVED") redirect("/awaiting-approval");

  return session;
}
