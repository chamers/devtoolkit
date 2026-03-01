"use server";

import prisma from "@/db";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export type DeleteResourceResult =
  | { ok: true }
  | { ok: false; message: string };

export async function deleteResourceAction({
  resourceId,
}: {
  resourceId: string;
}): Promise<DeleteResourceResult> {
  try {
    // 🔐 Approved + Admin
    await requireAdmin();

    if (!resourceId) return { ok: false, message: "Missing resourceId" };

    // Ensure it exists (optional but gives nicer errors)
    const existing = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { id: true },
    });

    if (!existing) {
      return { ok: false, message: "Resource not found" };
    }

    await prisma.resource.delete({
      where: { id: resourceId },
    });

    // Revalidate pages that show resources
    revalidatePath("/resources");
    revalidatePath("/admin/resources");

    // Revalidate routes related to this resource (safe even if they don't exist)
    revalidatePath(`/resources/${resourceId}`);
    revalidatePath(`/admin/resources/${resourceId}`);
    revalidatePath(`/admin/resources/${resourceId}/edit`);

    return { ok: true };
  } catch (err) {
    if (isRedirectError(err)) throw err;

    console.error("deleteResourceAction error:", err);

    return {
      ok: false,
      message: err instanceof Error ? err.message : "Internal server error",
    };
  }
}
