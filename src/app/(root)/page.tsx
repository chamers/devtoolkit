
import ResourceList from "@/components/ResourceList";
import ResourceOverview from "@/components/ResourceOverview";
import ThemeSwitch from "@/components/ThemeSwitch";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { sampleResources } from "@/constants";



export default function LandingPage() {
  return <>
 <ResourceOverview {...sampleResources[0]} />
 {/* <ResourceList 
  title="Last Resources"
  resources={sampleResources}
  containerClassName="mt-28"
 /> */}
  <Button>Click me</Button>
  <ThemeSwitch />
    <ThemeToggle />
  {sampleResources[0].title}
   <p className="font-thin">Default Poppins Light</p>
    <p className="font-extrabold">Default Poppins Extra Bold</p>
    <p className="font-bold italic">Default Poppins Bold Italic</p>
    <p className="font-serif-regular">Crimson Pro Serif Regular</p>
    <p className="font-serif-italic">Garamond Serif Italic</p>
    <p className="font-mono">Roboto Mono </p>
    <p className="font-condensed">Roboto Condensed</p>
    <p className="font-handwriting">Caveat Handwriting</p>
  </>;
  
}
