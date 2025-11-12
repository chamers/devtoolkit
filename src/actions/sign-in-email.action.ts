"use server";

import { auth } from "@/lib/auth";
import { parseSetCookieHeader } from "better-auth/cookies";
import { cookies, headers } from "next/headers";

export async function signInEmailAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  if (!email) return { error: "Email is required" };

  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Password is required" };

  try {
    const res = await auth.api.signInEmail({
      headers: await headers(),
      body: { email, password },
      asResponse: true,
    });

    return { error: null };
  } catch (err) {
    if (err instanceof Error) {
      return {
        error: `${err.message} Oops! Something went wrong while signing in`,
      };
    }
    return { error: "Internal Server Error" };
  }
}
