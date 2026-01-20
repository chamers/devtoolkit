"use server";

import prisma from "@/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";

export type DeleteResourceResult =
  | { ok: true }
  | { ok: false; message: string };

export async function deleteResourceAction({
  resourceId,
}: {
  resourceId: string;
}): Promise<DeleteResourceResult> {
  const headersInstance = await headers();
  const session = await auth.api.getSession({ headers: headersInstance });

  if (!session) {
    return { ok: false, message: "Unauthorized" };
  }

  if (session.user.role !== "ADMIN") {
    return { ok: false, message: "Forbidden" };
  }

  try {
    const target = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { id: true, isFeatured: true },
    });

    if (!target) {
      return { ok: false, message: "Resource not found" };
    }

    // Mirror your "only delete USER" style safety rule:
    if (target.isFeatured) {
      return {
        ok: false,
        message: "You can't delete a featured resource. Unfeature it first.",
      };
    }

    await prisma.resource.delete({
      where: { id: resourceId },
    });

    // Revalidate list + anything public that depends on resources
    revalidatePath("/admin/resources");
    revalidatePath("/resources");

    return { ok: true };
  } catch (err) {
    if (isRedirectError(err)) throw err;

    console.error("Delete resource error:", err);

    if (err instanceof Error) {
      return { ok: false, message: err.message };
    }

    return { ok: false, message: "Internal server error" };
  }
}
