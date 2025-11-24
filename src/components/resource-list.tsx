import type { ResourceFull } from "@/lib/types";
import ResourceCardMini from "./resource-card-mini";

interface Props {
  title: string;
  resources?: ResourceFull[]; // allow undefined
  containerClassName?: string;
}

const ResourceList = ({ title, resources = [], containerClassName }: Props) => {
  if (resources.length === 0) return null; // nothing to render
  // if you really want at least 2, keep this:
  // if (resources.length < 2) return null;

  return (
    <section className={containerClassName}>
      <h2>{title}</h2>
      <ul className="mt-5 flex flex-wrap gap-5 max-[479px]:justify-between sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16 2xl:gap-20">
        {resources.map((resource) => (
          <ResourceCardMini key={resource.id} resource={resource} />
        ))}
      </ul>
    </section>
  );
};

export default ResourceList;
