"use server";

import { auth, ErrorCode } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { SigninSchema } from "@/lib/validation/auth.schema";
import { headers } from "next/headers";

export type SignInResult =
  | { ok: true }
  | { ok: false; message: string; code?: ErrorCode | "unknown_error" };

export async function signInEmailAction(
  formData: FormData
): Promise<SignInResult> {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  // Defensive server-side validation
  const parsed = SigninSchema.safeParse({
    email: typeof rawEmail === "string" ? rawEmail : "",
    password: typeof rawPassword === "string" ? rawPassword : "",
  });

  if (!parsed.success) {
    // This should mostly trigger only if someone bypasses the client.
    return {
      ok: false,
      message: "Invalid credentials. Please check your email and password.",
    };
  }

  const { email, password } = parsed.data;

  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: { email, password },
    });

    return { ok: true };
  } catch (err) {
    // Non-Better-Auth error (unexpected)
    if (!(err instanceof APIError)) {
      console.error("Unknown sign-in error:", err);
      return {
        ok: false,
        message: "Internal server error. Please try again later.",
      };
    }

    const code = (err.body?.code as ErrorCode | undefined) ?? "unknown_error";

    // Helpful during development:
    // console.error("Better Auth sign-in error:", code, err.body);

    switch (code) {
      // These are typical "bad credentials" style codes.
      // Adjust/add cases to match the real codes you see in logs.
      case "INVALID_EMAIL":
      case "INVALID_PASSWORD":
      case "INVALID_EMAIL_OR_PASSWORD":
      case "USER_NOT_FOUND":
        return {
          ok: false,
          code,
          message: "Invalid email or password.",
        };

      case "CREDENTIAL_ACCOUNT_NOT_FOUND":
        return {
          ok: false,
          code,
          message: "Your email is not verified yet.",
        };

      default:
        return {
          ok: false,
          code,
          message: "An error occurred while signing in. Please try again.",
        };
    }
  }
}
