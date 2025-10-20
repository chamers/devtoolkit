"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { categoryStyles } from "@/lib/categoryStyles";
import type { ResourceFull } from "@/lib/types";

export default function ResourceTile({
  id,
  title,
  descriptions = [],
  category,
  logoUrls = [],
  author,
}: Pick<
  ResourceFull,
  "id" | "title" | "descriptions" | "category" | "logoUrls" | "author"
>) {
  return (
    <li
      className={cn(
        "rounded-lg shadow p-3 w-full sm:w-64",
        categoryStyles.bg(category)
      )}
    >
      <Link href={`/resources/${id}`} className="block">
        <div className="flex items-start gap-3">
          {logoUrls[0] ? (
            <img
              src={logoUrls[0]}
              alt={`${title} logo`}
              className="w-12 h-12 rounded-md object-cover border"
            />
          ) : (
            <div className="w-12 h-12 rounded-md border" />
          )}
          <div className="flex-1">
            <h3 className="line-clamp-1 font-semibold">{title}</h3>
            <p
              className={cn("text-sm font-bold", categoryStyles.text(category))}
            >
              {category}
            </p>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-300">
          {descriptions[0] ?? ""}
        </p>
        <p className="mt-1 text-xs opacity-70">By {author}</p>
      </Link>
    </li>
  );
}
