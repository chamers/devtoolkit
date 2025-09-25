"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from "react-hook-form"
import { z, ZodType } from "zod"
import useMounted from "@/hooks/useMounted";
import type { Resource } from "@/types";

 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/dist/client/link"
import { FIELD_NAMES, FIELD_TYPES } from "@/constants"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { resourceCreateSchema } from "@/lib/validations";

interface Props extends Partial<Resource>{
  type?: 'create' | 'edit';
} 


const ResourceForm = ({type, ...resource}:Props)  => {

const mounted = useMounted(); // ✅ Prevent hydration mismatch
  
// const router = useRouter();

  
const form = useForm<z.infer<typeof resourceCreateSchema>>({
    resolver: zodResolver(resourceCreateSchema),
    defaultValues: {
      title: "",
    },
  })

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
                        className="min-h-14 border border-gray-100 bg-light-600 p-4 text-base font-semibold placeholder:font-normal placeholder:text-slate-500 !important"
        
                      />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
  type="submit"
  onClick={() => console.log("Current title:", form.getValues("title"))}
>
  Submit
</Button>
      </form>
    </Form>
)
   
}
export default ResourceForm;