// "use client";

// import * as React from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useFieldArray, useForm, useWatch } from "react-hook-form";
// import { z } from "zod";
// import useMounted from "@/hooks/useMounted";
// import type { ResourceFull } from "@/lib/types";
// import { updateResourceAction } from "@/actions/update-resource.action";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";

// import {
//   MAIN_CATEGORIES,
//   CATEGORY_OPTIONS_BY_MAIN,
//   SUBCATEGORY_OPTIONS_BY_MAIN_AND_CAT,
//   type Main,
// } from "@/lib/taxonomy";

// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { X } from "lucide-react";

// import {
//   PRICING_OPTIONS,
//   PROJECT_TYPE_OPTIONS,
//   resourceCreateSchema,
// } from "@/lib/validation/resource.schema";

// import ImageUpload from "@/components/image-upload-wrapper";
// import { createResource } from "@/actions/create-resource.action";

// /* -----------------------------
//    Tags helper (module scope)
// ------------------------------*/
// function parseTags(input: string): string[] {
//   if (!input) return [];
//   const seen = new Set<string>();
//   const out: string[] = [];
//   for (const raw of input.split(",")) {
//     const t = raw.trim();
//     if (!t) continue;
//     const key = t.toLowerCase();
//     if (!seen.has(key)) {
//       seen.add(key);
//       out.push(t); // keep original case
//     }
//     if (out.length >= 50) break; // cap
//   }
//   return out;
// }

// interface Props extends Partial<ResourceFull> {
//   type?: "create" | "edit";
//   resourceId?: string; // ✅ for edit
//   redirectTo?: "admin" | "public";
// }

// type UploadedPayload = string | string[];

// const MAX_IMAGES = 5;
// const MAX_DESCRIPTIONS = 5;

// const ResourceForm = ({
//   type = "create",
//   redirectTo = "admin",
//   resourceId,
//   ...resource
// }: Props) => {
//   const mounted = useMounted();
//   const router = useRouter();

//   type FormInput = z.input<typeof resourceCreateSchema>; // before coercion
//   type FormOutput = z.output<typeof resourceCreateSchema>; // after coercion

//   // Compute safe defaults for cascading selects
//   const defaultMain: Main =
//     (resource?.mainCategory as Main) ?? (MAIN_CATEGORIES[0] as Main);

//   const defaultCats = CATEGORY_OPTIONS_BY_MAIN[defaultMain] ?? [];
//   const defaultCat =
//     resource?.category && defaultCats.includes(resource.category)
//       ? resource.category
//       : (defaultCats[0] ?? "");

//   const defaultSubs = (SUBCATEGORY_OPTIONS_BY_MAIN_AND_CAT[defaultMain]?.[
//     defaultCat
//   ] ?? []) as readonly string[] | undefined;

//   const defaultSub =
//     resource?.subCategory && defaultSubs?.includes(resource.subCategory)
//       ? resource.subCategory
//       : (defaultSubs?.[0] ?? "");

//   const form = useForm<FormInput, undefined, FormOutput>({
//     resolver: zodResolver(resourceCreateSchema),
//     defaultValues: {
//       title: resource?.title ?? "",
//       designer: resource?.designer ?? "",

//       // ✅ REQUIRED by Prisma/Zod
//       tagLine: resource?.tagLine ?? "",

//       mainCategory: defaultMain,
//       category: defaultCat ?? "",
//       subCategory: defaultSub ?? "",

//       rating: typeof resource?.rating === "number" ? resource.rating : 0,

//       descriptions: resource?.descriptions ?? [""],

//       // ✅ NEW: logoUrl (single)
//       // keep as "" in form; normalize to null on submit
//       logoUrl: resource?.logoUrl ?? "",

//       // ✅ multi images
//       imgUrls: resource?.imgUrls ?? [],

//       websiteUrl: resource?.websiteUrl ?? "",

//       tags: resource?.tags ?? [],

//       pricing: resource?.pricing ?? PRICING_OPTIONS[0],
//       projectType: resource?.projectType ?? PROJECT_TYPE_OPTIONS[0],

//       isMobileFriendly: resource?.isMobileFriendly ?? false,
//       isFeatured: resource?.isFeatured ?? false,
//     },
//   });

//   // Watch parent fields to drive cascading dropdowns
//   const watchedMain = useWatch({
//     control: form.control,
//     name: "mainCategory",
//   }) as Main;

//   const watchedCat = useWatch({ control: form.control, name: "category" });

//   // When main changes, reset category + subcategory to first valid values
//   React.useEffect(() => {
//     const cats = CATEGORY_OPTIONS_BY_MAIN[watchedMain] ?? [];
//     const nextCat = cats[0] ?? "";

//     form.setValue("category", nextCat, {
//       shouldDirty: true,
//       shouldValidate: true,
//     });

//     const subs = (SUBCATEGORY_OPTIONS_BY_MAIN_AND_CAT[watchedMain]?.[nextCat] ??
//       []) as readonly string[] | undefined;

//     const nextSub = subs?.[0] ?? "";

//     form.setValue("subCategory", nextSub, {
//       shouldDirty: true,
//       shouldValidate: true,
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [watchedMain]);

//   // When category changes, reset subcategory to first valid value
//   React.useEffect(() => {
//     const subs = (SUBCATEGORY_OPTIONS_BY_MAIN_AND_CAT[watchedMain]?.[
//       watchedCat
//     ] ?? []) as readonly string[] | undefined;

//     const nextSub = subs?.[0] ?? "";

//     form.setValue("subCategory", nextSub, {
//       shouldDirty: true,
//       shouldValidate: true,
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [watchedCat, watchedMain]);

//   // Field arrays
//   const {
//     fields: imgFields,
//     append: appendImg,
//     remove: removeImg,
//   } = useFieldArray<FormInput, "imgUrls">({
//     control: form.control,
//     name: "imgUrls",
//   });

//   const {
//     fields: descFields,
//     append: appendDesc,
//     remove: removeDesc,
//   } = useFieldArray<FormInput, "descriptions">({
//     control: form.control,
//     name: "descriptions",
//   });

//   // Local UI state for comma-separated tags
//   const [tagsText, setTagsText] = React.useState<string>(
//     (resource?.tags ?? []).join(", ")
//   );

//   React.useEffect(() => {
//     form.setValue("tags", parseTags(tagsText), {
//       shouldDirty: true,
//       shouldValidate: true,
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [tagsText]);

//   function appendImgUrls(urls: UploadedPayload) {
//     const arr = Array.isArray(urls) ? urls : [urls];
//     const remaining = MAX_IMAGES - form.getValues("imgUrls").length;

//     if (remaining <= 0) {
//       toast.error(`Max ${MAX_IMAGES} images`);
//       return;
//     }

//     const toAdd = arr.slice(0, remaining).filter(Boolean);
//     if (!toAdd.length) return;

//     toAdd.forEach((u) => appendImg(u));

//     if (arr.length > toAdd.length) {
//       toast.error(
//         `Only ${remaining} more image${remaining === 1 ? "" : "s"} allowed (max ${MAX_IMAGES}).`
//       );
//     }
//   }

//   const onSubmit = async (values: FormOutput) => {
//     const cleaned: FormOutput = {
//       ...values,
//       title: values.title.trim(),
//       tagLine: values.tagLine.trim(),
//       designer: values.designer?.trim() ?? "",
//       descriptions: values.descriptions.map((d) => d.trim()).filter(Boolean),

//       // ✅ normalize logoUrl: "" -> null
//       logoUrl: values.logoUrl?.trim() ? values.logoUrl.trim() : null,

//       imgUrls: values.imgUrls.map((u) => u.trim()).filter(Boolean),
//       tags: values.tags.map((t) => t.trim()).filter(Boolean),
//     };

//     if (type === "edit") {
//       if (!resource.id && !resourceId) {
//         toast.error("Missing resource id for edit.");
//         return;
//       }
//       const id = resourceId ?? resource.id!;
//       const result = await updateResourceAction({
//         resourceId: id,
//         input: cleaned,
//       });

//       if (result.ok) {
//         toast.success("Resource updated successfully!");
//         router.push(`/admin/resources/${id}`);
//         return;
//       }

//       toast.error(result.message ?? "Unable to update resource.");
//       return;
//     }

//     // create
//     const result = await createResource(cleaned);
//     if (result.success) {
//       toast.success("Resource created successfully!");
//       const id = result.data.id;

//       if (redirectTo === "admin") {
//         router.push(`/admin/resources/${id}`);
//       } else {
//         router.push(`/resources/${id}`);
//       }
//     } else {
//       toast.error(
//         `Error creating resource: ${result.error ?? "Unknown error"}`
//       );
//     }
//   };

//   if (!mounted) return null;

//   const categoryOptions = CATEGORY_OPTIONS_BY_MAIN[watchedMain] ?? [];
//   const subcategoryOptions = (SUBCATEGORY_OPTIONS_BY_MAIN_AND_CAT[
//     watchedMain
//   ]?.[watchedCat] ?? []) as readonly string[] | undefined;

//   const remainingSlots = MAX_IMAGES - imgFields.length;

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         {/* title */}
//         <FormField
//           control={form.control}
//           name="title"
//           render={({ field }) => (
//             <FormItem className="flex flex-col gap-1">
//               <FormLabel className="capitalize">Resource Title</FormLabel>
//               <FormControl>
//                 <Input
//                   placeholder="e.g. Figma"
//                   {...field}
//                   className="min-h-14 border border-gray-100 bg-light-600 p-4 text-base placeholder:font-normal placeholder:text-slate-500"
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* designer (optional) */}
//         <FormField
//           control={form.control}
//           name="designer"
//           render={({ field }) => (
//             <FormItem className="flex flex-col gap-1">
//               <FormLabel className="capitalize">Resource Author</FormLabel>
//               <FormControl>
//                 <Input
//                   placeholder="e.g. Figma Inc."
//                   {...field}
//                   className="min-h-14 border border-gray-100 bg-light-600 p-4 text-base placeholder:font-normal placeholder:text-slate-500"
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* tagline (required) */}
//         <FormField
//           control={form.control}
//           name="tagLine"
//           render={({ field }) => (
//             <FormItem className="flex flex-col gap-1">
//               <FormLabel className="capitalize">Tagline</FormLabel>
//               <FormControl>
//                 <Input
//                   placeholder="Short marketing tagline..."
//                   {...field}
//                   className="min-h-14 border border-gray-100 bg-light-600 p-4 text-base placeholder:font-normal placeholder:text-slate-500"
//                 />
//               </FormControl>
//               <p className="text-xs text-muted-foreground">
//                 A short one-liner used on cards and lists.
//               </p>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* ✅ NEW: Logo image (single) */}
//         <FormField
//           control={form.control}
//           name="logoUrl"
//           render={({ field }) => {
//             const current = form.watch("logoUrl");
//             return (
//               <FormItem className="flex flex-col gap-2">
//                 <FormLabel>Logo Image (single)</FormLabel>

//                 <div className="flex items-center gap-2">
//                   <FormControl>
//                     <Input
//                       type="url"
//                       placeholder="https://example.com/logo.png"
//                       {...field}
//                       value={(field.value as string | null | undefined) ?? ""}
//                       className="h-10"
//                     />
//                   </FormControl>

//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     aria-label="Clear logo"
//                     onClick={() =>
//                       form.setValue("logoUrl", "", {
//                         shouldDirty: true,
//                         shouldValidate: true,
//                       })
//                     }
//                   >
//                     <X size={16} />
//                   </Button>
//                 </div>

//                 <div className="text-xs text-muted-foreground">
//                   Or upload one logo image:
//                 </div>

//                 <ImageUpload
//                   multiple={false}
//                   maxFiles={1}
//                   onUploaded={(urls: string[]) => {
//                     const first = urls?.[0];
//                     if (!first) return;
//                     form.setValue("logoUrl", first, {
//                       shouldDirty: true,
//                       shouldValidate: true,
//                     });
//                   }}
//                 />

//                 {current ? (
//                   <div className="mt-2 flex items-center gap-3">
//                     {/* eslint-disable-next-line @next/next/no-img-element */}
//                     <img
//                       src={current}
//                       alt="Logo preview"
//                       className="h-12 w-12 rounded border object-contain bg-white"
//                     />
//                     <Badge variant="secondary">Logo preview</Badge>
//                   </div>
//                 ) : (
//                   <p className="text-xs text-slate-500">
//                     No logo set (optional).
//                   </p>
//                 )}

//                 <FormMessage />
//               </FormItem>
//             );
//           }}
//         />

//         {/* Cascading selects */}
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//           <FormField
//             control={form.control}
//             name="mainCategory"
//             render={({ field }) => (
//               <FormItem className="flex flex-col gap-1">
//                 <FormLabel>Main Category</FormLabel>
//                 <FormControl>
//                   <Select onValueChange={field.onChange} value={field.value}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a main category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {MAIN_CATEGORIES.map((m) => (
//                         <SelectItem key={m} value={m}>
//                           {m}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="category"
//             render={({ field }) => (
//               <FormItem className="flex flex-col gap-1">
//                 <FormLabel>Category</FormLabel>
//                 <FormControl>
//                   <Select
//                     onValueChange={field.onChange}
//                     value={field.value}
//                     disabled={categoryOptions.length === 0}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {categoryOptions.map((c) => (
//                         <SelectItem key={c} value={c}>
//                           {c}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="subCategory"
//             render={({ field }) => (
//               <FormItem className="flex flex-col gap-1">
//                 <FormLabel>Subcategory</FormLabel>
//                 <FormControl>
//                   <Select
//                     onValueChange={field.onChange}
//                     value={field.value}
//                     disabled={!subcategoryOptions?.length}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a subcategory" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {(subcategoryOptions ?? []).map((s) => (
//                         <SelectItem key={s} value={s}>
//                           {s}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* rating */}
//         <FormField
//           control={form.control}
//           name="rating"
//           render={({ field }) => (
//             <FormItem className="flex flex-col gap-1">
//               <FormLabel className="capitalize">Rating (0–5)</FormLabel>
//               <FormControl>
//                 <Input
//                   type="number"
//                   inputMode="decimal"
//                   min={0}
//                   max={5}
//                   step={0.5}
//                   value={field.value as number | ""}
//                   onChange={(e) =>
//                     field.onChange(
//                       e.currentTarget.value === ""
//                         ? ""
//                         : e.currentTarget.valueAsNumber
//                     )
//                   }
//                   placeholder="e.g. 4.5"
//                   className="h-10"
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Descriptions */}
//         <FormField
//           control={form.control}
//           name="descriptions"
//           render={() => (
//             <FormItem className="flex flex-col gap-2">
//               <FormLabel>Descriptions (up to {MAX_DESCRIPTIONS})</FormLabel>

//               <div className="space-y-3">
//                 {descFields.map((f, idx) => (
//                   <FormItem key={f.id}>
//                     <FormControl>
//                       <div className="flex items-start gap-2">
//                         <Textarea
//                           placeholder={`Description ${idx + 1}`}
//                           rows={4}
//                           {...form.register(`descriptions.${idx}` as const)}
//                         />
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="icon"
//                           aria-label={`Remove description ${idx + 1}`}
//                           onClick={() => removeDesc(idx)}
//                         >
//                           <X size={16} />
//                         </Button>
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 ))}
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button
//                   type="button"
//                   variant="secondary"
//                   onClick={() =>
//                     descFields.length < MAX_DESCRIPTIONS && appendDesc("")
//                   }
//                 >
//                   Add description
//                 </Button>
//                 <span className="text-xs text-muted-foreground">
//                   {descFields.length}/{MAX_DESCRIPTIONS}
//                 </span>
//               </div>
//             </FormItem>
//           )}
//         />

//         {/* tags */}
//         <FormItem className="flex flex-col gap-1">
//           <FormLabel className="capitalize">Tags</FormLabel>
//           <FormControl>
//             <Input
//               placeholder="react, hooks, patterns"
//               value={tagsText}
//               onChange={(e) => setTagsText(e.target.value)}
//               className="h-10"
//             />
//           </FormControl>

//           <p className="text-xs text-muted-foreground">
//             Separate with commas. Max 50. Tags must be unique
//             (case-insensitive).
//           </p>

//           {form.watch("tags")?.length ? (
//             <div className="flex flex-wrap gap-1 pt-1">
//               {form.watch("tags").map((t) => (
//                 <span key={t} className="rounded border px-2 py-0.5 text-xs">
//                   {t}
//                 </span>
//               ))}
//             </div>
//           ) : null}

//           <FormMessage />
//         </FormItem>

//         {/* pricing + project type */}
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//           <FormField
//             control={form.control}
//             name="pricing"
//             render={({ field }) => (
//               <FormItem className="flex flex-col gap-1">
//                 <FormLabel className="capitalize">Pricing Model</FormLabel>
//                 <FormControl>
//                   <Select onValueChange={field.onChange} value={field.value}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a pricing model" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {PRICING_OPTIONS.map((c) => (
//                         <SelectItem key={c} value={c}>
//                           {c}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="projectType"
//             render={({ field }) => (
//               <FormItem className="flex flex-col gap-1">
//                 <FormLabel className="capitalize">Project Type</FormLabel>
//                 <FormControl>
//                   <Select onValueChange={field.onChange} value={field.value}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a project type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {PROJECT_TYPE_OPTIONS.map((c) => (
//                         <SelectItem key={c} value={c}>
//                           {c}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* checkboxes */}
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//           <FormField
//             control={form.control}
//             name="isMobileFriendly"
//             render={({ field }) => (
//               <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
//                 <FormControl>
//                   <Checkbox
//                     checked={field.value}
//                     onCheckedChange={field.onChange}
//                   />
//                 </FormControl>
//                 <div className="space-y-1 leading-none">
//                   <FormLabel>Mobile Friendly</FormLabel>
//                   <p className="text-xs text-muted-foreground">
//                     Mark this if the resource is optimized for mobile use.
//                   </p>
//                 </div>
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="isFeatured"
//             render={({ field }) => (
//               <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
//                 <FormControl>
//                   <Checkbox
//                     checked={field.value}
//                     onCheckedChange={field.onChange}
//                   />
//                 </FormControl>
//                 <div className="space-y-1 leading-none">
//                   <FormLabel>Featured</FormLabel>
//                   <p className="text-xs text-muted-foreground">
//                     Highlight this resource as featured.
//                   </p>
//                 </div>
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* images (multi) */}
//         <FormField
//           control={form.control}
//           name="imgUrls"
//           render={() => (
//             <FormItem className="flex flex-col gap-2">
//               <FormLabel>Resource Images</FormLabel>

//               <div className="space-y-2">
//                 {imgFields.map((f, idx) => (
//                   <div key={f.id} className="flex items-center gap-2">
//                     <FormControl>
//                       <Input
//                         type="url"
//                         placeholder={`https://example.com/image-${idx + 1}.png`}
//                         {...form.register(`imgUrls.${idx}` as const)}
//                         className="h-10"
//                       />
//                     </FormControl>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => removeImg(idx)}
//                       aria-label={`Remove image ${idx + 1}`}
//                     >
//                       <X size={16} />
//                     </Button>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button
//                   type="button"
//                   variant="secondary"
//                   onClick={() => imgFields.length < MAX_IMAGES && appendImg("")}
//                 >
//                   Add URL
//                 </Button>
//                 <span className="text-xs text-muted-foreground">
//                   {imgFields.length}/{MAX_IMAGES}
//                 </span>
//               </div>

//               <div className="mt-2">
//                 <div className="mb-1 text-xs text-muted-foreground">
//                   Or upload images
//                   {remainingSlots > 0 ? ` — up to ${remainingSlots} more` : ""}:
//                 </div>

//                 <ImageUpload
//                   multiple
//                   maxFiles={Math.max(0, remainingSlots)}
//                   onUploaded={(urls: string[]) => {
//                     if (urls.length === 0) return;
//                     appendImgUrls(urls);
//                   }}
//                 />
//               </div>

//               {form.watch("imgUrls")?.length ? (
//                 <div className="mt-3 flex flex-wrap items-center gap-3">
//                   {form.watch("imgUrls").map((u, i) => (
//                     <div key={`${u}-${i}`} className="flex items-center gap-2">
//                       {/* eslint-disable-next-line @next/next/no-img-element */}
//                       <img
//                         src={u}
//                         alt={`Preview ${i + 1}`}
//                         className="h-12 w-12 rounded border object-cover"
//                       />
//                       <Badge variant="secondary">{i + 1}</Badge>
//                     </div>
//                   ))}
//                 </div>
//               ) : null}

//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* websiteUrl */}
//         <FormField
//           control={form.control}
//           name="websiteUrl"
//           render={({ field }) => (
//             <FormItem className="flex flex-col gap-1">
//               <FormLabel className="capitalize">Website URL</FormLabel>
//               <FormControl>
//                 <Input
//                   type="url"
//                   placeholder="https://example.com"
//                   {...field}
//                   className="h-10"
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <Button type="submit" disabled={form.formState.isSubmitting}>
//           {form.formState.isSubmitting
//             ? type === "edit"
//               ? "Updating..."
//               : "Submitting..."
//             : type === "edit"
//               ? "Update"
//               : "Submit"}
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default ResourceForm;

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
import { Separator } from "@/components/ui/separator";

import {
  MAIN_CATEGORIES,
  CATEGORY_OPTIONS_BY_MAIN,
  SUBCATEGORY_OPTIONS_BY_MAIN_AND_CAT,
  type Main,
} from "@/lib/taxonomy";

import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  X,
  Plus,
  Save,
  Send,
  Trash2,
  Globe,
  Layout,
  Tag,
  ImageIcon,
} from "lucide-react";

import {
  PRICING_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  resourceCreateSchema,
} from "@/lib/validation/resource.schema";

import ImageUpload from "@/components/image-upload-wrapper";
import { createResource } from "@/actions/create-resource.action";

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
      out.push(t);
    }
    if (out.length >= 50) break;
  }
  return out;
}

interface Props extends Partial<ResourceFull> {
  type?: "create" | "edit";
  resourceId?: string;
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

  type FormInput = z.input<typeof resourceCreateSchema>;
  type FormOutput = z.output<typeof resourceCreateSchema>;

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
      tagLine: resource?.tagLine ?? "",
      mainCategory: defaultMain,
      category: defaultCat ?? "",
      subCategory: defaultSub ?? "",
      rating: typeof resource?.rating === "number" ? resource.rating : 0,
      descriptions: resource?.descriptions ?? [""],
      logoUrl: resource?.logoUrl ?? "",
      imgUrls: resource?.imgUrls ?? [],
      websiteUrl: resource?.websiteUrl ?? "",
      tags: resource?.tags ?? [],
      pricing: resource?.pricing ?? PRICING_OPTIONS[0],
      projectType: resource?.projectType ?? PROJECT_TYPE_OPTIONS[0],
      isMobileFriendly: resource?.isMobileFriendly ?? false,
      isFeatured: resource?.isFeatured ?? false,
    },
  });

  const watchedMain = useWatch({
    control: form.control,
    name: "mainCategory",
  }) as Main;
  const watchedCat = useWatch({ control: form.control, name: "category" });

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
  }, [watchedMain, form]);

  React.useEffect(() => {
    const subs = (SUBCATEGORY_OPTIONS_BY_MAIN_AND_CAT[watchedMain]?.[
      watchedCat
    ] ?? []) as readonly string[] | undefined;
    const nextSub = subs?.[0] ?? "";
    form.setValue("subCategory", nextSub, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [watchedCat, watchedMain, form]);

  const {
    fields: imgFields,
    append: appendImg,
    remove: removeImg,
  } = useFieldArray({ control: form.control, name: "imgUrls" });
  const {
    fields: descFields,
    append: appendDesc,
    remove: removeDesc,
  } = useFieldArray({ control: form.control, name: "descriptions" });

  const [tagsText, setTagsText] = React.useState<string>(
    (resource?.tags ?? []).join(", "),
  );

  React.useEffect(() => {
    form.setValue("tags", parseTags(tagsText), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [tagsText, form]);

  function appendImgUrls(urls: UploadedPayload) {
    const arr = Array.isArray(urls) ? urls : [urls];
    const remaining = MAX_IMAGES - form.getValues("imgUrls").length;
    if (remaining <= 0) {
      toast.error(`Max ${MAX_IMAGES} images`);
      return;
    }
    const toAdd = arr.slice(0, remaining).filter(Boolean);
    toAdd.forEach((u) => appendImg(u));
  }

  const onSubmit = async (values: FormOutput) => {
    const cleaned: FormOutput = {
      ...values,
      title: values.title.trim(),
      tagLine: values.tagLine.trim(),
      designer: values.designer?.trim() ?? "",
      descriptions: values.descriptions.map((d) => d.trim()).filter(Boolean),
      logoUrl: values.logoUrl?.trim() ? values.logoUrl.trim() : null,
      imgUrls: values.imgUrls.map((u) => u.trim()).filter(Boolean),
      tags: values.tags.map((t) => t.trim()).filter(Boolean),
    };

    if (type === "edit") {
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

    const result = await createResource(cleaned);
    if (result.success) {
      toast.success("Resource created successfully!");
      router.push(
        redirectTo === "admin"
          ? `/admin/resources/${result.data.id}`
          : `/resources/${result.data.id}`,
      );
    } else {
      toast.error(`Error: ${result.error ?? "Unknown error"}`);
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-4xl space-y-12 pb-20"
      >
        {/* SECTION 1: IDENTITY */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Layout className="size-5 text-slate-400" />
            <h3 className="text-lg font-bold tracking-tight">
              Identity & Branding
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Resource Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Figma"
                      {...field}
                      className="bg-slate-50/50 dark:bg-slate-900/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="designer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Author / Designer
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Figma Inc."
                      {...field}
                      className="bg-slate-50/50 dark:bg-slate-900/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="tagLine"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Short Tagline
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="One-sentence marketing pitch..."
                    {...field}
                    className="bg-slate-50/50 dark:bg-slate-900/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* SECTION 2: TAXONOMY */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/20 space-y-6">
          <div className="flex items-center gap-2">
            <Tag className="size-5 text-slate-400" />
            <h3 className="text-lg font-bold tracking-tight">Classification</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="mainCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-slate-400">
                    Main
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-slate-950">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MAIN_CATEGORIES.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-slate-400">
                    Category
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={categoryOptions.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-slate-950">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryOptions.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase text-slate-400">
                    Sub-Category
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!subcategoryOptions?.length}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-slate-950">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(subcategoryOptions ?? []).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SECTION 3: CONTENT */}
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="descriptions"
            render={() => (
              <FormItem className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Descriptions ({descFields.length}/{MAX_DESCRIPTIONS})
                  </FormLabel>
                </div>
                <div className="space-y-3">
                  {descFields.map((f, idx) => (
                    <div
                      key={f.id}
                      className="group relative flex items-start gap-2"
                    >
                      <FormControl className="flex-1">
                        <Textarea
                          placeholder="Add a detailed description paragraph..."
                          rows={3}
                          {...form.register(`descriptions.${idx}` as const)}
                          className="bg-slate-50/50 focus:bg-white"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                        onClick={() => removeDesc(idx)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed"
                  onClick={() =>
                    descFields.length < MAX_DESCRIPTIONS && appendDesc("")
                  }
                >
                  <Plus className="mr-2 size-4" /> Add Paragraph
                </Button>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tags (Comma Separated)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="react, tailwind, ui-ux"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  className="bg-slate-50/50"
                />
              </FormControl>
              <div className="flex flex-wrap gap-1 pt-2">
                {form.watch("tags").map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="font-normal text-[10px]"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </FormItem>
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Rating (0-5)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step={0.5}
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      className="bg-slate-50/50"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SECTION 4: ASSETS & LINKS */}
        <div className="space-y-8 rounded-xl border border-slate-200 p-6 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ImageIcon className="size-5 text-slate-400" />
            <h3 className="text-lg font-bold tracking-tight">Media & Links</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <FormLabel className="text-sm font-semibold">
                Logo Image
              </FormLabel>
              <ImageUpload
                multiple={false}
                maxFiles={1}
                onUploaded={(urls) =>
                  form.setValue("logoUrl", urls[0], { shouldDirty: true })
                }
              />
              {form.watch("logoUrl") && (
                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border">
                  <img
                    src={form.watch("logoUrl")}
                    className="size-10 rounded object-contain bg-white"
                    alt="logo"
                  />
                  <span className="text-xs text-slate-500 truncate flex-1">
                    {form.watch("logoUrl")}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => form.setValue("logoUrl", "")}
                  >
                    <X size={14} />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <FormLabel className="text-sm font-semibold">
                Gallery Images ({imgFields.length}/{MAX_IMAGES})
              </FormLabel>
              <ImageUpload
                multiple
                maxFiles={remainingSlots}
                onUploaded={appendImgUrls}
              />
              <div className="flex flex-wrap gap-2">
                {form.watch("imgUrls").map((u, i) => (
                  <div key={i} className="relative group size-12">
                    <img
                      src={u}
                      className="size-full rounded object-cover border"
                      alt="gallery"
                    />
                    <button
                      type="button"
                      onClick={() => removeImg(i)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Globe className="size-3" /> Website URL
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://figma.com"
                    {...field}
                    className="bg-slate-50/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* SECTION 5: METADATA & SETTINGS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="pricing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Pricing Model
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-50/50">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRICING_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Project Type
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-50/50">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROJECT_TYPE_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="isMobileFriendly"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Mobile Friendly</FormLabel>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 border-amber-200 bg-amber-50/20 dark:border-amber-900/30">
                  <div className="space-y-0.5">
                    <FormLabel className="text-amber-700 dark:text-amber-400">
                      Featured Resource
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t pt-8">
          <Button variant="ghost" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="min-w-[160px] bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
          >
            {form.formState.isSubmitting ? (
              "Processing..."
            ) : (
              <span className="flex items-center gap-2">
                {type === "edit" ? <Save size={18} /> : <Send size={18} />}
                {type === "edit" ? "Save Changes" : "Create Resource"}
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResourceForm;
