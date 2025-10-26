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
        {/* Image stack */}
        <div
          // 🛑 FIX 1: Removed `overflow-hidden` so rotated corners can stick out.
          // Added relative padding to ensure the rotated images have space.
          className="relative w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] p-8"
          style={{ width: sizePx + 64, height: sizePx + 64 }} // Add padding to size
        >
          {count > 0 &&
            images.map((image, i) => {
              const isActive = i === index;
              const rotate = rotations[i];

              // 🛑 FIX 2: Calculate Z-index based on distance from active index
              // Ensures all non-active images are under the active one (z-index: 20)
              // and maintain a stacking order among themselves.
              const zIndex = isActive ? 20 : 10 - Math.abs(i - index);

              return (
                <Image
                  key={i}
                  src={image}
                  alt={`Slide ${i + 1}`}
                  className={[
                    // Images are absolutely positioned over the active one's space
                    // We use `inset-8` to account for the parent's `p-8`
                    "absolute inset-8 w-full h-full object-cover rounded-3xl",
                    "pointer-events-none select-none",
                    "transition-all duration-500 ease-out", // Use transition-all for smooth movement and fade
                    isActive ? "opacity-100" : "opacity-40", // 🛑 FIX 3: Fading effect for non-active images
                  ].join(" ")}
                  fill
                  sizes="(max-width: 640px) 300px, 400px"
                  draggable={false}
                  style={{
                    zIndex: zIndex,
                    // 🛑 FIX 4: Apply rotation and translate (for stacking effect)
                    // Active image is centered and not rotated.
                    // Non-active images are rotated and slightly pushed back/down.
                    transform: isActive
                      ? "rotate(0deg) scale(1) translateY(0px)"
                      : `rotate(${rotate}deg) scale(1) translateY(4px)`, // Added translateY(4px) for subtle depth
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
        {/* ... Descriptions and Controls remain the same ... */}

        {/* Descriptions (index-aligned, optional) */}
        {descriptions.length > 0 && (
          <div className="relative sm:w-[400px] w-[320px] mt-6 lg:mt-5 min-h-[3rem]">
            {descriptions.map((desc, i) => (
              <p
                key={i}
                className={`text-center text-neutral-700 dark:text-neutral-300 absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  i === index ? "opacity-100 delay-200" : "opacity-0"
                }`}
              >
                {desc}
              </p>
            ))}
          </div>
        )}
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
