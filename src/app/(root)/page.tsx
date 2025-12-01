import SignOut from "@/components/auth/sign-out";
import GetStartedButton from "@/components/get-started-button";
import ResourceList from "@/components/resource-list";
import ResourceOverview from "@/components/resource-overview";
import prisma from "@/db";
import { ResourceFull } from "@/lib/validation/resource.schema";

const LandingPage = async () => {
  const dbUsers = await prisma.user.findMany();
  // 1. Fetch latest 10 resources from Prisma
  const dbResources = await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  // 3. Normalize Prisma data → ResourceFull shape (mainly rating: Decimal → number)
  const latestResources: ResourceFull[] = dbResources.map((r) => ({
    ...r,
    rating: Number(r.rating),
  }));
  const firstResource = latestResources[0];
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <div className="flex justify-center gap-8 flex-col items-center">
        <h1>Welcome to DevToolkit</h1>
        <GetStartedButton />
        <ResourceOverview {...firstResource} />
        <ResourceList
          title="Latest Resources"
          resources={latestResources.slice(1)}
          containerClassName="my-10 flex flex-col "
        />
      </div>
    </div>
  );
};
export default LandingPage;
