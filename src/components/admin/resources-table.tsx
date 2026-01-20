import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DeleteResourceButton,
  PlaceholderDeleteResourceButton,
} from "@/components/delete-resource-button";
import type { MainCategory, Pricing, ProjectType } from "@prisma/client";

export type ResourceRow = {
  id: string;
  title: string;
  mainCategory: MainCategory;
  category: string;
  subCategory: string;
  pricing: Pricing;
  projectType: ProjectType;
  isFeatured: boolean;
  createdAt: Date;
};

export default function ResourcesTable({
  resources,
}: {
  resources: ResourceRow[];
}) {
  const sorted = [...resources].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div className="w-full overflow-x-auto">
      <table className="table-auto min-w-full whitespace-nowrap">
        <thead>
          <tr className="border-b text-sm text-left">
            <th className="px-2 py-2">ID</th>
            <th className="px-2 py-2">Title</th>
            <th className="px-2 py-2">Taxonomy</th>
            <th className="px-2 py-2">Pricing</th>
            <th className="px-2 py-2">Project</th>
            <th className="px-2 py-2 text-center">Featured</th>
            <th className="px-2 py-2">Created</th>
            <th className="px-2 py-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((r) => (
            <tr key={r.id} className="border-b text-sm text-left">
              <td className="px-4 py-2">{r.id.slice(0, 8)}</td>

              <td className="px-4 py-2">
                <span className="font-medium">{r.title}</span>
              </td>

              <td className="px-4 py-2">
                <div className="flex flex-col leading-tight">
                  <span className="text-xs text-slate-500">
                    {r.mainCategory}
                  </span>
                  <span>{r.category}</span>
                  <span className="text-xs text-slate-500">
                    {r.subCategory}
                  </span>
                </div>
              </td>

              <td className="px-4 py-2">
                <Badge variant="secondary">{r.pricing}</Badge>
              </td>

              <td className="px-4 py-2">
                <Badge variant="outline">{r.projectType}</Badge>
              </td>

              <td className="px-4 py-2 text-center">
                {r.isFeatured ? (
                  <Badge>Yes</Badge>
                ) : (
                  <span className="text-slate-400">No</span>
                )}
              </td>

              <td className="px-4 py-2">
                {r.createdAt.toLocaleDateString("en-GB")}
              </td>

              <td className="px-4 py-2 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/admin/resources/${r.id}`}>View</Link>
                  </Button>

                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/resources/${r.id}/edit`}>Edit</Link>
                  </Button>

                  {r.isFeatured ? (
                    <PlaceholderDeleteResourceButton />
                  ) : (
                    <DeleteResourceButton resourceId={r.id} />
                  )}
                </div>
              </td>
            </tr>
          ))}

          {sorted.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-8 text-center text-sm text-slate-500"
              >
                No resources yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
