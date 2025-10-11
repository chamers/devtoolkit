import { LogoUrl } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
        <Image
          src={logoUrl}
          alt="Resource Image"
          fill
          className="rounded-sm object-fill"
        />
      </div>
    </div>
  );
};
export default ResourceImage;
