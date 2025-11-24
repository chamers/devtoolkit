import Image from "next/image";
import Link from "next/link";
import { ResourceFull } from "@/lib/types";
import { slugifyCategory } from "@/lib/utils";
import React from "react";

interface Props {
  resource: ResourceFull;
}

const ResourceCardMini: React.FC<Props> = ({ resource }) => {
  const {
    id,
    title,
    designer,
    category,
    rating,
    descriptions = [],
    imgUrls = [],
    logoUrl,
    tags = [],
    isMobileFriendly,
    comments = [],
  } = resource;

  // PRIMARY IMAGE LOGIC
  const primaryImg =
    (typeof logoUrl === "string" && logoUrl.trim().length > 0
      ? logoUrl
      : imgUrls.find((u) => typeof u === "string" && u.trim().length > 0)) ??
    null;

  // DESCRIPTION SNIPPET
  const snippet = descriptions[0] ?? "";

  // RATING TEXT
  const ratingNumber =
    typeof rating === "number" ? rating : Number(rating ?? 0);
  const ratingText = ratingNumber.toFixed(1);

  const categoryClass = slugifyCategory(category);

  // COMMENT COUNT (Prisma returns comments only if included)
  const commentCount = Array.isArray(comments) ? comments.length : 0;

  return (
    <Link
      href={`/resources/${id}`}
      className={`
        block p-4 rounded-2xl shadow-md transition hover:shadow-lg border
        bg-${categoryClass}
        text-gray-900 dark:text-gray-100
      `}
    >
      {/* Header section with image + title */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-12 h-12 rounded bg-white overflow-hidden border">
          {primaryImg ? (
            <Image
              src={primaryImg}
              alt={`${title} logo`}
              fill
              className="object-contain p-1"
              sizes="48px"
              priority={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs opacity-60">
              no image
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-wide line-clamp-1 uppercase">
            {title}
          </h2>

          {/* Designer replaces "author" */}
          <p className="text-xs opacity-80 line-clamp-1">
            {designer ?? "Unknown creator"}
          </p>
        </div>
      </div>

      {/* Snippet */}
      {snippet && <p className="text-sm mb-3 line-clamp-2">{snippet}</p>}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-black/10 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer row with rating, comments, mobile-friendly */}
      <div className="flex items-center justify-between text-xs opacity-90">
        <span>⭐ {ratingText}</span>
        <span>💬 {commentCount}</span>
        {isMobileFriendly && (
          <span className="bg-black/10 px-2 py-0.5 rounded-full">
            📱 Mobile Friendly
          </span>
        )}
      </div>
    </Link>
  );
};

export default ResourceCardMini;
