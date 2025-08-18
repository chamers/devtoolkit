import ResourceList from "@/components/ResourceList";
import { Button } from "@/components/ui/button"
import { sampleResources } from "@/constants";
import { signOut } from "../../../../auth";

const page = () => {
  return (
    <>
    <form action={async () =>{
            "use server";
            await signOut();
        }} className="mb-10">
        <Button >
            Sign Out
        </Button>
        
    </form>
    <ResourceList title="Visited resources" resources={sampleResources}/>
  </>
)
}
export default page