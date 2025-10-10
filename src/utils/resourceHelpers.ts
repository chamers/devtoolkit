import { Rating } from "@/lib/types";

// // -- Utility Function to get CSS variable class --
// export function getCategoryColorClass(category: Category): string {
//   return `var(--${CategoryColors[category]})`;
// }

// -- Rating Validation Helper --
export function toRating(value: number): Rating {
  if (value < 0 || value > 5) throw new Error("Rating must be between 0 and 5");
  return value as Rating;
}
