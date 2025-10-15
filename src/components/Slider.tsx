"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Slider({
  initialRotations,
  images,
  descriptions = [],
}: {
  initialRotations: number[];
  images: string[];
  descriptions?: string[];
}) {
  const [index, setIndex] = useState(0);

  // Keep rotations stable and aligned to the images length
  const rotationsRef = useRef<number[]>(
    initialRotations.length === images.length
      ? initialRotations
      : images.map((_, i) => initialRotations[i] ?? 0)
  );

  const count = images.length;
  if (!count) return null;

  return (
    <div className="relative">
      <div className="flex gap-x-20 lg:items-start items-center lg:flex-row flex-col">
        {/* Image stack */}
        <div className="w-[250px] h-[250px] relative overflow-hidden rounded-3xl">
          {images.map((image, i) => {
            const isActive = i === index;
            const rotate = isActive ? 0 : rotationsRef.current[i] ?? 0;

            return (
              <Image
                key={i}
                src={image}
                alt={`Slide ${i + 1}`}
                className={[
                  "absolute inset-0 w-full h-full object-cover",
                  // Keep all images visible (so corners can peek)
                  // De-emphasize non-active ones a touch
                  isActive ? "z-20" : "z-10",
                  "pointer-events-none select-none",
                  "transition-transform duration-300 ease-out",
                ].join(" ")}
                fill
                sizes="(min-width: 1024px) 250px, 250px"
                draggable={false}
                style={{
                  // Active image slightly smaller so the rotated ones' corners can peek out
                  // Background ones slightly larger + rotated
                  transform: isActive
                    ? "scale(0.96) rotate(0deg)"
                    : `scale(1.02) rotate(${rotate}deg)`,
                  transformOrigin: "50% 50%",
                  // Gently dim background images without hiding corners
                  filter: isActive ? "none" : "brightness(0.9) saturate(0.95)",
                }}
                priority={i === 0}
              />
            );
          })}
        </div>

        {/* Descriptions (index-aligned, optional) */}
        {descriptions.length ? (
          <div className="relative sm:w-[400px] w-[320px] mt-6 lg:mt-5 min-h-[3rem]">
            {descriptions.map((desc, i) => (
              <p
                key={i}
                className={`text-center text-neutral-600 dark:text-neutral-400 absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  i === index ? "opacity-100 delay-200" : "opacity-0"
                }`}
              >
                {desc}
              </p>
            ))}
          </div>
        ) : null}
      </div>

      {/* Controls */}
      {count > 1 && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-x-4">
          <button
            className="bg-neutral-100/70 dark:bg-neutral-800/60 p-1.5 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/70 transition-colors"
            onClick={() =>
              setIndex((prev) => (prev === 0 ? count - 1 : prev - 1))
            }
            aria-label="Previous slide"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            className="bg-neutral-100/70 dark:bg-neutral-800/60 p-1.5 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/70 transition-colors"
            onClick={() =>
              setIndex((prev) => (prev === count - 1 ? 0 : prev + 1))
            }
            aria-label="Next slide"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
