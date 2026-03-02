import prisma from "@/db";
import { requireApproved } from "@/lib/require-approved";
import { Role } from "@prisma/client";

export async function requireAdmin() {
  const session = await requireApproved();

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== Role.ADMIN) {
    throw new Error("Forbidden");
  }

  return session;
}
