import GetStartedButton from "@/components/get-started-button";
import ResourceList from "@/components/resource-list";
import ResourceOverview from "@/components/resource-overview";
import prisma from "@/db";
import { ResourceFull } from "@/lib/validation/resource.schema";

const LandingPage = async () => {
  const dbResources = await prisma.resource.findMany({
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 10,
  });

  const latestResources: ResourceFull[] = dbResources.map((r) => ({
    ...r,
    rating: Number(r.rating),
  }));

  // ✅ pick the first featured resource (because we ordered featured first)
  const featuredResource = latestResources.find((r) => r.isFeatured) ?? null;

  // ✅ list should NOT duplicate the overview resource
  const listResources = featuredResource
    ? latestResources.filter((r) => r.id !== featuredResource.id)
    : latestResources;

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <div className="flex justify-center gap-8 flex-col items-center">
        <h1>Welcome to DevToolkit</h1>
        <GetStartedButton />

        {featuredResource ? <ResourceOverview {...featuredResource} /> : null}

        <ResourceList
          title="Latest Resources"
          resources={listResources}
          containerClassName="my-10 flex flex-col"
        />
      </div>
    </div>
  );
};

export default LandingPage;
