"use server";

import prisma from "@/db";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";

export type DeleteUserResult = { ok: true } | { ok: false; message: string };

export async function deleteUserAction({
  userId,
}: {
  userId: string;
}): Promise<DeleteUserResult> {
  try {
    // 🔐 Approved + Admin
    const session = await requireAdmin();

    if (!userId) return { ok: false, message: "Missing userId" };

    // Extra safety: don't allow deleting non-USER roles
    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!target) {
      return { ok: false, message: "User not found" };
    }

    if (target.role !== Role.USER) {
      return {
        ok: false,
        message: "You can only delete regular users.",
      };
    }

    const headersInstance = await headers();

    // ✅ Use Better Auth Admin plugin to hard-delete the user
    await auth.api.removeUser({
      body: { userId },
      headers: headersInstance,
    });

    // If admin somehow deletes themselves (shouldn't happen since we only allow USER above),
    // still handle it gracefully:
    if (session.user.id === userId) {
      await auth.api.signOut({ headers: headersInstance });
      redirect("/signin");
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/users");

    return { ok: true };
  } catch (err) {
    if (isRedirectError(err)) throw err;

    console.error("Delete user error:", err);

    if (err instanceof Error) {
      return { ok: false, message: err.message };
    }

    return { ok: false, message: "Internal server error" };
  }
}
