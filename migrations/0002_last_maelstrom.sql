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
	"description" text NOT NULL,
	"logo_url" text,
	"website_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"tags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"pricing" "pricing" NOT NULL,
	"project_type" "project_type" NOT NULL,
	"is_mobile_friendly" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "resource_comments" ADD CONSTRAINT "resource_comments_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE no action ON UPDATE no action;