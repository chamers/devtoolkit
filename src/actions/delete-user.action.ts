// "use server";

// import prisma from "@/db";
// import { auth } from "@/lib/auth";
// import { revalidatePath } from "next/cache";
// import { isRedirectError } from "next/dist/client/components/redirect-error";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
// import { Role } from "@/generated/prisma";

// export type DeleteUserResult = { ok: true } | { ok: false; message: string };

// export async function deleteUserAction({
//   userId,
// }: {
//   userId: string;
// }): Promise<DeleteUserResult> {
//   const headersInstance = await headers();
//   const session = await auth.api.getSession({ headers: headersInstance });
//   // Mirror sign-in/up: return a result instead of throwing
//   if (!session) {
//     return { ok: false, message: "Unauthorized" };
//   }

//   if (session.user.role !== "ADMIN") {
//     return { ok: false, message: "Forbidden" };
//   }

//   try {
//     await prisma.user.delete({
//       where: { id: userId, role: "USER" },
//     });
//     if (session.user.id === userId) {
//       await auth.api.signOut({ headers: headersInstance });
//       redirect("/signin");
//     }
//     revalidatePath("/admin/dashboard");
//     return { ok: true };
//   } catch (err) {
//     if (isRedirectError(err)) {
//       throw err;
//     }
//     console.error("Delete user error:", err);

//     if (err instanceof Error) {
//       return { ok: false, message: err.message };
//     }

//     return { ok: false, message: "Internal server error" };
//   }
// }

"use server";

import prisma from "@/db";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
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

  // Same as dashboard: must be signed in
  if (!session) {
    return { ok: false, message: "Unauthorized" };
  }

  // Same as dashboard: only ADMIN can use the admin UI
  // (session.user.role is the string from the session: "ADMIN", "USER", etc.)
  if (session.user.role !== "ADMIN") {
    return { ok: false, message: "Forbidden" };
  }

  try {
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
