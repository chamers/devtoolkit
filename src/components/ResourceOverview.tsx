
import { Resource } from "../types"
import { StarRating } from "./StarRating";
import { Button } from "./ui/button";
import { SiBmcsoftware } from "react-icons/si";
import ResourceImage from "./ResourceImage";


export default function ResourceOverview(props: Resource) {
  const { title, description, author, category, rating, logoUrl} = props;
const categoryClass = category.toLowerCase().replace(/[^a-z]/g, "");
  return (
   <section className={`
        flex flex-1 flex-col items-start gap-6
        md:flex-row md:items-center md:justify-between
        bg-${categoryClass}                     
        p-6 rounded-lg shadow-xl               
      `}  >
        {/* Text content column */}
        <div className="flex flex-col gap-3">
            <h1>{title}</h1>
            <p className="font-handwriting dark:text-dark-foreground-60 sm:text-xl md:text-2xl lg:text-3xl">{description}</p>
            <div className="flex flex-row flex-wrap gap-4">
               <p className="font-extralight">By: <span className="font-semibold text-teal-dark">{author}</span></p>
                <p className="font-extralight">Category: <span className="font-semibold text-teal-dark">{category}</span></p>
                <div className="flex items-center gap-2">
                  <StarRating rating={rating} />
                  <p className="text-sm text-foreground">({rating})</p>
                </div>
            </div>
            <Button>
              <SiBmcsoftware />
              View Resource
            </Button>
        </div>

        {/* Image column */}
      <div className="relative flex justify-center md:justify-start md:flex-1">
        <div className="relative">
          <ResourceImage
            variant="regular"
            className="z-10"
            logoUrl={logoUrl}
          />
          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            <ResourceImage variant="regular" logoUrl={logoUrl} />
          </div>
        </div>
       <div>Hello World</div>
      </div>
    </section>
  );
}

