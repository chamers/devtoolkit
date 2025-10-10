"use server";
import { signUpSchema } from "@/lib/validations";
import type { SignUpInput } from "@/lib/types";
import { eq } from "drizzle-orm";
import { AuthCredentials } from "@/lib/types";
import db from "../../../database/drizzle";
import { users } from "../../../database/schema";
import { hash } from "bcrypt";
import { signIn } from "../../../auth";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "../workflow";
import config from "@/lib/config";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect("/too-fast");

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.log(error, "Signin error");
    return { success: false, error: "Signin error" };
  }
};

export const signUp = async (params: SignUpInput) => {
  const { userName, email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1"; //getting user's IP address
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect("/too-fast");

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      userName,
      email,
      password: hashedPassword,
    });

    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
      body: {
        email,
        userName,
      },
    });

    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    console.log(error, "Signup error");
    return { success: false, error: "Signup error" };
  }
};

// type SignUpResult =
//   | { success: true }
//   | { success: false; error: string | Record<string, string[]> };

// export const signUp = async (params: SignUpInput): Promise<SignUpResult> => {
//   // ✅ Server-side validation (never trust client)
//   const parsed = signUpSchema.safeParse(params);
//   if (!parsed.success) {
//     // You can return flattened field errors to show in the UI
//     return { success: false, error: parsed.error.flatten().fieldErrors };
//   }

//   const { userName, email, password } = parsed.data;

//   // headers() is sync; no need to await
//   const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1"; //getting user's IP address
//   const { success } = await ratelimit.limit(ip);
//   if (!success) return redirect("/too-fast"); // throws to redirect

//   const existingUser = await db
//     .select()
//     .from(users)
//     .where(eq(users.email, email))
//     .limit(1);

//   if (existingUser.length > 0) {
//     return { success: false, error: "User already exists" };
//   }

//   const hashedPassword = await hash(password, 10);

//   try {
//     await db.insert(users).values({
//       userName,
//       email,
//       password: hashedPassword,
//       // id will default to uuid, createdAt defaults, etc.
//     });

//     await workflowClient.trigger({
//       url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
//       body: { email, userName },
//     });

//     return { success: true };
//   } catch (err) {
//     console.error("signUp error:", err);
//     return { success: false, error: "Failed to create user" };
//   }
// };
