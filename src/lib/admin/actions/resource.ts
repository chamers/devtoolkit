"use server";
import { revalidatePath } from "next/cache";

import { resources, resourceComments } from "@/../database/schema";
import { eq } from "drizzle-orm";
import {
  resourceCreateSchema,
  resourceUpdateSchema,
  resourceSchema,
  type ResourceCreate,
  type ResourceUpdate,
  type ResourceFull,
} from "@/lib/validations";
import db from "../../../../database/drizzle";

function failure(error: string) {
  return { success: false as const, error };
}
function success<T>(data: T) {
  return { success: true as const, data };
}

export async function createResource(input: unknown) {
  const parsed = resourceCreateSchema.safeParse(input);
  if (!parsed.success)
    return failure(parsed.error.flatten().formErrors.join("; "));
  const values: ResourceCreate = parsed.data;

  try {
    const [row] = await db
      .insert(resources)
      .values({
        title: values.title,
        author: values.author,
        category: values.category,
        rating: values.rating,
        descriptions: values.descriptions, // CHANGED
        logoUrls: values.logoUrls ?? [],
        websiteUrl: values.websiteUrl,
        tags: values.tags ?? [],
        pricing: values.pricing,
        projectType: values.projectType,
        isMobileFriendly: values.isMobileFriendly,
        isFeatured: values.isFeatured,
      })
      .returning();

    revalidatePath("/resources");
    revalidatePath(`/admin/resources/${row.id}`);

    const full: ResourceFull = resourceSchema.parse({ ...row, comments: [] });
    return success(full);
  } catch (e: any) {
    console.error("createResource error", e);
    return failure(e?.message ?? "DB error creating resource");
  }
}

export async function updateResource(id: string, input: unknown) {
  const parsed = resourceUpdateSchema.safeParse(input);
  if (!parsed.success)
    return failure(parsed.error.flatten().formErrors.join("; "));
  const values: ResourceUpdate = parsed.data;

  try {
    const updateValues: Partial<typeof resources.$inferInsert> = {};
    if (values.title !== undefined) updateValues.title = values.title;
    if (values.author !== undefined) updateValues.author = values.author;
    if (values.category !== undefined) updateValues.category = values.category;
    if (values.rating !== undefined) updateValues.rating = values.rating;
    if (values.descriptions !== undefined)
      updateValues.descriptions = values.descriptions; // CHANGED
    if (values.logoUrls !== undefined) updateValues.logoUrls = values.logoUrls;
    if (values.websiteUrl !== undefined)
      updateValues.websiteUrl = values.websiteUrl;
    if (values.tags !== undefined) updateValues.tags = values.tags;
    if (values.pricing !== undefined) updateValues.pricing = values.pricing;
    if (values.projectType !== undefined)
      updateValues.projectType = values.projectType;
    if (values.isMobileFriendly !== undefined)
      updateValues.isMobileFriendly = values.isMobileFriendly;
    if (values.isFeatured !== undefined)
      updateValues.isFeatured = values.isFeatured;
    updateValues.updatedAt = new Date();

    const [row] = await db
      .update(resources)
      .set(updateValues)
      .where(eq(resources.id, id))
      .returning();
    if (!row) return failure("Resource not found");

    revalidatePath("/resources");
    revalidatePath(`/admin/resources/${row.id}`);

    const full: ResourceFull = resourceSchema.parse({
      ...row,
      comments: await getComments(row.id),
    });
    return success(full);
  } catch (e: any) {
    console.error("updateResource error", e);
    return failure(e?.message ?? "DB error updating resource");
  }
}

async function getComments(resourceId: string) {
  const rows = await db
    .select()
    .from(resourceComments)
    .where(eq(resourceComments.resourceId, resourceId));
  return rows.map((r) => ({ user: r.user, comment: r.comment, date: r.date }));
}
