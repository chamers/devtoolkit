"use client";
import { descriptions, images } from "@/constants";
import Image from "next/image";
import { useMemo, useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";


const getRandomNumber = () => Math.floor(Math.random() * 41) - 20; // -20..20

const Slider = () => {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  // Generate a stable random rotation for each image once
  const rotationsRef = useRef<number[]>(
    images.map(() => getRandomNumber())
  );

useEffect(() => {
    // Runs only on the client, after hydration
    rotationsRef.current = images.map(() => getRandomNumber());
    setMounted(true);
  }, []);

  return (
    <div className="relative">
      {/* Slider */}
      <div className="flex gap-x-20 lg:items-start items-center lg:flex-row flex-col">
        {/* Images */}
        <div className="sm:w-[400px] sm:h-[400px] w-[300px] h-[300px] relative">
          {images.map((image, i) => (
            <Image
              key={i}
              src={image}
              alt={`Slide ${i}`}
              className={`w-full h-full absolute object-cover rounded-3xl transition-all duration-300 ${
                i === index ? "opacity-100 z-10" : "opacity-50 -z-10"
              }`}
              fill
              style={{
                transform: `rotate(${
                  i === index ? 0 : rotationsRef.current[i]
                }deg)`,
              }}
            />
          ))}
        </div>

        {/* Descriptions */}
        <div className="relative sm:w-[400px] w-[320px] mt-22 lg:mt-5">
          {descriptions.map((desc, i) => (
            <p
              key={i}
              className={`text-center sm:text-xl text-gray-600 absolute transition-all duration-300 ${
                i === index ? "opacity-100 delay-200" : "opacity-0"
              }`}
            >
              {desc}
            </p>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 lg:-bottom-5 left-1/2 -translate-x-1/2 flex gap-x-4">
        <button
          className="bg-gray-100/40 p-1.5 rounded-full text-gray-600 hover:bg-gray-200/50 transition-colors"
          onClick={() =>
            setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
          }
          aria-label="Previous slide"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          className="bg-gray-100/40 p-1.5 rounded-full text-gray-600 hover:bg-gray-200/50 transition-colors"
          onClick={() =>
            setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
          }
          aria-label="Next slide"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Slider;
