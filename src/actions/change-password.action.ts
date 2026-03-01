"use server";

import { auth } from "@/lib/auth";
import { requireApproved } from "@/lib/require-approved";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";

type ChangePasswordResult =
  | { success: true }
  | { success: false; error: string };

export async function changePasswordAction(
  formData: FormData,
): Promise<ChangePasswordResult> {
  // 🔐 Must be logged in AND APPROVED
  await requireApproved();

  const currentPassword = String(formData.get("currentPassword") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "").trim();

  if (!currentPassword) {
    return { success: false, error: "Please enter your current password." };
  }

  if (!newPassword) {
    return { success: false, error: "Please enter a new password." };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      error: "New password must be at least 8 characters.",
    };
  }

  if (newPassword.length > 20) {
    return {
      success: false,
      error: "New password must be at most 20 characters.",
    };
  }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword,
        newPassword,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, error: error.message };
    }

    console.error("changePasswordAction error:", error);
    return { success: false, error: "Internal server error." };
  }
}
