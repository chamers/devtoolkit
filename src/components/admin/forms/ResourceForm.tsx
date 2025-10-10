"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useMounted from "@/hooks/useMounted";
import type { Resource } from "@/lib/types";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  resourceCreateSchema,
  categorySchema,
  pricingModelSchema,
  projectTypeSchema,
} from "@/lib/validations";
import ImageUpload from "@/components/ImageUploadWrapper";
import { Badge } from "@/components/ui/badge";
import { createResource } from "@/lib/admin/actions/resource";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/* -----------------------------
   Tags helper (module scope)
------------------------------*/
function parseTags(input: string): string[] {
  if (!input) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input.split(",")) {
    const t = raw.trim();
    if (!t) continue;
    const key = t.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(t); // keep original case
    }
    if (out.length >= 50) break; // cap
  }
  return out;
}

interface Props extends Partial<Resource> {
  type?: "create" | "edit";
}

const ResourceForm = ({ type, ...resource }: Props) => {
  const mounted = useMounted();
  const router = useRouter();
  const CATEGORIES = categorySchema.options;
  const PRICING = pricingModelSchema.options;
  const PROJECT_TYPES = projectTypeSchema.options;

  type FormInput = z.input<typeof resourceCreateSchema>; // before coercion
  type FormOutput = z.output<typeof resourceCreateSchema>; // after coercion

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
      tags: resource?.tags ?? [], // canonical array (schema field)
      pricing: resource?.pricing ?? PRICING[0],
      projectType: resource?.projectType ?? PROJECT_TYPES[0],
      isMobileFriendly: resource?.isMobileFriendly ?? false,
      isFeatured: resource?.isFeatured ?? false,
    },
  });

  // Preview for logo
  const logoUrlValue = form.watch("logoUrl");

  // Local UI state for comma-separated tags
  const [tagsText, setTagsText] = React.useState<string>(
    (resource?.tags ?? []).join(", ")
  );

  // Keep RHF "tags" (string[]) in sync with the local string
  React.useEffect(() => {
    form.setValue("tags", parseTags(tagsText), {
      shouldDirty: true,
      shouldValidate: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsText]);

  const onSubmit = async (values: FormOutput) => {
    console.log("Submitted:", values);
    console.log("Logo URL:", values.logoUrl);
    console.log("website URL:", values.websiteUrl);
    console.log("tags array:", values.tags);
    console.count("onSubmit called");
    const result = await createResource(values);
    if (result.success) {
      toast.success("Resource created successfully!");

      router.push(`/admin/resources/${result.data.id}`);
    } else {
      toast.error(
        `Error creating resource: ${result.error ?? "Unknown error"}`
      );
    }
  };

  if (!mounted) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* title input */}
        <FormField
          control={form.control}
          name="title"
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

        {/* category input */}
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
                  value={field.value as number | ""} // keep controlled
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
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="capitalize">Resource Description</FormLabel>
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

        {/* tags (comma-separated -> string[]) */}
        <FormItem className="flex flex-col gap-1">
          <FormLabel className="capitalize">Tags</FormLabel>
          <FormControl>
            <Input
              placeholder="react, hooks, patterns"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className="h-10"
            />
          </FormControl>
          <p className="text-xs text-muted-foreground">
            Separate with commas. Max 50. Tags must be unique
            (case-insensitive).
          </p>

          {/* Tiny preview of parsed tags */}
          {form.watch("tags")?.length ? (
            <div className="flex flex-wrap gap-1 pt-1">
              {form.watch("tags").map((t) => (
                <span key={t} className="rounded border px-2 py-0.5 text-xs">
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          <FormMessage />
        </FormItem>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* pricing model input */}
          <FormField
            control={form.control}
            name="pricing"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="capitalize">Pricing Model</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a pricing model" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICING.map((c) => (
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

          {/* project type input */}
          <FormField
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="capitalize">Project Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_TYPES.map((c) => (
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
        </div>

        {/* mobile friendly + featured checkboxes */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="isMobileFriendly"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Mobile Friendly</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Mark this if the resource is optimized for mobile use.
                  </p>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Highlight this resource as featured.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>

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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrlValue}
                    alt="Logo preview"
                    className="h-10 w-auto rounded border"
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
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{type === "edit" ? "Update" : "Submit"}</Button>
      </form>
    </Form>
  );
};

export default ResourceForm;
