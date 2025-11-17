"use server";

import prisma from "@/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type DeleteUserResult = { ok: true } | { ok: false; message: string };

export async function deleteUserAction({
  userId,
}: {
  userId: string;
}): Promise<DeleteUserResult> {
  const headersInstance = await headers();
  const session = await auth.api.getSession({ headers: headersInstance });
  // Mirror sign-in/up: return a result instead of throwing
  if (!session) {
    return { ok: false, message: "Unauthorized" };
  }

  if (session.user.role !== "ADMIN") {
    return { ok: false, message: "Forbidden" };
  }

  try {
    await prisma.user.delete({
      where: { id: userId, role: "USER" },
    });
    if (session.user.id === userId) {
      await auth.api.signOut({ headers: headersInstance });
      redirect("/signin");
    }
    revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch (err) {
    if (isRedirectError(err)) {
      throw err;
    }
    console.error("Delete user error:", err);

    if (err instanceof Error) {
      return { ok: false, message: err.message };
    }

    return { ok: false, message: "Internal server error" };
  }
}
