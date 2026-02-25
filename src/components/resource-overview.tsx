import Link from "next/link";
import Image from "next/image";
import { StarRating } from "./star-rating";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { SiBmcsoftware } from "react-icons/si";
import { FiTrendingUp, FiBookOpen, FiUser, FiTag } from "react-icons/fi";
import SliderWrapper from "./slider-wrapper";
import { slugifyCategory } from "@/lib/utils";
import { ResourceFull } from "@/lib/validation/resource.schema";

type Props = Pick<
  ResourceFull,
  | "id"
  | "title"
  | "descriptions"
  | "designer"
  | "category"
  | "rating"
  | "logoUrl"
  | "imgUrls"
  | "websiteUrl"
>;

export default function ResourceOverview(props: Props) {
  const {
    id,
    title,
    descriptions = [],
    designer,
    category,
    rating,
    logoUrl,
    imgUrls = [],
    websiteUrl,
  } = props;

  const primaryDescription = descriptions[0] ?? "";
  const categoryClass = slugifyCategory(category);
  const headerImage =
    typeof logoUrl === "string" && logoUrl.trim().length > 0 ? logoUrl : null;

  return (
    <Card
      className={`w-full overflow-hidden border-none shadow-2xl bg-${categoryClass}/10 backdrop-blur-md`}
    >
      {/* 1. Full Width Title & Tagline Section */}
      <CardHeader className="space-y-6 pb-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white border-none px-3 py-1 text-[10px] tracking-widest font-bold">
              FEATURED
            </Badge>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/5 dark:bg-slate-100/10 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-800">
              <FiTrendingUp className="text-amber-500 size-3" />
              Next Generation Design System
            </div>
          </div>

          <div className="flex items-center gap-5">
            {headerImage && (
              <div className="relative size-16 sm:size-20 rounded-2xl overflow-hidden border bg-white shadow-sm flex-shrink-0 p-2">
                <Image
                  src={headerImage}
                  alt={`${title} logo`}
                  fill
                  className="object-contain"
                  sizes="80px"
                  priority
                />
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400">
                {title}
              </span>
            </h1>
          </div>

          <p className="max-w-4xl text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {primaryDescription}
          </p>
        </div>
      </CardHeader>

      {/* 2. Full Width Slider Section */}
      <CardContent className="px-6 space-y-8">
        {imgUrls.length > 0 && (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 overflow-hidden">
            <SliderWrapper images={imgUrls} descriptions={descriptions} />
          </div>
        )}

        {/* 3. Author & Category Info Row */}
        <div className="flex flex-wrap items-center gap-4 py-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border shadow-sm">
            <FiUser className="text-indigo-500 size-4" />
            <span className="text-xs text-slate-500">By</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {designer ?? "Unknown creator"}
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border shadow-sm">
            <FiTag className="text-teal-500 size-4" />
            <span className="text-xs text-slate-500">Category</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {category}
            </span>
          </div>

          <div className="hidden sm:block flex-1">
            <Separator className="bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </CardContent>

      {/* 4. Rating & Action Buttons Row */}
      <CardFooter className="flex flex-col md:flex-row items-center justify-between gap-6 px-6 pb-10">
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 px-5 py-3 rounded-2xl border shadow-inner">
          <StarRating rating={rating} />
          <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
            {rating}{" "}
            <span className="text-sm text-slate-400 font-normal">/ 5</span>
          </span>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link href={`/resources/${id}`} className="flex-1 md:flex-none">
            <Button
              size="lg"
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl h-14 px-8 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-200 dark:shadow-none"
            >
              <SiBmcsoftware className="mr-2 size-5" />
              View resource
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="flex-1 md:flex-none rounded-xl h-14 px-8 text-base font-bold border-2 transition-all hover:bg-slate-50 dark:hover:bg-slate-900 hover:scale-[1.02] active:scale-[0.98]"
          >
            <a href={websiteUrl || "#"} target="_blank" rel="noreferrer">
              <FiBookOpen className="mr-2 size-5" />
              Documentation
            </a>
          </Button>
        </div>
      </CardFooter>

      {/* Social Trust Bar */}
      <div className="bg-slate-900/[0.03] dark:bg-slate-100/[0.03] py-4 px-6 flex items-center gap-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex -space-x-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative size-8 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-slate-200"
            >
              <Image
                src={`https://ik.imagekit.io/2yaqi8azs/randomuser-${i % 2 === 0 ? "woman" : "men"}${i}.jpg`}
                alt="user"
                fill
                className="object-cover"
              />
            </div>
          ))}
          <div className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center">
            +5K
          </div>
        </div>
        <p className="text-[11px] text-slate-500 font-medium">
          Trusted by{" "}
          <span className="text-slate-900 dark:text-slate-200 font-bold">
            5,000+
          </span>{" "}
          developers worldwide
        </p>
      </div>
    </Card>
  );
}
