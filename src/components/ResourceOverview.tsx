import { ResourceFull } from "../lib/types";
import Link from "next/link";
import { StarRating } from "./StarRating";
import { Button } from "./ui/button";
import { SiBmcsoftware } from "react-icons/si";
import { FiTrendingUp, FiBookOpen } from "react-icons/fi";
// import ResourceImage from "./ResourceImage";
import Image from "next/image";
import SliderWrapper from "./SliderWrapper";
import { slugifyCategory } from "@/lib/utils";

type Props = Pick<
  ResourceFull,
  | "id"
  | "title"
  | "descriptions"
  | "author"
  | "category"
  | "rating"
  | "logoUrls"
  | "websiteUrl"
>;

export default function ResourceOverview(props: Props) {
  const {
    id,
    title,
    descriptions = [],
    author,
    category,
    rating,
    logoUrls = [],
    websiteUrl,
  } = props;

  const primaryDescription = descriptions[0] ?? "";
  const categoryClass = slugifyCategory(category);

  return (
    <section
      className={`
        flex flex-1 flex-col items-start gap-6
        md:flex-row md:items-center md:justify-between
       bg-${categoryClass}
        p-6 rounded-lg shadow-xl
      `}
    >
      {/* Text content column */}
      <div className="flex flex-col gap-3">
        <div className="container mx-auto px-6 py-2 md:py-5 lg:py-10 xl:py-15">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16">
            <div className="flex-1 space-y-6 lg:space-y-7">
              <div className="space-y-4 lg:space-y-5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-900 text-amber-400">
                    FEATURED
                  </span>
                  <h2 className="flex items-center gap-1 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-neutral-900 text-amber-400 font-medium text-sm backdrop-blu-sm border border-neutral-800/50">
                    <FiTrendingUp />
                    Next Generation Design System
                  </h2>
                </div>
                <h1>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-sys-light-prim via-amber-400 to-amber-600">
                    {title}
                  </span>
                </h1>
                <p className="font-handwriting text-neutral-700 dark:text-dark-foreground-60 sm:text-xl md:text-2xl lg:text-3xl">
                  {primaryDescription}
                </p>

                <div className="flex gap-3 items-center">
                  <div className="h-px bg-neutral-300 dark:bg-neutral-700 w-12"></div>
                  <p className="font-extralight">
                    By:{" "}
                    <span className="font-semibold text-teal-dark">
                      {author}
                    </span>
                  </p>
                  <p className="font-extralight">
                    Category:{" "}
                    <span className="font-semibold text-teal-dark">
                      {category}
                    </span>
                  </p>
                  <div className="h-px bg-neutral-300 dark:bg-neutral-700 w-12"></div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={rating} />
                  <span>({rating}/5)</span>
                </div>
              </div>

              {/* <div className="flex flex-wrap gap-3 lg:gap-4">
                <Button className="flex items-center transition group">
                  <SiBmcsoftware className="group-hover:rotate-12 transition-transform duration-300" />
                  <span>View Resource</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center transition group"
                >
                  <Link href={`/resources/${id}/card`}>
                    <Button className="flex items-center">
                      <SiBmcsoftware className="mr-2" />
                      View resource
                    </Button>
                  </Link>
                  <FiBookOpen className="group-hover:rotate-12 transition-transform duration-300 text-neutral-600 dark:text-neutral-400" />
                  <span className="font-mono tracking-widest text-neutral-600 dark:text-neutral-400">
                    documentation
                  </span>
                </Button>
              </div> */}

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href={`/resources/${id}`}>
                  <Button className="flex items-center">
                    <SiBmcsoftware className="mr-2" />
                    View resource
                  </Button>
                </Link>

                <Button variant="outline" asChild className="flex items-center">
                  <a
                    href={websiteUrl ? `${websiteUrl}` : "#"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FiBookOpen className="mr-2" />
                    documentation
                  </a>
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 sm:items-center pt-6 lg:pt-7 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex -space-x-3">
                  <Image
                    src="https://ik.imagekit.io/2yaqi8azs/randomuser-men1.jpg?updatedAt=1761480139450"
                    alt="User Avatar"
                    width={36}
                    height={36}
                    className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-neutral-200 dark:border-neutral-900 object-cover"
                  />
                  <Image
                    src="https://ik.imagekit.io/2yaqi8azs/randomuser-woman1.jpg?updatedAt=1761480139492"
                    alt="User Avatar"
                    width={36}
                    height={36}
                    className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-neutral-200 dark:border-neutral-900 object-cover"
                  />
                  <Image
                    src="https://ik.imagekit.io/2yaqi8azs/randomuser-men2.jpg?updatedAt=1761480139494"
                    alt="User Avatar"
                    width={36}
                    height={36}
                    className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-neutral-200 dark:border-neutral-900 object-cover"
                  />
                  <span className="flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-neutral-200 dark:border-neutral-900 object-cover text-xs font-medium bg-orange-sys-light-prim dark:bg-pink-sys-dark-prim text-white dark:text-neutral-900">
                    +5K
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Trusted by{" "}
                    <span className="font-semibold text-neutral-900 dark:text-neutral-300">
                      5,000+
                    </span>{" "}
                    developers worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image column */}
      {logoUrls.length > 0 && (
        <div className="hidden md:flex md:flex-col md:flex-1 md:justify-start relative rounded-2xl shadow-2xl dark:shadow-[-20px_0_30px_-10px_rgba(255,165,0,0.4)] border border-neutral-200 dark:border-neutral-800 p-4 lg:p-5 xl:p-6">
          <SliderWrapper
            images={logoUrls.slice(0, 5)}
            descriptions={descriptions.slice(0, 5)}
          />
        </div>
      )}
    </section>
  );
}
