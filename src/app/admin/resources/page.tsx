import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2>All Resources</h2>
        <Button asChild>
          <Link href="/admin/resources/new">Create a New Resource</Link>
        </Button>
      </div>
      <div className="mt-7 w-full overflow-hidden">
        <p>Table</p>
      </div>
    </section>
  );
};
export default page;
