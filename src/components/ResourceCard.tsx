import Link from "next/link"
import ResourceImage from "./ResourceImage"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button";
import { SiBmcsoftware } from "react-icons/si";
import { Resource } from "@/types";
import { FaHeart } from "react-icons/fa";

const ResourceCard = ({
  id,
  title,
  description,
  category,
  logoUrl,
  isFeatured = false,
}: Resource) => {
    const categoryClass = category.toLowerCase().replace(/[^a-z]/g, "");
  return (
    <li className={cn(`bg-${categoryClass} rounded-lg shadow-xl p-3`, isFeatured && "w-full sm:w-52")}>
        <Link href={`/resources/${id}`} className={cn(isFeatured && "w-full flex flex-col")}>
            <ResourceImage logoUrl={logoUrl} variant="small"/>
             <div className={cn("mt-4", !isFeatured && "sm:max-w-40 max-w-28")}>
                <h3 className="line-clamp-1">{title}</h3>
                <p className="line-clamp-1 text-sm text-comet">{description}</p>
                <p className={`mt-1 line-clamp-1 text-sm font-bold text-${categoryClass} sm:text-base`}>
                    {category}
                </p>
            </div>
            {isFeatured && (
            <div className="mt-4 w-full">
                <div className="flex flex-row items-center gap-1 max-xs:justify-center"> 
                    <FaHeart className={`text-${categoryClass} w-4 h-4`} /><p className="ml-1"> Featured Resource</p>
                </div>
                <Button className={`w-full mt-2 bt-${categoryClass} text-gray-50 dark:text-gray-200`}>
                    <SiBmcsoftware className="size-4" />
                    View Resource
                </Button>
            </div>

        )}
        </Link>
    </li>
  );
};

export default ResourceCard;

