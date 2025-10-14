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
} from "drizzle-orm/pg-core";

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
export const CATEGORY_ENUM = pgEnum("category", [
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

// --- USERS TABLE ---
export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  status: STATUS_ENUM("status").default("PENDING"),
  role: ROLE_ENUM("role").default("USER"),
  lastActivityDate: date("last_activity_date").defaultNow(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});

// --- RESOURCES TABLE ---
export const resources = pgTable(
  "resources",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    category: CATEGORY_ENUM("category").notNull(),
    rating: numeric("rating", {
      precision: 2,
      scale: 1,
      mode: "number",
    }).notNull(),

    description: text("description").notNull(),

    // choose one: nullable if optional in app
    // logoUrl: text("logo_url"),  or remove .notNull() if optional
    logoUrls: text("logo_urls")
      .array()
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

    // CHECK constraint (Drizzle exposes via `.check()` in builders or add in migration SQL)
  },
  (t) => [
    check("resources_rating_range", sql`${t.rating} >= 0 AND ${t.rating} <= 5`),
    // index('resources_category_idx').on(t.category),
    // index('resources_featured_idx').on(t.isFeatured),
  ]
);

// --- RESOURCE COMMENTS TABLE ---
export const resourceComments = pgTable("resource_comments", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  resourceId: uuid("resource_id")
    .references(() => resources.id)
    .notNull(),
  user: varchar("user", { length: 255 }).notNull(),
  comment: text("comment").notNull(),
  date: date("date").notNull(),
});
