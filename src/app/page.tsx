import { Button } from "@/components/ui/button";
import { Resource } from "@/types";

const testResource: Resource = {
  id: "1",
  name: "React Docs",
  category: "frontend",
};

export default function LandingPage() {
  return <>
  <Button>Click me</Button>
  {testResource.name}</>;
}
