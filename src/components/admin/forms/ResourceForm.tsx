"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import { z } from "zod"
import useMounted from "@/hooks/useMounted";
import type { Resource } from "@/types";

 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { resourceCreateSchema, categorySchema } from "@/lib/validations";

interface Props extends Partial<Resource>{
  type?: 'create' | 'edit';
} 


const ResourceForm = ({type, ...resource}:Props)  => {

const mounted = useMounted(); // ✅ Prevent hydration mismatch
  
// const router = useRouter();

const CATEGORIES = categorySchema.options

type FormInput = z.input<typeof resourceCreateSchema>;   // before coercion (rating: unknown)
type FormOutput = z.output<typeof resourceCreateSchema>;
  
const form = useForm<FormInput, undefined, FormOutput>({
    resolver: zodResolver(resourceCreateSchema),
    defaultValues: {
      title: resource?.title ?? "",
      author: resource?.author ?? "",
      category: resource?.category ?? CATEGORIES[0],
      rating: typeof resource?.rating === "number" ? resource.rating : 0,
  }})

  // 2. Define a submit handler.
   const onSubmit = async (values: z.infer<typeof resourceCreateSchema>) => {
    console.log(values);
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
                <FormLabel className="capitalize">
                    Resource Title
                  </FormLabel>
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

        {/* category dropdown */}
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
          // value={field.value ?? 0} // keep controlled
          // onChange={(e) =>
          //   field.onChange(
          //     e.target.value === "" ? "" : e.currentTarget.valueAsNumber
          //   )
          // }
          value={field.value as number | ""}   // ← narrow the type right here
  onChange={(e) =>
    field.onChange(e.currentTarget.value === "" ? "" : e.currentTarget.valueAsNumber)
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


          <Button
  type="submit"
  // onClick={() => console.log("Current title:", form.getValues("title"))}
>
  Submit
</Button>
      </form>
    </Form>
)
   
}
export default ResourceForm;