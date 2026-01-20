import ResourcesTable, {
  type ResourceRow,
} from "@/components/admin/resources-table";
import ReturnButton from "@/components/return-button";
import prisma from "@/db";

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

  // Ensures the type matches and dates are Dates
  const rows: ResourceRow[] = resources;

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="w-full flex justify-start">
        <ReturnButton href="/admin/dashboard" label="Dashboard" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Resources</h1>
        <p className="text-sm text-slate-500">
          Manage resources, featured status, and edits.
        </p>
      </div>

      <ResourcesTable resources={rows} />
    </div>
  );
}
