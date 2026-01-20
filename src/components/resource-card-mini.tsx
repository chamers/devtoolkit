import Image from "next/image";
import Link from "next/link";

import { slugifyCategory } from "@/lib/utils";
import React from "react";
import { ResourceFull } from "@/lib/validation/resource.schema";

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
    isFeatured, // 👈 new
  } = resource;

  // PRIMARY IMAGE LOGIC
  // PRIMARY IMAGE LOGIC (logo only)
  const primaryImg =
    typeof logoUrl === "string" && logoUrl.trim().length > 0 ? logoUrl : null;

  // DESCRIPTION SNIPPET
  const snippet = descriptions[0] ?? "";

  // RATING TEXT
  const ratingNumber =
    typeof rating === "number" ? rating : Number(rating ?? 0);
  const ratingText = ratingNumber.toFixed(1);

  const categoryClass = slugifyCategory(category);

  // COMMENT COUNT (Prisma returns comments only if included)
  const commentCount = Array.isArray(comments) ? comments.length : 0;

  const baseClasses = `
    block p-4 rounded-2xl border transition group
    text-gray-900 dark:text-gray-100
    bg-${categoryClass}
    cat-${categoryClass}
  `;

  const variantClasses = isFeatured
    ? `
        border-amber-400/80
        ring-2 ring-amber-300/60 dark:ring-amber-500/70
        bt-${categoryClass}
        featured-card
      `
    : `
        border-slate-200/70 dark:border-slate-800/80
        shadow-sm hover:shadow-md
      `;

  return (
    <Link
      href={`/resources/${id}`}
      className={`${baseClasses} ${variantClasses}`}
    >
      {/* Header section with image + title + featured badge */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative w-12 h-12 rounded bg-white overflow-hidden border flex-shrink-0">
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

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-base font-semibold tracking-wide line-clamp-1 uppercase">
                {title}
              </h2>

              {/* Designer replaces "author" */}
              <p className="text-xs opacity-80 line-clamp-1">
                {designer ?? "Unknown creator"}
              </p>
            </div>

            {isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-200">
                <span aria-hidden>⭐</span>
                Featured
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Snippet */}
      {snippet && (
        <p
          className={`text-sm mb-3 ${
            isFeatured ? "line-clamp-3" : "line-clamp-2"
          }`}
        >
          {snippet}
        </p>
      )}

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

      {/* Footer row with rating, comments, mobile-friendly + CTA for featured */}
      <div className="flex items-center justify-between text-[11px] opacity-90">
        <div className="flex items-center gap-3">
          <span>⭐ {ratingText}</span>
          <span>💬 {commentCount}</span>
          {isMobileFriendly && (
            <span className="bg-black/10 px-2 py-0.5 rounded-full">
              📱 Mobile Friendly
            </span>
          )}
        </div>

        {isFeatured && (
          <span
            className="
              inline-flex items-center gap-1 rounded-full
              border border-amber-400/70
              bg-amber-100/90 dark:bg-amber-500/20
              px-2 py-1 text-[10px] font-semibold uppercase tracking-wider
              text-amber-900 dark:text-amber-100
              group-hover:translate-x-0.5 group-hover:-translate-y-0.5
              transition-transform
            "
          >
            View full resource
            <span aria-hidden>↗</span>
          </span>
        )}
      </div>
    </Link>
  );
};

export default ResourceCardMini;
