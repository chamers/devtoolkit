"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler} from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  resourceCreateSchema, // <- export this alongside resourceSchema from your validations
  pricingModelSchema,
  projectTypeSchema,
  categorySchema, 
} from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ImageUploadWrapper";
import { createResource } from "@/lib/admin/actions/resource"; // <- ensure path matches your provided action file
import { toast } from "sonner";
import { useMemo } from "react";
import useMounted from "@/hooks/useMounted";

// If you want local TS types inferred from your Zod schemas:
type ResourceCreateInput = z.infer<typeof resourceCreateSchema>;

interface Props {
  type?: "create" | "update";
  // If you support editing existing resources later, you can pass defaults in here.
  defaultValues?: Partial<ResourceCreateInput>;
}

const ResourceForm = ({ type = "create", defaultValues = {} }: Props) => {
  const router = useRouter();
  const mounted = useMounted();
  // Always call hooks
  const categoryOptions = useMemo(
    () => (categorySchema.options as readonly string[]).map(v => ({ label: v, value: v })),
    []
  );
  const pricingOptions = useMemo(
    () => (pricingModelSchema.options as readonly string[]).map(v => ({ label: v, value: v })),
    []
  );
  const projectTypeOptions = useMemo(
    () => (projectTypeSchema.options as readonly string[]).map(v => ({ label: v, value: v })),
    []
  );

const onSubmit: SubmitHandler<ResourceCreateInput> = async (values) => {
    try {
      const result = await createResource(values);
      if (result?.success) {
        toast.success("Resource created successfully");
        router.push("/");
      } else {
        toast.error(result?.message ?? "An error occurred.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

 const safeDefaults: Partial<z.infer<typeof resourceCreateSchema>> = {
  ...defaultValues,
};

const form = useForm<z.infer<typeof resourceCreateSchema>>({
  resolver: zodResolver(resourceCreateSchema),
  defaultValues: {
    title: "",
    description: "",
    author: "",
    category: "Design",
    rating: 0,
    logoUrl: "",
    websiteUrl: "",
    tags: [],
    pricing: "Free",
    isMobileFriendly: false,
    projectType: "Community",
    isFeatured: false,
    ...safeDefaults,
  },
  mode: "onBlur",
});


  // Conditionally render JSX, not the whole component
  if (!mounted) return null;

  // Small helper: allow a comma-separated tags input
  const tagsToString = (tags: string[]) => tags.join(", ");
  const stringToTags = (s: string) =>
    s
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* TITLE */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Resource Title
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="e.g., Figma"
                  {...field}
                  className="min-h-14 border border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* AUTHOR */}
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Author / Publisher
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="e.g., Figma Inc."
                  {...field}
                  className="min-h-14 border border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CATEGORY (enum) */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Category
              </FormLabel>
              <FormControl>
                <select
                  className="min-h-14 rounded-md border border-gray-100 bg-light-600 p-4 text-base"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* RATING 0..5 */}
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Rating (0–5)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={5}
                  step="1"
                  placeholder="0 - 5"
                  value={field.value ?? 0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="min-h-14 border border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* LOGO (uploaded URL) */}
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Resource Logo
              </FormLabel>
              <FormControl>
                {/* Our ImageUpload exposes onUploaded(url) and can also show the current image */}
                <ImageUpload
                  // The dynamic wrapper exports the component; it accepts onUploaded
                  onUploaded={(url: string | null) => field.onChange(url ?? "")}
                />
              </FormControl>
              {field.value ? (
                <p className="text-sm text-muted-foreground break-all">
                  Current logo URL: {field.value}
                </p>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DESCRIPTION */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Short description of the resource"
                  {...field}
                  rows={8}
                  className="min-h-14 border border-gray-100 bg-light-600 p-4 text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* WEBSITE URL (proper URL input, not a video upload) */}
        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Website URL
              </FormLabel>
              <FormControl>
                <Input
                  type="url"
                  required
                  placeholder="https://example.com"
                  {...field}
                  className="min-h-14 border border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TAGS (comma separated -> array) */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Tags (comma separated)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Design, Collaboration, UI/UX"
                  value={tagsToString(field.value || [])}
                  onChange={(e) => field.onChange(stringToTags(e.target.value))}
                  className="min-h-14 border border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PRICING (enum) */}
        <FormField
          control={form.control}
          name="pricing"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Pricing Model
              </FormLabel>
              <FormControl>
                <select
                  className="min-h-14 rounded-md border border-gray-100 bg-light-600 p-4 text-base"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {pricingOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PROJECT TYPE (enum) */}
        <FormField
          control={form.control}
          name="projectType"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="text-base font-normal text-dark-500">
                Project Type
              </FormLabel>
              <FormControl>
                <select
                  className="min-h-14 rounded-md border border-gray-100 bg-light-600 p-4 text-base"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {projectTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* IS MOBILE FRIENDLY */}
        <FormField
          control={form.control}
          name="isMobileFriendly"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <input
                  type="checkbox"
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4"
                />
              </FormControl>
              <FormLabel className="text-base font-normal text-dark-500">
                Mobile-friendly
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* IS FEATURED */}
        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <input
                  type="checkbox"
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4"
                />
              </FormControl>
              <FormLabel className="text-base font-normal text-dark-500">
                Featured
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit" className="w-2/3 md:w-1/3"
        >
          {type === "create" ? "Add Resource to Library" : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default ResourceForm;
