// Central "approval gate" helper function to check if the user is authenticated and approved before allowing access to certain pages. This can be used in server-side functions or API routes to enforce access control based on user status.
import prisma from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Status } from "@prisma/client";

export async function requireApproved() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  if (!session) redirect("/signin");

  // ✅ Always read fresh status from DB (works even if session is cached)
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { status: true, role: true },
  });

  if (!dbUser) redirect("/signin");
  if (dbUser.role === "ADMIN") return session;
  if (dbUser.status !== Status.APPROVED) {
    redirect("/awaiting-approval");
  }

  return session;
}
