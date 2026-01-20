import ResourceOverview from "@/components/resource-overview";
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

  // --- Admin gate (mirrors your server action pattern) ---
  const headersInstance = await headers();
  const session = await auth.api.getSession({ headers: headersInstance });

  if (!session) redirect("/signin");
  if (session.user.role !== "ADMIN") redirect("/");

  // --- Fetch resource ---
  const resource = await prisma.resource.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      descriptions: true,
      designer: true,
      category: true,
      rating: true, // Decimal
      logoUrl: true,
      imgUrls: true,
      websiteUrl: true,
    },
  });

  if (!resource) notFound();

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="w-full flex justify-start">
        <ReturnButton href="/admin/resources" label="Resources" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Resource</h1>
        <p className="text-sm text-slate-500">
          Preview how this resource looks and jump to the public page.
        </p>
      </div>

      <ResourceOverview
        id={resource.id}
        title={resource.title}
        descriptions={resource.descriptions ?? []}
        designer={resource.designer}
        category={resource.category}
        rating={Number(resource.rating)} // ✅ Decimal -> number
        logoUrl={resource.logoUrl}
        imgUrls={resource.imgUrls ?? []}
        websiteUrl={resource.websiteUrl}
      />
    </div>
  );
}
