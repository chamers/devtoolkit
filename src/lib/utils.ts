import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export function slugifyCategory(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // keep letters, numbers, spaces, and hyphens
    .trim()
    .replace(/\s+/g, "-"); // replace spaces with hyphens
}
