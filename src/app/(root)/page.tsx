import ImageUpload from "@/components/ImageUploadWrapper";
import ResourceList from "@/components/ResourceList";
import ResourceOverview from "@/components/ResourceOverview";
import { Button } from "@/components/ui/button";
import Rating from "../../components/Rating";
import db from "../../../database/drizzle";
import { resources } from "../../../database/schema";
import ColorPickerWrapper from "@/components/ColorPickerWrapper";
import { auth } from "../../../auth";
import { ResourceFull } from "@/lib/types";
import { desc } from "drizzle-orm";

function greetingForNow(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const LandingPage = async () => {
  const session = await auth();

  const latestResources = (await db
    .select()
    .from(resources)
    .limit(10)
    .orderBy(desc(resources.createdAt))) as ResourceFull[];

  // const result = await db.select().from(users);

  // console.log(JSON.stringify(result, null, 2));
  return (
    <div>
      {/* Personalized greeting (only shown if logged in) */}
      {session?.user ? (
        <div className="rounded-md border p-4">
          <p className="text-lg">
            {greetingForNow()},{" "}
            <span className="font-semibold">
              {session.user.name ?? session.user.email}
            </span>
            !
          </p>
          <p className="text-sm text-muted-foreground">
            Here’s what’s new since your last visit.
          </p>
        </div>
      ) : null}
      <ResourceOverview {...latestResources[0]} />
      <ResourceList
        title="Latest Resources"
        resources={latestResources.slice(1)}
        containerClassName="my-10 flex flex-col "
      />
      <Button>Click me</Button>

      {latestResources[0].title}
      <p className="font-thin">Default Poppins Light</p>
      <p className="font-extrabold">Default Poppins Extra Bold</p>
      <p className="font-bold italic">Default Poppins Bold Italic</p>
      <p className="font-serif-regular">Crimson Pro Serif Regular</p>
      <p className="font-serif-italic">Garamond Serif Italic</p>
      <p className="font-mono">Roboto Mono </p>
      <p className="font-condensed">Roboto Condensed</p>
      <p className="font-handwriting">Caveat Handwriting</p>
      <ImageUpload />
      <ColorPickerWrapper />
      <Rating />
    </div>
  );
};

export default LandingPage;
