import Link from "next/link"
import ResourceImage from "./ResourceImage"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Button } from "./ui/button";
import { SiBmcsoftware } from "react-icons/si";
import { Resource } from "@/types";

// const ResourceCard = ({
//   id,
//   title,
//   description,
//   category,
//   logoUrl,
//   isFeatured = false,
// }: Resource) => {
//   return (
//     <li className={cn(isFeatured && "sm:w-52 w-full")}>
//       <Link
//         href={`/resources/${id}`}
//         className={cn(isFeatured && "w-full flex flex-col items-center")}
//       >
//         <ResourceImage logoUrl={logoUrl} variant={isFeatured ? "regular" : "small"} />
//         <div className={cn("mt-4", !isFeatured && "sm:max-w-40 max-w-28")}>
//           <h3 className="line-clamp-1 text-base">{title}</h3>
//           <p className="line-clamp-1 text-sm text-gray-500">{description}</p>
//           <p className="mt-1 line-clamp-1 text-sm font-bold text-orange-500 sm:text-base">
//             {category}
//           </p>
//         </div>
//         {isFeatured && (
//           <div className="mt-3 w-full"><div className="flex flex-row items-center gap-1 max-xs:justify-center"> 
//           <Image src="/icons/heart.svg" alt="calendar" width={18} height={18} className="object-contain"></Image><p>Featured Resource</p></div><Button>
//           <SiBmcsoftware className="size-4" />
//           <p className="font-bebas-neue text-xl">View Resource</p>
//         </Button></div>
          
//         )}
//       </Link>
//     </li>
//   );
// };

// export default ResourceCard;

const ResourceCard = () => {
  return (
    <div>ResourceCard</div>
  )
}
export default ResourceCard

