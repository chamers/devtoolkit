// Define strict types for pricing and project type
export type PricingModel = "Free" | "Paid" | "Freemium";
export type ProjectType = "Official" | "Community";
export type Category =
  | "Design"
  | "UI/UX"
  | "Frontend"
  | "Backend"
  | "Fullstack"
  | "DevOps"
  | "APIs"
  | "JavaScript"
  | "TypeScript"
  | "CSS"
  | "HTML"
  | "Frameworks"
  | "Version Control"
  | "Productivity"
  | "Testing"
  | "Security"
  | "Accessibility"
  | "AI/ML";

  // Map categories to color names (matching your CSS variables)
export type CategoryColorMap = {
  [key in Category]: string;
};

// Use the actual CSS variable names here
export const CategoryColors: CategoryColorMap = {
  "Design": "var(--color-deep-cove)",
  "UI/UX": "var(--color-soft-amber)",
  "Frontend": "var(--color-tangaroa)",
  "Backend": "var(--color-deep-cove)",
  "Fullstack": "var(--color-tangaroa)",
  "DevOps": "var(--color-deep-cove)",
  "APIs": "var(--color-soft-amber)",
  "JavaScript": "var(--color-fuchsia-gem)",
  "TypeScript": "var(--color-deep-cove)",
  "CSS": "var(--color-soft-amber)",
  "HTML": "var(--color-fuchsia-gem)",
  "Frameworks": "var(--color-tangaroa)",
  "Version Control": "var(--color-deep-cove)",
  "Productivity": "var(--color-soft-amber)",
  "Testing": "var(--color-tangaroa)",
  "Security": "var(--color-deep-cove)",
  "Accessibility": "var(--color-soft-amber)",
  "AI/ML": "var(--color-fuchsia-gem)",
};

// Constrain rating to 0–5 (by using a branded type)
export type Rating = number & { __ratingBrand: never };

export interface ResourceComment { 
  user: string;
  comment: string;
  date: Date;
}

export interface Resource {
  id: number;
  title: string;
  author: string;
  category: Category;
  categoryColor: string; // Color for the category
  rating: Rating; 
  description: string;
  logoUrl: string;
  websiteUrl: string;
  createdAt: Date; 
  updatedAt: Date;
  tags: string[];
  pricing: PricingModel;
  projectType: ProjectType;
  comments: ResourceComment[]; // Array of comments
  isMobileFriendly: boolean; // Hex color code for the resource
  isFeatured: boolean; // Indicates if the resource is featured
}

