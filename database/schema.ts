// database/schema.ts
import { sql } from "drizzle-orm";
import {
  varchar,
  uuid,
  text,
  pgTable,
  date,
  pgEnum,
  timestamp,
  boolean,
  numeric,
  check,
  index,
} from "drizzle-orm/pg-core";

/* ===========================
   Enums
=========================== */
export const STATUS_ENUM = pgEnum("status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);
export const ROLE_ENUM = pgEnum("role", ["USER", "ADMIN"]);

export const PRICING_ENUM = pgEnum("pricing", [
  "Free",
  "Paid",
  "Freemium",
  "Open Source",
]);
export const PROJECT_TYPE_ENUM = pgEnum("project_type", [
  "Official",
  "Community",
  "Personal",
]);

// 🔁 NEW: top-level taxonomy enum (replace old CATEGORY_ENUM)
export const MAIN_CATEGORY_ENUM = pgEnum("main_category", [
  "Development",
  "Design",
  "Architecture / 3D",
  "Content & Writing",
  "Marketing & Analytics",
  "Video & Audio",
  "Productivity",
  "Education & E-Learning",
]);

// ⚠️ The old CATEGORY_ENUM is removed in the final state.
// If you still need it during migration, keep it in the migration script only.

/* ===========================
   USERS
=========================== */
export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  status: STATUS_ENUM("status").default("PENDING"),
  role: ROLE_ENUM("role").default("USER"),
  lastActivityDate: date("last_activity_date").defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/* ===========================
   RESOURCES
=========================== */
export const resources = pgTable(
  "resources",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    title: varchar("title", { length: 255 }).notNull(),
    author: varchar("author", { length: 255 }).notNull(),

    // 🔁 NEW 3-level taxonomy
    mainCategory: MAIN_CATEGORY_ENUM("main_category").notNull(),
    category: varchar("category", { length: 255 }).notNull(),
    subcategory: varchar("subcategory", { length: 255 }).notNull(),

    rating: numeric("rating", {
      precision: 2,
      scale: 1,
      mode: "number",
    }).notNull(),

    descriptions: text("descriptions")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),

    logoUrls: text("logo_urls")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),

    websiteUrl: text("website_url").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    tags: text("tags")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),

    pricing: PRICING_ENUM("pricing").notNull(),
    projectType: PROJECT_TYPE_ENUM("project_type").notNull(),

    isMobileFriendly: boolean("is_mobile_friendly").notNull().default(false),
    isFeatured: boolean("is_featured").notNull().default(false),

    // Optional: keep this if you want a quick, denormalized path for searching/sorting.
    // You can compute this in-app too; stored column may be handy.
    // categoryPath: text("category_path").notNull(), // "Development > DevOps > Networking"
  },
  (t) => [
    check("resources_rating_range", sql`${t.rating} >= 0 AND ${t.rating} <= 5`),

    // Helpful indexes
    index("resources_taxonomy_idx").on(
      t.mainCategory,
      t.category,
      t.subcategory
    ),
    index("resources_featured_idx").on(t.isFeatured),
    index("resources_pricing_idx").on(t.pricing),
  ]
);

/* ===========================
   RESOURCE COMMENTS
=========================== */
export const resourceComments = pgTable("resource_comments", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  resourceId: uuid("resource_id")
    .references(() => resources.id)
    .notNull(),
  user: varchar("user", { length: 255 }).notNull(),
  comment: text("comment").notNull(),
  date: date("date").notNull(),
});
