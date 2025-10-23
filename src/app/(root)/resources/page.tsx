import db from "@/../database/drizzle";
import { resources } from "@/../database/schema";
import ResourceTile from "@/components/ResourceTile";

export default async function Page() {
  const rows = await db.select().from(resources).limit(50);

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Resources</h1>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No resources yet.</p>
      ) : (
        <ul className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
          {rows.map((r) => (
            <ResourceTile
              key={r.id}
              id={r.id}
              title={r.title}
              descriptions={r.descriptions ?? []}
              mainCategory={r.mainCategory}
              category={r.category}
              subcategory={r.subcategory}
              logoUrls={r.logoUrls ?? []}
              author={r.author}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
