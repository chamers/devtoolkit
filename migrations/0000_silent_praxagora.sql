CREATE TYPE "public"."category" AS ENUM('Design', 'UI/UX', 'Frontend', 'Backend', 'Fullstack', 'DevOps', 'APIs', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Frameworks', 'Version Control', 'Productivity', 'Testing', 'Security', 'Accessibility', 'AI/ML', 'Development');--> statement-breakpoint
CREATE TYPE "public"."pricing" AS ENUM('Free', 'Paid', 'Freemium', 'Open Source');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('Official', 'Community', 'Personal');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "resource_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resource_id" uuid NOT NULL,
	"user" varchar(255) NOT NULL,
	"comment" text NOT NULL,
	"date" date NOT NULL,
	CONSTRAINT "resource_comments_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"author" varchar(255) NOT NULL,
	"category" "category" NOT NULL,
	"rating" numeric(2, 1) NOT NULL,
	"descriptions" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"logo_urls" text[] DEFAULT ARRAY[]::text[],
	"website_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"tags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"pricing" "pricing" NOT NULL,
	"project_type" "project_type" NOT NULL,
	"is_mobile_friendly" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	CONSTRAINT "resources_rating_range" CHECK ("resources"."rating" >= 0 AND "resources"."rating" <= 5)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"status" "status" DEFAULT 'PENDING',
	"role" "role" DEFAULT 'USER',
	"last_activity_date" date DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "resource_comments" ADD CONSTRAINT "resource_comments_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE no action ON UPDATE no action;