"use client";
import Link from "next/link";
import ResourceImage from "./ResourceImage";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { SiBmcsoftware } from "react-icons/si";
import { FaHeart } from "react-icons/fa";
import { ResourceFull } from "@/lib/types";
import { categoryStyles } from "@/lib/categoryStyles";

type Props = ResourceFull & {
  isAdmin?: boolean;
};

const ResourceCard = ({
  id,
  title,
  descriptions = [],
  author,
  category,
  rating,
  logoUrls = [],
  websiteUrl,
  tags = [],
  pricing,
  projectType,
  isMobileFriendly,
  isFeatured,
  createdAt,
  updatedAt,
  isAdmin = false,
}: Props) => {
  const categoryClass = category.toLowerCase().replace(/[^a-z]/g, "");

  return (
    // <li
    //   className={cn(
    //     `bg-${categoryClass} rounded-lg shadow-xl p-3`,
    //     "w-full sm:w-64" // consistent width for all cards
    //   )}
    // >
    //   <Link href={`/resources/${id}`} className="block w-full">
    //     {/* Image + Title/Category row */}
    //     <div className="flex items-start gap-3">
    //       <ResourceImage logoUrl={logoUrl} variant="small" />
    //       <div className="flex flex-col">
    //         <h3 className="line-clamp-1 font-semibold">{title}</h3>
    //         <p
    //           className={`line-clamp-1 text-sm font-bold text-${categoryClass} sm:text-base`}
    //         >
    //           {category}
    //         </p>
    //       </div>
    //     </div>

    //     {/* Description below */}
    //     <p className="mt-2 line-clamp-2 text-sm text-comet">{description}</p>

    //     {/* Featured only block */}
    //     {isFeatured && (
    //       <div className="mt-4 w-full">
    //         <div className="flex items-center gap-2 max-xs:justify-center">
    //           <FaHeart className={`text-${categoryClass} w-4 h-4`} />
    //           <p className="text-sm font-medium">Featured Resource</p>
    //         </div>
    //         <Button
    //           className={`w-full mt-2 bt-${categoryClass} text-gray-50 dark:text-gray-200`}
    //         >
    //           <SiBmcsoftware className="size-4 mr-1" />
    //           View Resource
    //         </Button>
    //       </div>
    //     )}
    //   </Link>
    // </li>
    <article className="space-y-6">
      {/* Header */}
      <header
        className={[
          "p-6 rounded-lg shadow-xl border",
          categoryStyles.bg(category),
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
          {isFeatured && (
            <span className="px-2 py-1 rounded-full text-xs font-semibold border">
              Featured
            </span>
          )}
        </div>
        <p className="mt-2 text-neutral-700 dark:text-neutral-300">
          {descriptions[0]}
        </p>
        <div className="mt-3 text-sm flex flex-wrap items-center gap-3">
          <span>
            Author: <b>{author}</b>
          </span>
          <span>•</span>
          <span className={categoryStyles.text(category)}>{category}</span>
          <span>•</span>
          <span>Rating: {rating}/5</span>
          <span>•</span>
          <span>Created: {new Date(createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>Updated: {new Date(updatedAt).toLocaleDateString()}</span>
        </div>
        <div className="mt-4 flex gap-3">
          {websiteUrl && (
            <Button asChild>
              <a href={websiteUrl} target="_blank" rel="noreferrer">
                Open site
              </a>
            </Button>
          )}
          {isAdmin && (
            <Button variant="secondary" asChild>
              <Link href={`/resources/${id}/edit`}>Edit</Link>
            </Button>
          )}
        </div>
      </header>

      {/* Meta grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="rounded-md border p-3">
          <div className="text-xs opacity-70">Pricing</div>
          <div className="font-medium">{pricing}</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs opacity-70">Project type</div>
          <div className="font-medium">{projectType}</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs opacity-70">Mobile-friendly</div>
          <div className="font-medium">{isMobileFriendly ? "Yes" : "No"}</div>
        </div>
        {tags?.length ? (
          <div className="col-span-full rounded-md border p-3">
            <div className="text-xs opacity-70 mb-1">Tags</div>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-full text-xs border bg-white/60 dark:bg-white/5"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* Gallery (simple) */}
      {logoUrls.length > 0 && (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {logoUrls.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt={`${title} image ${i + 1}`}
              className="w-full h-32 object-cover rounded-lg border"
              loading="lazy"
            />
          ))}
        </section>
      )}

      {/* Full descriptions */}
      {descriptions.length > 1 && (
        <section className="space-y-3">
          {descriptions.slice(1).map((d, i) => (
            <p key={i} className="text-neutral-700 dark:text-neutral-300">
              {d}
            </p>
          ))}
        </section>
      )}
    </article>
  );
};

export default ResourceCard;
