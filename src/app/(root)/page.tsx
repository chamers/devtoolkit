import ImageUpload from "@/components/ImageUploadWrapper";
import ResourceList from "@/components/ResourceList";
import ResourceOverview from "@/components/ResourceOverview";
import { Button } from "@/components/ui/button";
import { sampleResources } from "@/constants";
import Rating from "../../components/Rating";
import db from "../../../database/drizzle";
import { users } from "../../../database/schema";
import ColorPickerWrapper from "@/components/ColorPickerWrapper";

const LandingPage = async () => {
  const result = await db.select().from(users);
  console.log(JSON.stringify(result, null, 2));
  return (
    <div>
      <ResourceOverview {...sampleResources[0]} />
      <ResourceList
        title="Latest Resources"
        resources={sampleResources}
        containerClassName="my-10 flex flex-col "
      />
      <Button>Click me</Button>

      {sampleResources[0].title}
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
