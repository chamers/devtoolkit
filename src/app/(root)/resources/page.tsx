// import { eq } from "drizzle-orm";
// import { resources } from "../../../../../database/schema";
// import db from "../../../../../database/drizzle";
// import { redirect } from "next/navigation";
// import ResourceOverview from "@/components/ResourceOverview";
// import { auth } from "../../../../../auth";

// const page = async ({ params }: { params: Promise<{ id: string }> }) => {
//   const id = (await params).id;
//   const session = await auth();

//   //fetch data with id
//   const [resourceDetails] = await db
//     .select()
//     .from(resources)
//     .where(eq(resources.id, id))
//     .limit(1);
//   if (!resourceDetails) redirect("/404");

//   return (
//     <>
//       <ResourceOverview
//         {...resourceDetails}
//         userId={session?.user?.id as string}
//       />
//     </>
//   );
// };
// export default page;

import db from "@/../database/drizzle";
import { resources } from "@/../database/schema";
import ResourceForm from "@/components/admin/forms/ResourceForm";
import ResourceTile from "@/components/ResourceTile";

export default async function Page() {
  const rows = await db.select().from(resources).limit(50);

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Resources</h1>
      <ul className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
        {rows.map((r) => (
          <ResourceTile
            key={r.id}
            id={r.id}
            title={r.title}
            descriptions={r.descriptions}
            category={r.category}
            logoUrls={r.logoUrls}
            author={r.author}
          />
        ))}
      </ul>
    </main>
  );
}
