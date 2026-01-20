"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import useMounted from "@/hooks/useMounted";
import type { ResourceFull } from "@/lib/types";
import { updateResourceAction } from "@/actions/update-resource.action";

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
  MAIN_CATEGORIES,
  CATEGORY_OPTIONS_BY_MAIN,
  SUBCATEGORY_OPTIONS_BY_MAIN_AND_CAT,
  type Main,
} from "@/lib/taxonomy";

import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import {
  PRICING_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  resourceCreateSchema,
} from "@/lib/validation/resource.schema";

import ImageUpload from "@/components/image-upload-wrapper";
import { createResource } from "@/actions/create-resource.action";

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
  resourceId?: string; // ✅ for edit
  redirectTo?: "admin" | "public";
}

type UploadedPayload = string | string[];

const MAX_IMAGES = 5;
const MAX_DESCRIPTIONS = 5;

const ResourceForm = ({
  type = "create",
  redirectTo = "admin",
  resourceId,
  ...resource
}: Props) => {
  const mounted = useMounted();
  const router = useRouter();

  type FormInput = z.input<typeof resourceCreateSchema>; // before coercion
  type FormOutput = z.output<typeof resourceCreateSchema>; // after coercion

  // Compute safe defaults for cascading selects
  const defaultMain: Main =
    (resource?.mainCategory as Main) ?? (MAIN_CATEGORIES[0] as Main);

  const defaultCats = CATEGORY_OPTIONS_BY_MAIN[defaultMain] ?? [];
  const defaultCat =
    resource?.category && defaultCats.includes(resource.category)
      ? resource.category
      : (defaultCats[0] ?? "");

  const defaultSubs = (SUBCATEGORY_OPTIONS_BY_MAIN_AND_CAT[defaultMain]?.[
    defaultCat
  ] ?? []) as readonly string[] | undefined;

  const defaultSub =
    resource?.subCategory && defaultSubs?.includes(resource.subCategory)
      ? resource.subCategory
      : (defaultSubs?.[0] ?? "");

  const form = useForm<FormInput, undefined, FormOutput>({
    resolver: zodResolver(resourceCreateSchema),
    defaultValues: {
      title: resource?.title ?? "",
      designer: resource?.designer ?? "",

      // ✅ REQUIRED by Prisma/Zod
      tagLine: resource?.tagLine ?? "",

      mainCategory: defaultMain,
      category: defaultCat ?? "",
      subCategory: defaultSub ?? "",

      rating: typeof resource?.rating === "number" ? resource.rating : 0,

      descriptions: resource?.descriptions ?? [""],

      // ✅ renamed
      imgUrls: resource?.imgUrls ?? [],

      websiteUrl: resource?.websiteUrl ?? "",

      tags: resource?.tags ?? [],

      pricing: resource?.pricing ?? PRICING_OPTIONS[0],
      projectType: resource?.projectType ?? PROJECT_TYPE_OPTIONS[0],

      isMobileFriendly: resource?.isMobileFriendly ?? false,
      isFeatured: resource?.isFeatured ?? false,
    },
  });

  // Watch parent fields to drive cascading dropdowns
  const watchedMain = useWatch({
    control: form.control,
    name: "mainCategory",
  }) as Main;

  const watchedCat = useWatch({ control: form.control, name: "category" });

  // When main changes, reset category + subcategory to first valid values
  React.useEffect(() => {
    const cats = CATEGORY_OPTIONS_BY_MAIN[watchedMain] ?? [];
    const nextCat = cats[0] ?? "";

    form.setValue("category", nextCat, {
      shouldDirty: true,
      shouldValidate: true,
    });

    const subs = (SUBCATEGORY_OPTIONS_BY_MAIN_AND_CAT[watchedMain]?.[nextCat] ??
      []) as readonly string[] | undefined;

    const nextSub = subs?.[0] ?? "";

    form.setValue("subCategory", nextSub, {
      shouldDirty: true,
      shouldValidate: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedMain]);

  // When category changes, reset subcategory to first valid value
  React.useEffect(() => {
    const subs = (SUBCATEGORY_OPTIONS_BY_MAIN_AND_CAT[watchedMain]?.[
      watchedCat
    ] ?? []) as readonly string[] | undefined;

    const nextSub = subs?.[0] ?? "";

    form.setValue("subCategory", nextSub, {
      shouldDirty: true,
      shouldValidate: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedCat, watchedMain]);

  // Field arrays
  const {
    fields: imgFields,
    append: appendImg,
    remove: removeImg,
  } = useFieldArray<FormInput, "imgUrls">({
    control: form.control,
    name: "imgUrls",
  });
  const {
    fields: descFields,
    append: appendDesc,
    remove: removeDesc,
  } = useFieldArray<FormInput, "descriptions">({
    control: form.control,
    name: "descriptions",
  });

  // Local UI state for comma-separated tags
  const [tagsText, setTagsText] = React.useState<string>(
    (resource?.tags ?? []).join(", ")
  );

  React.useEffect(() => {
    form.setValue("tags", parseTags(tagsText), {
      shouldDirty: true,
      shouldValidate: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsText]);

  function appendImgUrls(urls: UploadedPayload) {
    const arr = Array.isArray(urls) ? urls : [urls];
    const remaining = MAX_IMAGES - form.getValues("imgUrls").length;

    if (remaining <= 0) {
      toast.error(`Max ${MAX_IMAGES} images`);
      return;
    }

    const toAdd = arr.slice(0, remaining).filter(Boolean);
    if (!toAdd.length) return;

    toAdd.forEach((u) => appendImg(u));

    if (arr.length > toAdd.length) {
      toast.error(
        `Only ${remaining} more image${remaining === 1 ? "" : "s"} allowed (max ${MAX_IMAGES}).`
      );
    }
  }

  const onSubmit = async (values: FormOutput) => {
    const cleaned: FormOutput = {
      ...values,
      title: values.title.trim(),
      tagLine: values.tagLine.trim(),
      designer: values.designer?.trim() ?? "",
      descriptions: values.descriptions.map((d) => d.trim()).filter(Boolean),
      imgUrls: values.imgUrls.map((u) => u.trim()).filter(Boolean),
      tags: values.tags.map((t) => t.trim()).filter(Boolean),
    };

    if (type === "edit") {
      if (!resource.id && !resourceId) {
        toast.error("Missing resource id for edit.");
        return;
      }
      const id = resourceId ?? resource.id!;
      const result = await updateResourceAction({
        resourceId: id,
        input: cleaned,
      });

      if (result.ok) {
        toast.success("Resource updated successfully!");
        router.push(`/admin/resources/${id}`);
        return;
      }

      toast.error(result.message ?? "Unable to update resource.");
      return;
    }

    // create
    const result = await createResource(cleaned);
    if (result.success) {
      toast.success("Resource created successfully!");
      const id = result.data.id;

      if (redirectTo === "admin") {
        router.push(`/admin/resources/${id}`);
      } else {
        router.push(`/resources/${id}`);
      }
    } else {
      toast.error(
        `Error creating resource: ${result.error ?? "Unknown error"}`
      );
    }
  };

  if (!mounted) return null;

  const categoryOptions = CATEGORY_OPTIONS_BY_MAIN[watchedMain] ?? [];
  const subcategoryOptions = (SUBCATEGORY_OPTIONS_BY_MAIN_AND_CAT[
    watchedMain
  ]?.[watchedCat] ?? []) as readonly string[] | undefined;

  const remainingSlots = MAX_IMAGES - imgFields.length;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="capitalize">Resource Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Figma"
                  {...field}
                  className="min-h-14 border border-gray-100 bg-light-600 p-4 text-base placeholder:font-normal placeholder:text-slate-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* designer (optional) */}
        <FormField
          control={form.control}
          name="designer"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="capitalize">Resource Author</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Figma Inc."
                  {...field}
                  className="min-h-14 border border-gray-100 bg-light-600 p-4 text-base placeholder:font-normal placeholder:text-slate-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ NEW tagline (required) */}
        <FormField
          control={form.control}
          name="tagLine"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel className="capitalize">Tagline</FormLabel>
              <FormControl>
                <Input
                  placeholder="Short marketing tagline..."
                  {...field}
                  className="min-h-14 border border-gray-100 bg-light-600 p-4 text-base placeholder:font-normal placeholder:text-slate-500"
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                A short one-liner used on cards and lists.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cascading selects */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="mainCategory"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Main Category</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a main category" />
                    </SelectTrigger>
                    <SelectContent>
                      {MAIN_CATEGORIES.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={categoryOptions.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((c) => (
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

          <FormField
            control={form.control}
            name="subCategory"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Subcategory</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!subcategoryOptions?.length}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {(subcategoryOptions ?? []).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
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

        {/* rating */}
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
                  value={field.value as number | ""}
                  onChange={(e) =>
                    field.onChange(
                      e.currentTarget.value === ""
                        ? ""
                        : e.currentTarget.valueAsNumber
                    )
                  }
                  placeholder="e.g. 4.5"
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descriptions */}
        <FormField
          control={form.control}
          name="descriptions"
          render={() => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Descriptions (up to {MAX_DESCRIPTIONS})</FormLabel>

              <div className="space-y-3">
                {descFields.map((f, idx) => (
                  <FormItem key={f.id}>
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

        {/* tags */}
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

        {/* pricing + project type */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

        {/* checkboxes */}
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

        {/* images */}
        <FormField
          control={form.control}
          name="imgUrls"
          render={() => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Resource Images</FormLabel>

              <div className="space-y-2">
                {imgFields.map((f, idx) => (
                  <div key={f.id} className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="url"
                        placeholder={`https://example.com/image-${idx + 1}.png`}
                        {...form.register(`imgUrls.${idx}` as const)}
                        className="h-10"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeImg(idx)}
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
                  onClick={() => imgFields.length < MAX_IMAGES && appendImg("")}
                >
                  Add URL
                </Button>
                <span className="text-xs text-muted-foreground">
                  {imgFields.length}/{MAX_IMAGES}
                </span>
              </div>

              <div className="mt-2">
                <div className="mb-1 text-xs text-muted-foreground">
                  Or upload images
                  {remainingSlots > 0 ? ` — up to ${remainingSlots} more` : ""}:
                </div>

                <ImageUpload
                  multiple
                  maxFiles={Math.max(0, remainingSlots)}
                  onUploaded={(urls: string[]) => {
                    if (urls.length === 0) return;
                    appendImgUrls(urls);
                  }}
                />
              </div>

              {form.watch("imgUrls")?.length ? (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {form.watch("imgUrls").map((u, i) => (
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

        {/* websiteUrl */}
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? type === "edit"
              ? "Updating..."
              : "Submitting..."
            : type === "edit"
              ? "Update"
              : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default ResourceForm;
