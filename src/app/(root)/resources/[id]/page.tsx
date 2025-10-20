import { eq } from "drizzle-orm";
import { resources } from "@/../database/schema";
import db from "@/../database/drizzle";
import { notFound } from "next/navigation";
import ResourceCard from "@/components/ResourceCard";
import { auth } from "@/../auth";
import { resourceSchema } from "@/lib/validations";

type PageProps = { params: { id: string } };

const Page = async ({ params }: PageProps) => {
  const { id } = params;

  // Session only used to decide admin visibility
  const session = await auth();
  const isAdmin = Boolean((session as any)?.user?.role === "admin");

  // Fetch resource
  const row = await db
    .select()
    .from(resources)
    .where(eq(resources.id, id))
    .limit(1);

  const resourceDetails = row[0];
  if (!resourceDetails) return notFound();

  // ---- Normalize DB row to match schema expectations ----
  // If your DB row doesn't include these fields or they can be null,
  // make sure to provide sensible defaults before validation.
  const normalized = {
    ...resourceDetails,
    comments: Array.isArray((resourceDetails as any).comments)
      ? (resourceDetails as any).comments
      : [],

    logoUrls: Array.isArray(resourceDetails.logoUrls)
      ? resourceDetails.logoUrls
      : [],

    // If websiteUrl can be null in DB but is required in schema, either:
    //  - provide a placeholder, or
    //  - make websiteUrl optional in the schema.
    // Here we pass through whatever DB has. If it's missing + schema requires it,
    // Zod will fail and we log it (see below).
  };

  // Validate with Zod (but don't hard-redirect on failure during dev)
  const parsed = resourceSchema.safeParse(normalized);
  if (!parsed.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Resource Zod validation failed:", parsed.error.flatten());
    }
    // As a fallback (so you can see the page), render using normalized data.
    // Once your DB ↔ schema align, this path won't be hit.
    return <ResourceCard {...(normalized as any)} isAdmin={isAdmin} />;
  }

  return <ResourceCard {...parsed.data} isAdmin={isAdmin} />;
};

export default Page;
