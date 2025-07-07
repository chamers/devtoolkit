import ThemeSwitch from "@/components/ThemeSwitch";
import ThemeToggle from "@/components/ThemeToggle";
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
  <ThemeSwitch />
    <ThemeToggle />
  {testResource.name}</>;
}
