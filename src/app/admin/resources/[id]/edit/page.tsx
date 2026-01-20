import ResourceForm from "@/components/admin/forms/resource-form";
import ReturnButton from "@/components/return-button";
import prisma from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Admin gate
  const headersInstance = await headers();
  const session = await auth.api.getSession({ headers: headersInstance });
  if (!session) redirect("/signin");
  if (session.user.role !== "ADMIN") redirect("/");

  const resource = await prisma.resource.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      designer: true,
      tagLine: true,

      mainCategory: true,
      category: true,
      subCategory: true,

      rating: true, // Decimal
      descriptions: true,
      tags: true,

      logoUrl: true,
      imgUrls: true,
      websiteUrl: true,

      pricing: true,
      projectType: true,
      isMobileFriendly: true,
      isFeatured: true,
    },
  });

  if (!resource) notFound();

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="w-full flex justify-start">
        <ReturnButton href={`/admin/resources/${id}`} label="Back" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Edit Resource</h1>
        <p className="text-sm text-slate-500">
          Update details and save changes.
        </p>
      </div>

      <section className="w-full max-w-full">
        <ResourceForm
          type="edit"
          resourceId={id}
          // spread initial values (convert Decimal -> number)
          {...resource}
          rating={Number(resource.rating)}
        />
      </section>
    </div>
  );
}
