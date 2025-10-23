import ResourceList from "@/components/ResourceList";
import { Button } from "@/components/ui/button";
import db from "../../../../database/drizzle";
import { resources } from "../../../../database/schema";
import { signOut } from "../../../../auth";
import { ResourceFull } from "@/lib/types";
import { desc } from "drizzle-orm";

const page = async () => {
  const latestResources = (await db
    .select()
    .from(resources)
    .limit(10)
    .orderBy(desc(resources.createdAt))) as ResourceFull[];
  return (
    <>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
        className="mb-10"
      >
        <Button>Sign Out</Button>
      </form>
      <ResourceList
        title="Latest Resources"
        resources={latestResources.slice(1)}
        containerClassName="my-10 flex flex-col "
      />
    </>
  );
};
export default page;
