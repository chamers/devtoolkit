import { Resource } from "@/types";

const testResource: Resource = {
  id: "1",
  name: "React Docs",
  category: "frontend",
};

export default function LandingPage() {
  return <div>{testResource.name}</div>;
}
