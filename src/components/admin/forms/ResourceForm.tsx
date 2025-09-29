"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useMounted from "@/hooks/useMounted";
import type { Resource } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { resourceCreateSchema, categorySchema } from "@/lib/validations";
import ImageUpload from "@/components/ImageUploadWrapper"; // dynamic wrapper (ssr: false)
import { Badge } from "@/components/ui/badge";

interface Props extends Partial<Resource> {
  type?: "create" | "edit";
}

const ResourceForm = ({ type, ...resource }: Props) => {
  const mounted = useMounted(); // ✅ Prevent hydration mismatch

  // const router = useRouter();

  const CATEGORIES = categorySchema.options;

  type FormInput = z.input<typeof resourceCreateSchema>; // before coercion (rating: unknown)
  type FormOutput = z.output<typeof resourceCreateSchema>;

  const form = useForm<FormInput, undefined, FormOutput>({
    resolver: zodResolver(resourceCreateSchema),
    defaultValues: {
      title: resource?.title ?? "",
      author: resource?.author ?? "",
      category: resource?.category ?? CATEGORIES[0],
      rating: typeof resource?.rating === "number" ? resource.rating : 0,
      description: resource?.description ?? "",
      logoUrl: resource?.logoUrl ?? "",
      websiteUrl: resource?.websiteUrl ?? "",
    },
  });

  // Optional: preview state derived from form
  const logoUrlValue = form.watch("logoUrl");

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof resourceCreateSchema>) => {
    console.log("Submitted:", values);
    console.log("Logo URL:", values.logoUrl);
    console.log("website URL:", values.websiteUrl);
    console.count("onSubmit called");
  };

  // 3. Use useMounted to prevent hydration mismatch
  //    This is important for client-side only components.
  if (!mounted) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* title input */}
        <FormField
          control={form.control}
          name={"title"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="capitalize">Resource Title</FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="e.g. Figma"
                  {...field}
                  className="min-h-14 border border-gray-100 bg-light-600 p-4 text-base placeholder:font-normal placeholder:text-slate-500 !important"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* author input */}
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="capitalize">Resource Author</FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="e.g. Figma Inc."
                  {...field}
                  className="min-h-14 border border-gray-100 bg-light-600 p-4 text-base placeholder:font-normal placeholder:text-slate-500 !important"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* category input*/}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="capitalize">Category</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* rating input */}
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="capitalize">Rating (0–5)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={5}
                  step={0.5}
                  value={field.value as number | ""} // ← narrow the type right here
                  onChange={(e) =>
                    field.onChange(
                      e.currentTarget.value === ""
                        ? ""
                        : e.currentTarget.valueAsNumber
                    )
                  }
                  placeholder="e.g. 4.5"
                  className="h-10"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* description input */}
        <FormField
          control={form.control}
          name={"description"}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="Capitalize">Resource Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Resource description"
                  {...field}
                  rows={10}
                  className="book-form_input"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* logoUrl: paste a URL OR upload */}
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="capitalize">Logo URL</FormLabel>

              {/* Option A: paste an external URL or an absolute /path */}
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com/logo.png or /images/logo.png"
                  value={field.value ?? ""} // keep controlled
                  onChange={(e) => field.onChange(e.target.value)}
                  className="h-10"
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Paste a public URL, a data/blob URI, or an absolute path
                starting with <code>/</code>.
              </p>

              {/* Option B: upload to ImageKit */}
              <div className="mt-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Or upload an image:
                </div>
                <ImageUpload
                  onUploaded={(url) => {
                    form.setValue("logoUrl", url ?? "", {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                />
              </div>

              {/* Tiny live preview if we have a URL */}
              {logoUrlValue ? (
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="secondary">Preview</Badge>
                  {/* Use next/image if you prefer; using plain img to avoid extra config here */}
                  {/* If you use next/image, ensure your next.config images.domains includes your ImageKit domain */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrlValue}
                    alt="Logo preview"
                    className="h-10 w-auto rounded border"
                    onError={() => {
                      // Optional: clear invalid URL on error
                      // form.setValue("logoUrl", "", { shouldDirty: true, shouldValidate: true });
                    }}
                  />
                </div>
              ) : null}

              <FormMessage />
            </FormItem>
          )}
        />
        {/* websiteUrl input */}
        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="capitalize">Website URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  {...field}
                  className="h-10"
                  required // remove if schema is optional and you want optional behavior
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          // onClick={() => console.log("Current title:", form.getValues("title"))}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
export default ResourceForm;
