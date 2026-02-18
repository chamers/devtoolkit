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
      <div className="flex flex-col lg:flex-row h-screen">
        <div className="flex flex-col lg:w-0.5 p-4 lg:order-last lg:justify-center lg:items-center">
          Preview
        </div>
        <div className="flex flex-col lg:w-0.5 p-4 lg:order-first lg:justify-center lg:items-center">
          Form
        </div>
      </div>
    </>
  );
};
export default page;
