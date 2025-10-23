// validations.ts
import { z } from "zod";
import {
  MAIN_CATEGORIES,
  CATEGORY_OPTIONS_BY_MAIN,
  SUBCATEGORY_OPTIONS_BY_MAIN_AND_CAT,
  VALID_TRIPLES,
  type Main,
} from "./taxonomy";

/* ===========================
   Auth
=========================== */
export const signUpSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/* ===========================
   Enums (mirror DB enums)
=========================== */
export const pricingModelSchema = z.enum([
  "Free",
  "Paid",
  "Freemium",
  "Open Source",
]);
export const projectTypeSchema = z.enum(["Official", "Community", "Personal"]);

/* ===========================
   Taxonomy fields (3-level)
=========================== */

// Make Zod produce the literal union for mains (tuple cast so Zod infers a literal union)
export const mainCategorySchema: z.ZodType<Main> = z.enum(
  MAIN_CATEGORIES as unknown as readonly [Main, ...Main[]]
);

// Keep category/subcategory flexible strings; we’ll validate them against the taxonomy maps.
export const categoryLevelSchema = z.string().min(1);
export const subcategoryLevelSchema = z.string().min(1);

/** Convenience arrays for UI dropdowns */
export const PRICING_OPTIONS = pricingModelSchema.options;
export const PROJECT_TYPE_OPTIONS = projectTypeSchema.options;
export const MAIN_CATEGORY_OPTIONS = [...MAIN_CATEGORIES];

/* ===========================
   Subschemas
=========================== */

const httpLike = /^https?:\/\//i;

// Single item validator (kept reusable)
export const logoUrlItemSchema = z
  .string()
  .trim()
  .refine(
    (v) =>
      httpLike.test(v) ||
      v.startsWith("/") ||
      v.startsWith("data:") ||
      v.startsWith("blob:"),
    {
      message:
        "Each logo URL must be http(s), data/blob URI, or an absolute / path",
    }
  );

// Array: max 10 images, unique
export const logoUrlsSchema = z
  .array(logoUrlItemSchema)
  .min(1, { message: "Add at least one image" })
  .max(10, { message: "Too many images (max 10)" })
  .refine(
    (arr) =>
      new Set(arr.map((u) => u.trim().toLowerCase())).size === arr.length,
    {
      message: "Image URLs must be unique (case-insensitive)",
    }
  );

const websiteUrlSchema = z
  .string()
  .trim()
  .refine(
    (v) =>
      httpLike.test(v) ||
      v.startsWith("/") ||
      v.startsWith("data:") ||
      v.startsWith("blob:"),
    {
      message:
        "websiteUrl must be an http(s) URL, data/blob URI, or an absolute path starting with /",
    }
  );

export const resourceCommentSchema = z.object({
  user: z.string().trim().min(1).max(100),
  comment: z.string().trim().min(1).max(1000),
  date: z.coerce.date(),
});

export const descriptionsSchema = z
  .array(z.string().trim().min(10).max(2000))
  .min(1, { message: "Provide at least one description" })
  .max(5, { message: "Up to 5 descriptions" });

const tagsSchema = z
  .array(z.string().trim().min(1).max(50))
  .max(50)
  .refine(
    (arr) => new Set(arr.map((t) => t.toLowerCase())).size === arr.length,
    { message: "Tags must be unique (case-insensitive)" }
  );

const ratingSchema = z.coerce.number().min(0).max(5);

/* ===========================
   Category triple schema
=========================== */
export const categoryTripleSchema = z
  .object({
    mainCategory: mainCategorySchema, // Main
    category: categoryLevelSchema,
    subcategory: subcategoryLevelSchema,
  })
  .superRefine((val, ctx) => {
    const { mainCategory, category, subcategory } = val;

    // 1) Category must exist under main
    const allowedCategories = CATEGORY_OPTIONS_BY_MAIN[mainCategory] ?? [];
    if (!allowedCategories.includes(category)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["category"],
        message: `Category "${category}" is not valid under "${mainCategory}".`,
      });
      return;
    }

    // 2) Subcategory must exist under (main, category)
    const allowedSubs =
      SUBCATEGORY_OPTIONS_BY_MAIN_AND_CAT[mainCategory]?.[category] ?? [];
    if (!allowedSubs.includes(subcategory)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["subcategory"],
        message: `Subcategory "${subcategory}" is not valid under "${mainCategory} → ${category}".`,
      });
      return;
    }

    // 3) Optional fast safety check
    const key = `${mainCategory}>>>${category}>>>${subcategory}`;
    if (!VALID_TRIPLES.has(key)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid category combination.",
      });
    }
  });

/* ===========================
   Full Resource Schema (matches DB)
=========================== */
export const resourceSchema = z
  .object({
    id: z.uuid(),
    title: z.string().trim().min(2).max(100),
    author: z.string().trim().min(2).max(100),

    // New triple replaces old flat category
    mainCategory: mainCategorySchema,
    category: categoryLevelSchema,
    subcategory: subcategoryLevelSchema,

    rating: ratingSchema,
    descriptions: descriptionsSchema,
    logoUrls: logoUrlsSchema.optional(),
    websiteUrl: websiteUrlSchema,
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    tags: tagsSchema,
    pricing: pricingModelSchema,
    projectType: projectTypeSchema,
    comments: z.array(resourceCommentSchema),
    isMobileFriendly: z.boolean(),
    isFeatured: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.updatedAt < data.createdAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["updatedAt"],
        message: "updatedAt cannot be earlier than createdAt",
      });
    }
  })
  .superRefine((data, ctx) => {
    // Reuse the triple validator to keep things DRY
    const check = categoryTripleSchema.safeParse({
      mainCategory: data.mainCategory,
      category: data.category,
      subcategory: data.subcategory,
    });
    if (!check.success) {
      for (const issue of check.error.issues) {
        ctx.addIssue(issue);
      }
    }
  });

// --- Create Schema (for forms, omits server-managed fields) ---
export const resourceCreateSchema = resourceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  comments: true,
});

// --- Update Schema (partial for edit flows) ---
export const resourceUpdateSchema = resourceSchema
  .omit({ id: true, createdAt: true, updatedAt: true, comments: true })
  .partial();

/* ===========================
   Exported Types (post-coercion)
=========================== */
export type PricingModel = z.infer<typeof pricingModelSchema>;
export type ProjectType = z.infer<typeof projectTypeSchema>;
export type MainCategory = z.infer<typeof mainCategorySchema>; // equals `Main`
export type CategoryName = z.infer<typeof categoryLevelSchema>;
export type SubcategoryName = z.infer<typeof subcategoryLevelSchema>;

export type LogoUrl = z.infer<typeof logoUrlItemSchema>;
export type LogoUrls = z.output<typeof logoUrlsSchema>;
export type Descriptions = z.output<typeof descriptionsSchema>;
export type Rating = z.output<typeof ratingSchema>;

export type ResourceComment = z.infer<typeof resourceCommentSchema>;
export type ResourceFull = z.output<typeof resourceSchema>;
export type ResourceCreate = z.output<typeof resourceCreateSchema>;
export type ResourceUpdate = z.output<typeof resourceUpdateSchema>;
