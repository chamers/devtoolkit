import { z } from "zod";

// ===============================================
// 1. SIGN UP SCHEMA (Includes all required fields)
// ===============================================

/**
 * Define the Zod schema for user registration.
 * Note: The form uses 'username' but the auth function expects 'name'.
 * The validation is done against 'username' for the form component.
 */
export const SignupSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-z0-9_]+$/i, "Use letters, numbers, and underscores only.")
    .trim(),

  email: z
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email cannot exceed 255 characters." })
    .transform((v) => v.trim().toLowerCase()),

  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(72, "Passwords must be 72 characters or fewer.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
      "Include upper, lower, number, and symbol."
    ),
});

// Export the inferred TypeScript type from the schema for strong typing in components
export type SignupInput = z.infer<typeof SignupSchema>;

// ===============================================
// 2. LOGIN SCHEMA (Requires only email and password)
// ===============================================

/**
 * Define the Zod schema for user login.
 */
export const SigninSchema = z.object({
  email: z.email({ message: "Invalid email address" }).trim(),

  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(72, "Passwords must be 72 characters or fewer."),
});

export type SigninInput = z.infer<typeof SigninSchema>;
