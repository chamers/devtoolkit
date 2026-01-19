import ResourceForm from "@/components/admin/forms/resource-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <>
      <Button variant="link" size="xl" asChild>
        <Link href="/admin/resources">Go Back</Link>
      </Button>
      <section className="w-full max-w-full">
        <ResourceForm />
      </section>
    </>
  );
};
export default page;
