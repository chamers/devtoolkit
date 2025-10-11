import type { z } from "zod";

/* ===========================
   Bring in schemas for inferring auth types
=========================== */
import { signUpSchema, signInSchema } from "@/lib/validations";

/* ===========================
   Re-export domain types from Zod (no duplication)
=========================== */
export type {
  PricingModel,
  ProjectType,
  Category,
  ResourceComment,
  ResourceFull, // full resource shape (incl. server-managed fields)
  ResourceCreate, // create input shape
  ResourceUpdate, // partial update shape
} from "@/lib/validations";

/* ===========================
   Auth input types (from Zod)
=========================== */
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;

/* ===========================
   DB I/O types (Drizzle)
=========================== */
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
// NOTE: adjust this import path to your aliasing setup if necessary
import { users, resources, resourceComments } from "@/../database/schema";

export type DBUser = InferSelectModel<typeof users>;
export type DBUserInsert = InferInsertModel<typeof users>;

export type DBResource = InferSelectModel<typeof resources>;
export type DBResourceInsert = InferInsertModel<typeof resources>;

export type DBResourceComment = InferSelectModel<typeof resourceComments>;
export type DBResourceCommentInsert = InferInsertModel<typeof resourceComments>;
