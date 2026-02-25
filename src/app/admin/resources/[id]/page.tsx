import ResourceOverview from "@/components/resource-overview";
import ReturnButton from "@/components/return-button";
import prisma from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

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
      // tagLine: true, // (intentionally not selecting since you want it hidden here)
      descriptions: true,
      designer: true,
      category: true,
      rating: true, // Decimal
      logoUrl: true,
      imgUrls: true,
      websiteUrl: true,
      isFeatured: true, // ✅ add this
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
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button asChild variant="outline">
          <Link href={`/admin/resources/${id}/edit`}>Edit</Link>
        </Button>
      </div>

      <ResourceOverview
        id={resource.id}
        title={resource.title}
        //tagLine={resource.tagLine ?? undefined}
        descriptions={resource.descriptions ?? []}
        designer={resource.designer}
        category={resource.category}
        rating={Number(resource.rating)} // ✅ Decimal -> number
        logoUrl={resource.logoUrl}
        imgUrls={resource.imgUrls ?? []}
        websiteUrl={resource.websiteUrl}
        //isFeatured={resource.isFeatured} // ✅ pass it through
        //hideTagLine // ✅ tagline won’t render on this page
      />
    </div>
  );
}
