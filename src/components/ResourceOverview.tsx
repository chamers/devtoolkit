
import { Resource } from "../types"


export default function ResourceOverview(props: Resource) {
  const { title, description, author, category, rating, logoUrl, categoryColor } = props;
const categoryClass = category.toLowerCase().replace(/[^a-z]/g, "");
  return (
   <section className={`
        flex flex-1 flex-col items-start gap-6
        md:flex-row md:items-center md:justify-between
        bg-${categoryClass}                     /* This will now work for background! */
        p-6 rounded-lg shadow-md               /* Example styling */
      `}  >
        {/* Text content column */}
        <div className="flex flex-col gap-4">
            <h1>{title}</h1>
            <p>{description}</p>

        </div>
    </section>
  );
}

