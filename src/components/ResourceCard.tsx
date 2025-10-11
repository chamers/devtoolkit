import Link from "next/link";
import ResourceImage from "./ResourceImage";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { SiBmcsoftware } from "react-icons/si";
import { FaHeart } from "react-icons/fa";
import { ResourceFull } from "@/lib/types";

const ResourceCard = ({
  id,
  title,
  description,
  category,
  logoUrl,
  isFeatured = false,
}: ResourceFull) => {
  const categoryClass = category.toLowerCase().replace(/[^a-z]/g, "");

  return (
    <li
      className={cn(
        `bg-${categoryClass} rounded-lg shadow-xl p-3`,
        "w-full sm:w-64" // consistent width for all cards
      )}
    >
      <Link href={`/resources/${id}`} className="block w-full">
        {/* Image + Title/Category row */}
        <div className="flex items-start gap-3">
          <ResourceImage logoUrl={logoUrl} variant="small" />
          <div className="flex flex-col">
            <h3 className="line-clamp-1 font-semibold">{title}</h3>
            <p
              className={`line-clamp-1 text-sm font-bold text-${categoryClass} sm:text-base`}
            >
              {category}
            </p>
          </div>
        </div>

        {/* Description below */}
        <p className="mt-2 line-clamp-2 text-sm text-comet">{description}</p>

        {/* Featured only block */}
        {isFeatured && (
          <div className="mt-4 w-full">
            <div className="flex items-center gap-2 max-xs:justify-center">
              <FaHeart className={`text-${categoryClass} w-4 h-4`} />
              <p className="text-sm font-medium">Featured Resource</p>
            </div>
            <Button
              className={`w-full mt-2 bt-${categoryClass} text-gray-50 dark:text-gray-200`}
            >
              <SiBmcsoftware className="size-4 mr-1" />
              View Resource
            </Button>
          </div>
        )}
      </Link>
    </li>
  );
};

export default ResourceCard;
