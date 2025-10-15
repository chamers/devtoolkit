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
import { X } from "lucide-react";

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

const MAX_LOGOS = 5;
const MAX_DESCRIPTIONS = 5;

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
      descriptions: resource?.descriptions ?? [""],
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
  const {
    fields: logoFields,
    append: appendLogo,
    remove: removeLogo,
  } = useFieldArray({ control: form.control, name: "logoUrls" });

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

  // const onSubmit = async (values: FormOutput) => {
  //   console.log("Submitted:", values);
  //   console.log("Logo URL:", values.logoUrls);
  //   console.log("website URL:", values.websiteUrl);
  //   console.log("tags array:", values.tags);
  //   console.count("onSubmit called");
  //   const result = await createResource(values);
  //   if (result.success) {
  //     toast.success("Resource created successfully!");

  //     router.push(`/admin/resources/${result.data.id}`);
  //   } else {
  //     toast.error(
  //       `Error creating resource: ${result.error ?? "Unknown error"}`
  //     );
  //   }
  // };

  const onSubmit = async (values: FormOutput) => {
    const cleaned = {
      ...values,
      descriptions: values.descriptions.map((d) => d.trim()).filter(Boolean),
    };
    const result = await createResource(cleaned);
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

        {/* MULTIPLE DESCRIPTIONS */}
        <FormField
          control={form.control}
          name="descriptions"
          render={() => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Descriptions (up to {MAX_DESCRIPTIONS})</FormLabel>
              <div className="space-y-3">
                {descFields.map((field, idx) => (
                  <FormItem key={field.id}>
                    <FormControl>
                      <div className="flex items-start gap-2">
                        <Textarea
                          placeholder={`Description ${idx + 1}`}
                          rows={4}
                          {...form.register(`descriptions.${idx}` as const)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove description ${idx + 1}`}
                          onClick={() => removeDesc(idx)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    descFields.length < MAX_DESCRIPTIONS && appendDesc("")
                  }
                >
                  Add description
                </Button>
                <span className="text-xs text-muted-foreground">
                  {descFields.length}/{MAX_DESCRIPTIONS}
                </span>
              </div>
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

        {/* MULTIPLE IMAGES — as implemented previously */}
        <FormField
          control={form.control}
          name="logoUrls"
          render={() => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Resource Images</FormLabel>
              <div className="space-y-2">
                {logoFields.map((field, idx) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="url"
                        placeholder={`https://example.com/image-${idx + 1}.png`}
                        {...form.register(`logoUrls.${idx}` as const)}
                        className="h-10"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLogo(idx)}
                      aria-label={`Remove image ${idx + 1}`}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    logoFields.length < MAX_LOGOS && appendLogo("")
                  }
                >
                  Add URL
                </Button>
                <span className="text-xs text-muted-foreground">
                  {logoFields.length}/{MAX_LOGOS}
                </span>
              </div>
              <div className="mt-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Or upload images:
                </div>
                <ImageUpload
                  onUploaded={(url) => {
                    if (!url) return;
                    if (logoFields.length >= MAX_LOGOS)
                      return toast.error(`Max ${MAX_LOGOS} images`);
                    appendLogo(url);
                  }}
                />
              </div>
              {form.watch("logoUrls")?.length ? (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {form.watch("logoUrls").map((u, i) => (
                    <div key={`${u}-${i}`} className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={u}
                        alt={`Preview ${i + 1}`}
                        className="h-12 w-12 rounded border object-cover"
                      />
                      <Badge variant="secondary">{i + 1}</Badge>
                    </div>
                  ))}
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
