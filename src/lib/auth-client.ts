// src/lib/auth-client.ts
"use client";
import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  adminClient,
  magicLinkClient,
} from "better-auth/client/plugins";
import type { auth } from "./auth";
import { ac, roles } from "./permissions";
import { toast } from "sonner";

export const authClient = createAuthClient({
  baseURL: "",
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({ ac, roles }),
    magicLinkClient(),
  ],

  fetchOptions: {
    onError: async (ctx) => {
      // 1. Handle Rate Limiting
      if (ctx.response?.status === 429) {
        const retryAfter = ctx.response.headers.get("X-Retry-After") ?? "60";
        toast.error(
          `Too many attempts. Please try again in ${retryAfter} seconds.`
        );
        return; // This returns undefined (void), which is correct.
      }

      // 2. Handle other errors
      const errorMessage = ctx.error?.message || "An unexpected error occurred";

      console.warn(
        "Auth client error:",
        ctx.response?.status,
        ctx.request?.url ?? "",
        errorMessage
      );

      // Note: We don't 'return toast.error' because toast.error returns a string/number (the toast ID)
      // We just call it.
      toast.error(errorMessage);
    },
  },
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  admin,
  requestPasswordReset, //sends the email
  resetPassword, //resets the password given token and new password
  updateUser,
  changePassword,
} = authClient;
