"use server";

import prisma from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Role, Status } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateUserStatusAction(userId: string, status: Status) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  if (!session) throw new Error("Unauthorized");
  if (session.user.role !== Role.ADMIN) throw new Error("Forbidden");

  await prisma.user.update({
    where: { id: userId },
    data: { status },
  });

  // ✅ refresh both pages
  revalidatePath("/admin/users");
  revalidatePath("/admin/approvals");
}
