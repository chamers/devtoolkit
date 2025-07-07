export type Category = "frontend" | "backend";
export interface Resource {
  id: string;
  name: string;
  category: Category;
}
