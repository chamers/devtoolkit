"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { auth } from "@/lib/auth";
import { resourceCreateSchema } from "@/lib/validation/resource.schema";
import prisma from "@/db";
import { headers } from "next/headers";

function failure(error: string) {
  return { success: false as const, error };
}
function success<T>(data: T) {
  return { success: true as const, data };
}

export async function createResource(input: unknown) {
  // 1) AuthZ (admin-only)
  const headersInstance = await headers();
  const session = await auth.api.getSession({ headers: headersInstance });
  const user = session?.user;

  if (!user) return failure("Not authenticated");
  if (user.role !== "ADMIN") return failure("Not authorized");

  // 2) Validate input
  const parsed = resourceCreateSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.flatten().formErrors.join("; "));
  }

  const values = parsed.data;

  // ✅ Minimal normalization (safe)
  const title = values.title.trim();
  const tagLine = values.tagLine.trim();

  const designer = values.designer?.trim() ? values.designer.trim() : null;

  const category = values.category.trim();
  const subCategory = values.subCategory.trim();

  const descriptions = values.descriptions.map((d) => d.trim()).filter(Boolean);

  const imgUrls = (values.imgUrls ?? []).map((u) => u.trim()).filter(Boolean);

  const tags = (values.tags ?? []).map((t) => t.trim()).filter(Boolean);

  const websiteUrl = values.websiteUrl.trim();

  // Optional nicety: if there are images, set logoUrl to first image
  const logoUrl = values.logoUrl ?? imgUrls[0] ?? null;

  try {
    const row = await prisma.resource.create({
      data: {
        title,
        designer,
        tagLine,

        mainCategory: values.mainCategory,
        category,
        subCategory,

        rating: new Prisma.Decimal(values.rating),

        logoUrl,
        imgUrls,
        descriptions,
        tags,

        websiteUrl,

        pricing: values.pricing,
        projectType: values.projectType,

        isMobileFriendly: values.isMobileFriendly,
        isFeatured: values.isFeatured,

        userId: user.id,
      },
    });

    revalidatePath("/resources");
    revalidatePath("/admin/resources");

    return success(row);
  } catch (e: any) {
    console.error("createResource error", e);
    return failure(e?.message ?? "DB error creating resource");
  }
}
