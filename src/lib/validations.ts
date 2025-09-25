import { z } from 'zod';

export const signUpSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// --- ENUMS (mirror your TS union types) ---
export const pricingModelSchema = z.enum([
  "Free",
  "Paid",
  "Freemium",
  "Open Source",
]);

export const projectTypeSchema = z.enum([
  "Official",
  "Community",
  "Personal",
]);

export const categorySchema = z.enum([
  "Design",
  "UI/UX",
  "Frontend",
  "Backend",
  "Fullstack",
  "DevOps",
  "APIs",
  "JavaScript",
  "TypeScript",
  "CSS",
  "HTML",
  "Frameworks",
  "Version Control",
  "Productivity",
  "Testing",
  "Security",
  "Accessibility",
  "AI/ML",
  "Development",
]);

// --- Subschemas ---
const logoUrlSchema = z
  .string()
  .trim()
  .refine(
    (v) =>
      /^https?:\/\//i.test(v) ||
      v.startsWith("/") ||
      v.startsWith("data:") ||
      v.startsWith("blob:"),
    {
      message:
        "logoUrl must be an http(s) URL, data/blob URI, or an absolute path starting with /",
    }
  );

const websiteUrlSchema = z
  .string()
  .trim()
  .url({ message: "websiteUrl must be a valid URL" });

export const resourceCommentSchema = z.object({
  user: z.string().trim().min(1).max(100),
  comment: z.string().trim().min(1).max(1000),
  date: z.coerce.date(),
});

const tagsSchema = z
  .array(z.string().trim().min(1).max(50))
  .max(50)
  .refine(
    (arr) => new Set(arr.map((t) => t.toLowerCase())).size === arr.length,
    { message: "Tags must be unique (case-insensitive)" }
  );

const ratingSchema = z.coerce.number().min(0).max(5);

// --- Full Resource Schema (matches DB) ---
export const resourceSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().trim().min(2).max(100),
    // author: z.string().trim().min(2).max(100),
    // category: categorySchema,
    // rating: ratingSchema,
    // description: z.string().trim().min(10).max(2000),
    // logoUrl: logoUrlSchema,
    // websiteUrl: websiteUrlSchema,
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    // tags: tagsSchema,
    // pricing: pricingModelSchema,
    // projectType: projectTypeSchema,
    comments: z.array(resourceCommentSchema),
    // isMobileFriendly: z.boolean(),
    // isFeatured: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.updatedAt < data.createdAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["updatedAt"],
        message: "updatedAt cannot be earlier than createdAt",
      });
    }
  });

// --- Create Schema (for forms, omits server-managed fields) ---
export const resourceCreateSchema = resourceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  comments: true,
});

// --- Handy types (derived from schemas) ---
export type PricingModel = z.infer<typeof pricingModelSchema>;
export type ProjectType = z.infer<typeof projectTypeSchema>;
export type Category = z.infer<typeof categorySchema>;
export type ResourceComment = z.infer<typeof resourceCommentSchema>;
export type Resource = z.infer<typeof resourceSchema>;
export type ResourceCreateInput = z.infer<typeof resourceCreateSchema>;

