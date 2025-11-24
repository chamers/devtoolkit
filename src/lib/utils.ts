import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(input: string): string {
  if (!input) return "?";

  // If it's an email, take the local-part (before @) and treat separators as spaces
  const base = input.includes("@")
    ? input.split("@")[0].replace(/[._-]+/g, " ")
    : input;

  const parts = base.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    const word = parts[0];
    // take first two letters for single word (e.g., "chris" -> "CH")
    return word.slice(0, 2).toUpperCase();
  }

  // take first letter of first two words (e.g., "chris hamers" -> "CH")
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function slugifyCategory(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // keep letters, numbers, spaces, and hyphens
    .trim()
    .replace(/\s+/g, "-"); // replace spaces with hyphens
}
