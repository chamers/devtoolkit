"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { auth } from "@/lib/auth"; // <-- your better-auth server helper
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

  // 3) Map + create
  // Optional nicety: if there are images, set logoUrl to first image
  const imgUrls = values.imgUrls ?? [];
  const logoUrl = values.logoUrl ?? imgUrls[0] ?? null;

  try {
    const row = await prisma.resource.create({
      data: {
        title: values.title,
        designer: values.designer ?? null,
        tagLine: values.tagLine,

        mainCategory: values.mainCategory,
        category: values.category,
        subCategory: values.subCategory,

        rating: new Prisma.Decimal(values.rating),

        logoUrl,
        imgUrls,
        descriptions: values.descriptions,
        tags: values.tags ?? [],

        websiteUrl: values.websiteUrl,

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
