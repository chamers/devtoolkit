import { ResourceFull } from "@/lib/types";

import ResourceCardMini from "./ResourceCardMini";

interface Props {
  title: string;
  resources: ResourceFull[]; // Replace 'any' with the actual type of resources
  containerClassName?: string;
}
const ResourceList = ({ title, resources, containerClassName }: Props) => {
  if (resources.length < 2) return;
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
