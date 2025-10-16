"use client";
import { LogoUrl } from "@/lib/types";
import { cn } from "@/lib/utils";
// import Image from "next/image";
import { Image } from "@imagekit/next";
import config from "@/lib/config";

type ResourceImageVariant =
  | "extraSmall"
  | "small"
  | "medium"
  | "regular"
  | "wide";

const variantStyles: Record<ResourceImageVariant, string> = {
  extraSmall: "resource-image_extra_small",
  small: "resource-image_small",
  medium: "resource-image_medium",
  regular: "resource-image_regular",
  wide: "resource-image_wide",
};

interface Props {
  className?: string;
  variant?: ResourceImageVariant;
  logoUrl: LogoUrl;
}
const ResourceImage = ({
  className,
  variant = "regular",
  logoUrl = "https://placehold.co/400x600.png",
}: Props) => {
  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant],
        className
      )}
    >
      <div
        className="absolute z-10"
        style={{ left: "12%", width: "87.5%", height: "88%" }}
      >
        {/* <Image
          src={logoUrl}
          alt="Resource Image"
          fill
          className="rounded-sm object-fill"
        /> */}

        {/* <IKImage
          path={logoUrl}
          urlEndpoint={config.env.imagekit.urlEndpoint}
          alt="Resource Image"
          fill
          className="rounded-sm object-fill"
          loading="lazy"
          lqip={{ active: true }}
        />
        <Image
      urlEndpoint="https://ik.imagekit.io/your_imagekit_id" // New prop
      src="/profile.png"
      width={500}
      height={500}
      alt="Picture of the author"
    /> */}
        <Image
          // ✅ This is the ImageKit Next.js component
          src={logoUrl} // can be relative or absolute
          urlEndpoint={config.env.imagekit.urlEndpoint}
          alt="Resource Image"
          fill // uses next/image-style layout
          className="rounded-sm object-cover"
          loading="lazy"
          transformation={[{ width: 400, height: 400 }]} // optional
        />
      </div>
    </div>
  );
};
export default ResourceImage;
