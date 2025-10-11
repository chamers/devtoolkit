import { ResourceFull } from "@/lib/types";
import ResourceCard from "./ResourceCard";

interface Props {
  title: string;
  resources: ResourceFull[]; // Replace 'any' with the actual type of resources
  containerClassName?: string;
}
const ResourceList = ({ title, resources, containerClassName }: Props) => {
  return (
    <section className={containerClassName}>
      <h2>{title}</h2>
      <ul className="mt-5 flex flex-wrap gap-5 max-[479px]:justify-between sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16 2xl:gap-20">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} {...resource} />
        ))}
      </ul>
    </section>
  );
};
export default ResourceList;
