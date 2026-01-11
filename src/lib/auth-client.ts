// src/lib/auth-client.ts
"use client";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, adminClient } from "better-auth/client/plugins";
import type { auth } from "./auth";
import { ac, roles } from "./permissions";
import { toast } from "sonner";

export const authClient = createAuthClient({
  baseURL: "",
  plugins: [inferAdditionalFields<typeof auth>(), adminClient({ ac, roles })],
  fetchOptions: {
    onError: async (ctx) => {
      if (ctx.response?.status === 429) {
        const retryAfter = ctx.response.headers.get("X-Retry-After") ?? "60";

        // ✅ Friendly UI instead of console error
        toast.error(
          `Too many attempts. Please try again in ${retryAfter} seconds.`
        );

        return;
      }

      // Optional: log other errors in a less noisy way
      console.warn(
        "Auth client error:",
        ctx.response?.status,
        ctx.request?.url ?? "",
        ctx.error ?? ctx.response
      );
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
} = authClient;
