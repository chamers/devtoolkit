import ResourceForm from "@/components/admin/forms/resource-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen">
      <Button variant="link" size="xl" asChild>
        <Link href="/admin/resources">Go Back</Link>
      </Button>

      {/* Mobile: column (Preview then Form). Desktop: row (Form then Preview) */}
      <section className="flex flex-col lg:flex-row gap-6 p-4">
        {/* Preview */}
        <aside className="order-1 lg:order-2 w-full lg:w-1/2 rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-2">Preview</h2>
          <div className="text-sm text-muted-foreground">
            {/* Put your live preview component here */}
            Preview content…
          </div>
        </aside>

        {/* Form */}
        <main className="order-2 lg:order-1 w-full lg:w-1/2 rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-2">Form</h2>
          <ResourceForm />
        </main>
      </section>
    </div>
  );
}
