import ResourcesTable, {
  type ResourceRow,
} from "@/components/admin/resources-table";
import ReturnButton from "@/components/return-button";
import { Button } from "@/components/ui/button";
import prisma from "@/db";
import Link from "next/link";

export default async function Page() {
  const resources = await prisma.resource.findMany({
    select: {
      id: true,
      title: true,
      mainCategory: true,
      category: true,
      subCategory: true,
      pricing: true,
      projectType: true,
      isFeatured: true,
      createdAt: true,
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  const rows: ResourceRow[] = resources;

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Top: back button */}
      <div className="w-full flex justify-start">
        <ReturnButton href="/admin/dashboard" label="Dashboard" />
      </div>

      {/* Header row: title/subtitle left, CTA right */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Resources</h1>
          <p className="text-sm text-slate-500">
            Manage resources, featured status, and edits.
          </p>
        </div>

        <Button asChild className="sm:mt-1 w-full sm:w-auto">
          <Link href="/admin/resources/new">Create a New Resource</Link>
        </Button>
      </div>

      <ResourcesTable resources={rows} />
    </div>
  );
}
