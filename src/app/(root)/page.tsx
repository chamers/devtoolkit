import SignOut from "@/components/auth/sign-out";
import GetStartedButton from "@/components/get-started-button";
import ResourceOverview from "@/components/resource-overview";
import prisma from "@/db";
import { ResourceFull } from "@/lib/validation/resource.schema";

const LandingPage = async () => {
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
    <div className="flex items-center justify-center h-dvh">
      <div className="flex justify-center gap-8 flex-col items-center">
        <h1>Welcome to DevToolkit</h1>
        <GetStartedButton />
        <ResourceOverview {...firstResource} />
      </div>
    </div>
  );
};
export default LandingPage;
