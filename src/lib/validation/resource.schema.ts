// lib/validation/resource.schema.ts
import { z } from "zod";
import { MainCategory, Pricing, ProjectType } from "@prisma/client";

/* ===========================
   Enums (mirror Prisma enums)
=========================== */

export const pricingSchema = z.enum(Pricing);
export const projectTypeSchema = z.enum(ProjectType);
export const mainCategorySchema = z.enum(MainCategory);

/** Convenience arrays for UI dropdowns */
export const PRICING_OPTIONS = Object.values(Pricing);
export const PROJECT_TYPE_OPTIONS = Object.values(ProjectType);
export const MAIN_CATEGORY_OPTIONS = Object.values(MainCategory);

/* ===========================
   Misc field schemas
=========================== */

const httpLike = /^https?:\/\//i;

export const websiteUrlSchema = z
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

export const descriptionArraySchema = z
  .array(z.string().trim().min(10).max(2000))
  .min(1, { message: "Provide at least one description" })
  .max(10, { message: "Up to 10 descriptions" });

export const tagsSchema = z
  .array(z.string().trim().min(1).max(50))
  .max(50)
  .refine(
    (arr) => new Set(arr.map((t) => t.toLowerCase())).size === arr.length,
    { message: "Tags must be unique (case-insensitive)" }
  );

export const resourceCommentSchema = z.object({
  id: z.uuid(),
  resourceId: z.uuid(),
  userId: z.uuid(),

  comment: z.string().trim().min(1).max(5000),

  // Prisma Decimal → number
  rating: z.coerce.number().min(0).max(5),

  date: z.coerce.date(),
});

/* Array of comments */
export const resourceCommentArraySchema = z.array(resourceCommentSchema);

export const ratingSchema = z.coerce.number().min(0).max(5);

/* ===========================
   Category-level schemas
=========================== */

export const categoryLevelSchema = z.string().trim().min(1);
export const subCategoryLevelSchema = z.string().trim().min(1);

/* ===========================
   Resource schema (matches Prisma)
=========================== */

export const resourceSchema = z
  .object({
    id: z.string().uuid(),

    title: z.string().trim().min(2).max(255),
    designer: z.string().trim().min(2).max(255).nullable().optional(),

    tagLine: z.string().trim().min(2).max(500),

    mainCategory: mainCategorySchema,
    category: z.string().trim().min(1),
    subCategory: z.string().trim().min(1),

    rating: z.coerce.number().min(0).max(5),

    logoUrl: z.string().url().trim().nullable().optional(),
    imgUrls: z.array(z.string().url().trim()).default([]),

    descriptions: z.array(z.string().trim().min(10).max(2000)).min(1).max(10),
    tags: z
      .array(z.string().trim().min(1).max(50))
      .max(50)
      .refine(
        (arr) => new Set(arr.map((t) => t.toLowerCase())).size === arr.length,
        { message: "Tags must be unique (case-insensitive)" }
      ),

    // websiteUrl: z.string().trim().url(),
    websiteUrl: z.string().trim().url().or(z.literal("")),

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),

    pricing: pricingSchema,
    projectType: projectTypeSchema,

    isMobileFriendly: z.boolean(),
    isFeatured: z.boolean(),

    userId: z.string().uuid(),
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

/* ===========================
   Create / Update schemas
=========================== */

export const resourceCreateSchema = resourceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true, // ✅ injected on server
});

export const resourceUpdateSchema = resourceSchema
  .omit({ id: true, createdAt: true, updatedAt: true, userId: true })
  .partial();

/* ===========================
   Exported Types
=========================== */

export type PricingModel = z.infer<typeof pricingSchema>;
export type ProjectTypeModel = z.infer<typeof projectTypeSchema>;
export type MainCategoryModel = z.infer<typeof mainCategorySchema>;

export type ResourceFull = z.output<typeof resourceSchema>;
export type ResourceCreate = z.output<typeof resourceCreateSchema>;
export type ResourceUpdate = z.output<typeof resourceUpdateSchema>;
