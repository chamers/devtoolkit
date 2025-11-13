"use server";

import { auth, ErrorCode } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { SignupSchema } from "@/lib/validation/auth.schema";

export type SignUpResult =
  | { ok: true }
  | { ok: false; message: string; code?: ErrorCode | "unknown_error" };

// export async function signUpEmailAction(formData: FormData) {
//   const name = String(formData.get("name"));
//   if (!name) return { error: "Name is required" };
//   const email = String(formData.get("email"));
//   if (!email) return { error: "Email is required" };
//   const password = String(formData.get("password"));
//   if (!password) return { error: "Password is required" };

//   try {
//     await auth.api.signUpEmail({
//       body: {
//         name,
//         email,
//         password,
//       },
//     });
//     return { error: null };
//   } catch (err) {
//     if (err instanceof APIError) {
//       const errCode = err.body ? (err.body.code as ErrorCode) : "unknown_error";
//       switch (errCode) {
//         case "USER_ALREADY_EXISTS":
//           return { error: "A user with this email already exists." };
//         default:
//           return {
//             error: err.message || "An error occurred during sign up.",
//           };
//       }
//     }
//     return { error: "Internal Server Error" };
//   }
// }

export async function signUpEmailAction(
  formData: FormData
): Promise<SignUpResult> {
  const rawName = formData.get("name");
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  // --- Defensive server-side validation (do NOT trust the client) ---
  const parsed = SignupSchema.safeParse({
    name: typeof rawName === "string" ? rawName : "",
    email: typeof rawEmail === "string" ? rawEmail : "",
    password: typeof rawPassword === "string" ? rawPassword : "",
  });

  if (!parsed.success) {
    // We *could* extract detailed messages here, but normally
    // this only happens if someone bypasses the client form.
    return {
      ok: false,
      message: "Invalid form data. Please check your inputs and try again.",
    };
  }

  const { name, email, password } = parsed.data;

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    return { ok: true };
  } catch (err) {
    // Non-Better-Auth error (network issue, unexpected bug, etc.)
    if (!(err instanceof APIError)) {
      console.error("Unknown signup error:", err);
      return {
        ok: false,
        message: "Internal server error. Please try again later.",
      };
    }

    const code = (err.body?.code as ErrorCode | undefined) ?? "unknown_error";

    // Helpful for discovering real codes in dev:
    // console.error("Better Auth signup error:", code, err.body);

    switch (code) {
      // Duplicate email
      case "USER_ALREADY_EXISTS":
        // If you discover a slightly different code for this,
        // just add another case here.
        return {
          ok: false,
          code,
          message: "A user with this email already exists.",
        };
      case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
        // If you discover a slightly different code for this,
        // just add another case here.
        return {
          ok: false,
          code,
          message: "A user with this email already exists.",
        };

      // Example: handle other explicit codes if you want to:
      // case "INVALID_EMAIL":
      //   return {
      //     ok: false,
      //     code,
      //     message: "Please enter a valid email address.",
      //   };

      // case "PASSWORD_TOO_WEAK":
      //   return {
      //     ok: false,
      //     code,
      //     message: "Your password is too weak. Please choose a stronger one.",
      //   };

      default:
        // Fallback for any other Better Auth error
        return {
          ok: false,
          code,
          message: "An error occurred during sign up. Please try again.",
        };
    }
  }
}
