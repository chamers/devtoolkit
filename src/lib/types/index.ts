// lib/types/index.ts
import type { z } from "zod";

// Auth schemas
import { SignupSchema, SigninSchema } from "@/lib/validation/auth.schema";

// Resource schemas
import {
  resourceSchema,
  resourceCreateSchema,
  resourceUpdateSchema,
  type PricingModel,
  type ProjectTypeModel,
  type MainCategoryModel,
  type ResourceFull,
  type ResourceCreate,
  type ResourceUpdate,
} from "@/lib/validation/resource.schema";

// ===========================
// Auth input types (from Zod)
// ===========================
export type SignupInput = z.infer<typeof SignupSchema>;
export type SigninInput = z.infer<typeof SigninSchema>;

// ===========================
// Resource types (from Zod)
// ===========================
export {
  PricingModel,
  ProjectTypeModel,
  MainCategoryModel,
  ResourceFull,
  ResourceCreate,
  ResourceUpdate,
};

// ===========================
// DB types (Prisma)
// ===========================
import type { Prisma } from "@prisma/client";

//export type DBUser = Prisma.UserGetPayload<{}>;
//export type DBResource = Prisma.ResourceGetPayload<{}>;
//export type DBResourceComment = Prisma.ResourceCommentGetPayload<{}>;
//export type DBNewsUpdate = Prisma.NewsUpdateGetPayload<{}>;
