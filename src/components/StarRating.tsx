import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";

type StarRatingProps = {
  rating: number;
  size?: number; // Optional size
  color?: string; // Optional color, e.g. "text-yellow-400"
};

export const StarRating = ({
  rating,
  size = 20,
  color = "text-yellow-400",
}: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <IoIosStar key={`full-${i}`} className={color} size={size} />
      ))}
      {hasHalfStar && <IoIosStarHalf className={color} size={size} />}
      {[...Array(emptyStars)].map((_, i) => (
        <IoIosStarOutline key={`empty-${i}`} className={color} size={size} />
      ))}
    </div>
  );
};
