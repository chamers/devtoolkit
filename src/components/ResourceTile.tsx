"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { categoryStyles } from "@/lib/categoryStyles";
import type { ResourceFull } from "@/lib/types";

export default function ResourceTile({
  id,
  title,
  descriptions = [],
  mainCategory,
  category,
  subcategory,
  logoUrls = [],
  author,
}: Pick<
  ResourceFull,
  | "id"
  | "title"
  | "descriptions"
  | "mainCategory"
  | "category"
  | "subcategory"
  | "logoUrls"
  | "author"
>) {
  const logoUrl = logoUrls[0] ?? "/no-image.png"; // fallback local image

  return (
    <li
      className={cn(
        "rounded-lg shadow p-3 w-full sm:w-64 bg-white dark:bg-neutral-900 transition hover:shadow-md",
        categoryStyles.bg(category)
      )}
    >
      <Link href={`/resources/${id}`} className="block space-y-2">
        {/* Image and title row */}
        <div className="flex items-start gap-3">
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src={logoUrl}
              alt={`${title} logo`}
              fill
              className="rounded-md object-contain border bg-white p-1 dark:bg-neutral-800"
              sizes="48px"
            />
          </div>
          <div className="flex-1">
            <h3 className="line-clamp-1 font-semibold text-neutral-900 dark:text-neutral-100">
              {title}
            </h3>

            {/* Category hierarchy (breadcrumb style) */}
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                {mainCategory}
              </span>
              {category && (
                <>
                  {" "}
                  ›{" "}
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    {category}
                  </span>
                </>
              )}
              {subcategory && (
                <>
                  {" "}
                  ›{" "}
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {subcategory}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-sm text-neutral-700 dark:text-neutral-300 mt-2">
          {descriptions[0] ?? ""}
        </p>

        {/* Author */}
        <p className="mt-1 text-xs opacity-70">By {author}</p>
      </Link>
    </li>
  );
}
