"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import useMounted from "@/hooks/useMounted";
import type { ResourceFull } from "@/lib/types";

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
  CATEGORY_OPTIONS,
  PRICING_OPTIONS,
  PROJECT_TYPE_OPTIONS,
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

interface Props extends Partial<ResourceFull> {
  type?: "create" | "edit";
}

const ResourceForm = ({ type, ...resource }: Props) => {
  const mounted = useMounted();
  const router = useRouter();

  type FormInput = z.input<typeof resourceCreateSchema>; // before coercion
  type FormOutput = z.output<typeof resourceCreateSchema>; // after coercion

  const form = useForm<FormInput, undefined, FormOutput>({
    resolver: zodResolver(resourceCreateSchema),
    defaultValues: {
      title: resource?.title ?? "",
      author: resource?.author ?? "",
      category: resource?.category ?? CATEGORY_OPTIONS[0],
      rating: typeof resource?.rating === "number" ? resource.rating : 0,
      description: resource?.description ?? "",
      logoUrls: resource?.logoUrls ?? [],
      websiteUrl: resource?.websiteUrl ?? "",
      tags: resource?.tags ?? [], // canonical array (schema field)
      pricing: resource?.pricing ?? PRICING_OPTIONS[0],
      projectType: resource?.projectType ?? PROJECT_TYPE_OPTIONS[0],
      isMobileFriendly: resource?.isMobileFriendly ?? false,
      isFeatured: resource?.isFeatured ?? false,
    },
  });

  // Preview for logo
  // const logoUrlValue = form.watch("logoUrl");
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "logoUrls",
  });
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
    console.log("Logo URL:", values.logoUrls);
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
                    {CATEGORY_OPTIONS.map((c) => (
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
                      {PRICING_OPTIONS.map((c) => (
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
                      {PROJECT_TYPE_OPTIONS.map((c) => (
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

        {/* MULTI LOGO URLS */}
        <div className="space-y-3">
          <FormLabel className="capitalize">
            Resource Images (up to 5)
          </FormLabel>

          {/* Existing items */}
          {fields.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No images added yet.
            </p>
          )}

          <div className="grid gap-3">
            {fields.map((field, idx) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`logoUrls.${idx}`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <Input
                          type="url"
                          placeholder="https://... or /images/foo.png"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="h-10"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => remove(idx)}
                        >
                          Remove
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          {/* Upload/Add controls */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => append("")}
              disabled={fields.length >= 5}
            >
              Add URL field
            </Button>

            <ImageUpload
              onUploaded={(url) => {
                if (!url) return;
                if ((form.getValues("logoUrls")?.length ?? 0) >= 5) return;
                append(url);
              }}
            />
            <p className="text-xs text-muted-foreground">Maximum 5 images.</p>
          </div>

          {/* Preview */}
          {form.watch("logoUrls")?.length ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {form.watch("logoUrls").map((u, i) => (
                <div
                  key={u + i}
                  className="flex items-center gap-2 border rounded p-1"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={u}
                    alt={`preview-${i}`}
                    className="h-10 w-10 object-cover rounded"
                  />
                  <Badge variant="secondary">#{i + 1}</Badge>
                </div>
              ))}
            </div>
          ) : null}
        </div>

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
