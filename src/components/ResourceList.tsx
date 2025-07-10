
import { Resource } from "@/types";
import ResourceCard from "./ResourceCard";


interface Props {
  title: string;
  resources: Resource[]; // Replace 'any' with the actual type of resources
  containerClassName?: string;
}
const ResourceList = ({title, resources, containerClassName }:Props) => {
  return (
    <section className={containerClassName}>
      <h2>{title}</h2>
      <ul className="mt-10 flex flex-wrap gap-5 max-[479px]:justify-between sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16 2xl:gap-20">
        {resources.map((resource) => (
          // <ResourceCard key={resource.id} {...resource} />
          <div key={resource.id}>hello</div>
        ))}
      </ul>
      <ResourceCard />
    </section>
  );
};
export default ResourceList;
