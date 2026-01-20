"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type SliderProps = {
  images: string[];
  descriptions?: string[];
  /** Optional frame size (square). Defaults to 250, grows to 400 on sm+ via classes. */
  sizePx?: number;
  /**
   * Optional rotations (in degrees) to apply to background images.
   * If provided, values are cycled across all images.
   * If omitted, a pleasant default pattern is used.
   */
  initialRotations?: number[];
};

export default function Slider({
  images,
  descriptions = [],
  sizePx = 250,
  initialRotations,
}: SliderProps) {
  // The index now corresponds directly to the sliced array content.
  const [index, setIndex] = useState(0);

  // Default repeating pattern for a casual photo-stack effect
  const basePattern = useMemo(() => [-16, 12, -8, 18, -20], []);

  // Pick the rotation source (from props or the base pattern)
  const rotationSource = useMemo(() => {
    return initialRotations && initialRotations.length > 0
      ? initialRotations
      : basePattern;
  }, [initialRotations, basePattern]);

  // Compute rotation per image, cycling the pattern if needed
  const rotations = useMemo(
    () => images.map((_, i) => rotationSource[i % rotationSource.length] ?? 0),
    [images, rotationSource]
  );

  const count = images.length;

  return (
    <div className="relative">
      <div className="flex gap-x-20 lg:items-start items-center lg:flex-row flex-col">
        {/* Image stack - Now always displayed if images exist */}
        {count > 0 && (
          <div
            className="relative w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] p-8"
            style={{ width: sizePx + 64, height: sizePx + 64 }}
          >
            {images.map((image, i) => {
              const isActive = i === index;
              const rotate = rotations[i];

              const zIndex = isActive ? 20 : 10 - Math.abs(i - index);

              return (
                <Image
                  key={i}
                  src={image}
                  alt={`Slide ${i + 1}`}
                  className={[
                    "absolute inset-8 w-full h-full object-cover rounded-3xl",
                    "pointer-events-none select-none",
                    "transition-all duration-500 ease-out",
                    isActive ? "opacity-100" : "opacity-40",
                  ].join(" ")}
                  fill
                  sizes="(max-width: 640px) 300px, 400px"
                  draggable={false}
                  style={{
                    zIndex: zIndex,
                    transform: isActive
                      ? "rotate(0deg) scale(1) translateY(0px)"
                      : `rotate(${rotate}deg) scale(1) translateY(4px)`,
                    transformOrigin: "50% 50%",
                    filter: isActive
                      ? "none"
                      : "brightness(0.9) saturate(0.95)",
                    boxShadow: isActive
                      ? "0 6px 20px rgba(0,0,0,.14)"
                      : "0 4px 14px rgba(0,0,0,.10)",
                    border: "1px solid rgba(0,0,0,.08)",
                  }}
                  priority={i === 0}
                />
              );
            })}
          </div>
        )}

        {/* Descriptions */}
        {descriptions.length > 0 && (
          <div
            className="
      relative
      sm:w-[400px] w-[320px]
      mt-6 lg:mt-0
      min-h-[5rem]
      px-4
      grid
      place-items-center
      text-center
    "
          >
            {descriptions.map((desc, i) => (
              <p
                key={i}
                className={`
          col-start-1 row-start-1
          text-neutral-700 dark:text-neutral-300
          transition-opacity duration-300
          leading-relaxed
          ${i === index ? "opacity-100 delay-200" : "opacity-0"}
        `}
              >
                {desc}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Controls - These still work correctly on the new `count` */}
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
