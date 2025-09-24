import { Button } from "@/components/ui/button"
import Link from "next/link";
import ResourceForm from "@/components/admin/forms/ResourceForm"

const page = () => {
  return (
    <><Button variant="link" size="xl" asChild>
            <Link href="/admin/resources">Go Back</Link>
        </Button>
        <section className="w-full max-w-full">
    <ResourceForm />
        </section>
        </>
       
  )
}
export default page