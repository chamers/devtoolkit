"use client";
import { descriptions, images } from "@/constants";
import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Slider({
  initialRotations,
}: {
  initialRotations: number[];
}) {
  const [index, setIndex] = useState(0);
  const rotationsRef = useRef<number[]>(initialRotations); // stable, matches SSR

  return (
    <div className="relative isolation-isolate">
      {/* Slider */}
      <div className="flex gap-x-20 lg:items-start items-center lg:flex-row flex-col">
        {/* Images */}
        <div className=" w-[250px] h-[250px] relative overflow-visible">
          {images.map((image, i) => (
            <Image
              key={i}
              src={image}
              alt={`Slide ${i}`}
              className={`w-full h-full absolute object-cover rounded-3xl transition-all duration-300 pointer-events-none ${
                i === index ? "opacity-100 z-10" : "opacity-50 -z-0"
              }`}
              fill
              style={{
                transform: `rotate(${
                  i === index ? 0 : rotationsRef.current[i]
                }deg)`,
                willChange: "transform, opacity",
              }}
              priority={i === index}
            />
          ))}
        </div>

        {/* Descriptions */}
        <div className="relative sm:w-[400px] w-[320px] mt-22 lg:mt-5">
          {descriptions.map((desc, i) => (
            <p
              key={i}
              className={`text-center text-gray-600 absolute transition-all duration-300 ${
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
  // return (
  //   <div className="relative">
  //     {/* Slider */}
  //     <div className="flex gap-x-20 lg:items-start items-center lg:flex-row flex-col">
  //       {/* Images */}
  //       <div className=" w-[250px] h-[250px] relative">
  //         {images.map((image, i) => (
  //           <Image
  //             key={i}
  //             src={image}
  //             alt={`Slide ${i}`}
  //             className={`w-full h-full absolute object-cover rounded-3xl transition-all duration-300 ${
  //               i === index ? "opacity-100 z-10" : "opacity-50 -z-10"
  //             }`}
  //             fill
  //             style={{
  //               transform: `rotate(${
  //                 i === index ? 0 : rotationsRef.current[i]
  //               }deg)`,
  //             }}
  //           />
  //         ))}
  //       </div>

  //       {/* Descriptions */}
  //       <div className="relative sm:w-[400px] w-[320px] mt-22 lg:mt-5">
  //         {descriptions.map((desc, i) => (
  //           <p
  //             key={i}
  //             className={`text-center text-gray-600 absolute transition-all duration-300 ${
  //               i === index ? "opacity-100 delay-200" : "opacity-0"
  //             }`}
  //           >
  //             {desc}
  //           </p>
  //         ))}
  //       </div>
  //     </div>

  //     {/* Controls */}
  //     <div className="absolute bottom-0 lg:-bottom-5 left-1/2 -translate-x-1/2 flex gap-x-4">
  //       <button
  //         className="bg-gray-100/40 p-1.5 rounded-full text-gray-600 hover:bg-gray-200/50 transition-colors"
  //         onClick={() =>
  //           setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  //         }
  //         aria-label="Previous slide"
  //       >
  //         <ArrowLeft size={18} />
  //       </button>
  //       <button
  //         className="bg-gray-100/40 p-1.5 rounded-full text-gray-600 hover:bg-gray-200/50 transition-colors"
  //         onClick={() =>
  //           setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  //         }
  //         aria-label="Next slide"
  //       >
  //         <ArrowRight size={18} />
  //       </button>
  //     </div>
  //   </div>
  // );
}
