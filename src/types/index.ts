// Define strict types for pricing and project type
export type PricingModel = "Free" | "Paid" | "Freemium" | "Open Source";
export type ProjectType = "Official" | "Community" | "Personal";
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
  | "AI/ML"
  | "Development";

  

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

