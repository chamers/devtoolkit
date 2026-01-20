"use server";

import prisma from "@/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Prisma } from "@prisma/client";
import { resourceUpdateSchema } from "@/lib/validation/resource.schema";

export type UpdateResourceResult =
  | { ok: true; data: { id: string } }
  | { ok: false; message: string };

export async function updateResourceAction({
  resourceId,
  input,
}: {
  resourceId: string;
  input: unknown;
}): Promise<UpdateResourceResult> {
  const headersInstance = await headers();
  const session = await auth.api.getSession({ headers: headersInstance });

  if (!session) return { ok: false, message: "Unauthorized" };
  if (session.user.role !== "ADMIN") return { ok: false, message: "Forbidden" };

  const parsed = resourceUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.flatten().formErrors.join("; ") };
  }

  const values = parsed.data;

  try {
    // ✅ Minimal normalization (safe)
    const nextImgUrls =
      values.imgUrls !== undefined
        ? values.imgUrls.map((u) => u.trim()).filter(Boolean)
        : undefined;

    const nextTags =
      values.tags !== undefined
        ? values.tags.map((t) => t.trim()).filter(Boolean)
        : undefined;

    const nextDescriptions =
      values.descriptions !== undefined
        ? values.descriptions.map((d) => d.trim()).filter(Boolean)
        : undefined;

    const nextTitle =
      values.title !== undefined ? values.title.trim() : undefined;

    const nextTagLine =
      values.tagLine !== undefined ? values.tagLine.trim() : undefined;

    const nextDesigner =
      values.designer !== undefined
        ? values.designer?.trim()
          ? values.designer.trim()
          : null
        : undefined;

    const nextCategory =
      values.category !== undefined ? values.category.trim() : undefined;

    const nextSubCategory =
      values.subCategory !== undefined ? values.subCategory.trim() : undefined;

    const nextWebsiteUrl =
      values.websiteUrl !== undefined ? values.websiteUrl.trim() : undefined;

    // ✅ Keep logoUrl separate from imgUrls (no fallback)
    const nextLogoUrl =
      values.logoUrl !== undefined
        ? values.logoUrl?.trim()
          ? values.logoUrl.trim()
          : null
        : undefined;

    await prisma.resource.update({
      where: { id: resourceId },
      data: {
        ...(nextTitle !== undefined ? { title: nextTitle } : {}),
        ...(nextDesigner !== undefined ? { designer: nextDesigner } : {}),
        ...(nextTagLine !== undefined ? { tagLine: nextTagLine } : {}),

        ...(values.mainCategory !== undefined
          ? { mainCategory: values.mainCategory }
          : {}),
        ...(nextCategory !== undefined ? { category: nextCategory } : {}),
        ...(nextSubCategory !== undefined
          ? { subCategory: nextSubCategory }
          : {}),

        ...(values.rating !== undefined
          ? { rating: new Prisma.Decimal(values.rating) }
          : {}),

        ...(nextDescriptions !== undefined
          ? { descriptions: nextDescriptions }
          : {}),
        ...(nextTags !== undefined ? { tags: nextTags } : {}),

        ...(nextImgUrls !== undefined ? { imgUrls: nextImgUrls } : {}),
        ...(nextLogoUrl !== undefined ? { logoUrl: nextLogoUrl } : {}),

        ...(nextWebsiteUrl !== undefined ? { websiteUrl: nextWebsiteUrl } : {}),

        ...(values.pricing !== undefined ? { pricing: values.pricing } : {}),
        ...(values.projectType !== undefined
          ? { projectType: values.projectType }
          : {}),

        ...(values.isMobileFriendly !== undefined
          ? { isMobileFriendly: values.isMobileFriendly }
          : {}),
        ...(values.isFeatured !== undefined
          ? { isFeatured: values.isFeatured }
          : {}),
      },
      select: { id: true },
    });

    revalidatePath("/admin/resources");
    revalidatePath(`/admin/resources/${resourceId}`);
    revalidatePath(`/admin/resources/${resourceId}/edit`);
    revalidatePath(`/resources/${resourceId}`);

    return { ok: true, data: { id: resourceId } };
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("Update resource error:", err);
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Internal server error",
    };
  }
}
