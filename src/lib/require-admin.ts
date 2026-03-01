import { requireApproved } from "@/lib/require-approved";
import { Role } from "@prisma/client";

export async function requireAdmin() {
  const session = await requireApproved();
  if (session.user.role !== Role.ADMIN) {
    throw new Error("Not authorized");
  }
  return session;
}
