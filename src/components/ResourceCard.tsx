// import Link from "next/link"
// import ResourceImage from "./ResourceImage"
// import { cn } from "@/lib/utils"
// import { Button } from "./ui/button";
// import { SiBmcsoftware } from "react-icons/si";
// import { Resource } from "@/types";
// import { FaHeart } from "react-icons/fa";

// const ResourceCard = ({
//   id,
//   title,
//   description,
//   category,
//   logoUrl,
//   isFeatured = false,
// }: Resource) => {
//     const categoryClass = category.toLowerCase().replace(/[^a-z]/g, "");
//   return (
//     <li className={cn(`bg-${categoryClass} rounded-lg shadow-xl p-3`, isFeatured && "w-full sm:w-52")}>
//         <Link href={`/resources/${id}`} className={cn(isFeatured && "w-full flex flex-col")}>
//             <ResourceImage logoUrl={logoUrl} variant="small"/>
//              <div className={cn("mt-4", !isFeatured && "sm:max-w-40 max-w-28")}>
//                 <h3 className="line-clamp-1">{title}</h3>
//                 <p className="line-clamp-1 text-sm text-comet">{description}</p>
//                 <p className={`mt-1 line-clamp-1 text-sm font-bold text-${categoryClass} sm:text-base`}>
//                     {category}
//                 </p>
//             </div>
//             {isFeatured && (
//             <div className="mt-4 w-full">
//                 <div className="flex flex-row items-center gap-1 max-xs:justify-center"> 
//                     <FaHeart className={`text-${categoryClass} w-4 h-4`} /><p className="ml-1"> Featured Resource</p>
//                 </div>
//                 <Button className={`w-full mt-2 bt-${categoryClass} text-gray-50 dark:text-gray-200`}>
//                     <SiBmcsoftware className="size-4" />
//                     View Resource
//                 </Button>
//             </div>

//         )}
//         </Link>
//     </li>
//   );
// };

// export default ResourceCard;

// import Link from "next/link";
// import ResourceImage from "./ResourceImage";
// import { cn } from "@/lib/utils";
// import { Button } from "./ui/button";
// import { SiBmcsoftware } from "react-icons/si";
// import { FaHeart } from "react-icons/fa";
// import { Resource } from "@/types";

// const ResourceCard = ({
//   id,
//   title,
//   description,
//   category,
//   logoUrl,
//   isFeatured = false,
// }: Resource) => {
//   const categoryClass = category.toLowerCase().replace(/[^a-z]/g, "");

//   return (
//     <li
//       className={cn(
//         `bg-${categoryClass} rounded-lg shadow-xl p-3`,
//         isFeatured ? "w-full sm:w-52" : ""
//       )}
//     >
//       <Link
//         href={`/resources/${id}`}
//         className={cn(
//           "block",
//           isFeatured ? "w-full flex flex-col" : "w-full"
//         )}
//       >
//         {/* Image & Title Row */}
//         <div className={cn("flex items-start gap-3", isFeatured && "flex-row")}>
//           <ResourceImage logoUrl={logoUrl} variant="small" />
//           <div
//             className={cn("flex-1", !isFeatured && "sm:max-w-40 max-w-28")}
//           >
//             <h3 className="line-clamp-1 font-semibold">{title}</h3>
//             <p className="line-clamp-1 text-sm text-comet">{description}</p>
//             <p
//               className={`mt-1 line-clamp-1 text-sm font-bold text-${categoryClass} sm:text-base`}
//             >
//               {category}
//             </p>
//           </div>
//         </div>

//         {/* Featured Extras */}
//         {isFeatured && (
//           <div className="mt-4 w-full">
//             <div className="flex items-center gap-2 max-xs:justify-center">
//               <FaHeart className={`text-${categoryClass} w-4 h-4`} />
//               <p className="text-sm font-medium">Featured Resource</p>
//             </div>
//             <Button
//               className={`w-full mt-2 bt-${categoryClass} text-gray-50 dark:text-gray-200`}
//             >
//               <SiBmcsoftware className="size-4 mr-1" />
//               View Resource
//             </Button>
//           </div>
//         )}
//       </Link>
//     </li>
//   );
// };

// export default ResourceCard;

import Link from "next/link";
import ResourceImage from "./ResourceImage";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { SiBmcsoftware } from "react-icons/si";
import { FaHeart } from "react-icons/fa";
import { Resource } from "@/types";

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



