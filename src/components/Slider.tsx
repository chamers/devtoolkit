"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  images: string[];
  descriptions?: string[];
  sizePx?: number; // optional: frame size (square). Defaults to 250, grows to 400 on sm+ via classes below
};

export default function Slider({
  images,
  descriptions = [],
  sizePx = 250,
}: Props) {
  const [index, setIndex] = useState(0);

  const count = images.length;
  if (!count) return null;

  // A pleasant repeating pattern that looks like a casual photo stack.
  // This automatically covers any number of images by repeating.
  const basePattern = useMemo(() => [-16, 12, -8, 18, -20], []);
  const rotations = useMemo(
    () => images.map((_, i) => basePattern[i % basePattern.length]),
    [images, basePattern]
  );

  return (
    <div className="relative">
      <div className="flex gap-x-20 lg:items-start items-center lg:flex-row flex-col">
        {/* Image stack */}
        <div
          className="relative overflow-hidden rounded-3xl w-[250px] h-[250px] sm:w-[400px] sm:h-[400px]"
          style={{ width: sizePx, height: sizePx }}
        >
          {images.map((image, i) => {
            const isActive = i === index;
            const rotate = isActive ? 0 : rotations[i];

            return (
              <Image
                key={i}
                src={image}
                alt={`Slide ${i + 1}`}
                className={[
                  "absolute inset-0 w-full h-full object-cover",
                  // keep others visible so corners can peek
                  isActive ? "z-20 opacity-100" : "z-10 opacity-60",
                  "pointer-events-none select-none",
                  "transition-transform duration-300 ease-out",
                ].join(" ")}
                fill
                sizes="(max-width: 640px) 300px, 400px"
                draggable={false}
                style={{
                  // Active slightly smaller so background corners peek
                  // Background a touch larger + rotated
                  transform: isActive
                    ? "scale(0.96) rotate(0deg)"
                    : `scale(1.02) rotate(${rotate}deg)`,
                  transformOrigin: "50% 50%",
                  // gentle de-emphasis for non-active
                  filter: isActive ? "none" : "brightness(0.9) saturate(0.95)",
                  // subtle edge definition so peeking corners read nicely
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
