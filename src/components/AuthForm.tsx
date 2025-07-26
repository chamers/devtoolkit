"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from "react-hook-form"
import { z, ZodType } from "zod"
import useMounted from "@/hooks/useMounted";

 
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

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
} 


const AuthForm = <T extends FieldValues>({type, schema, defaultValues, onSubmit}:Props<T>)  => {
const mounted = useMounted(); // ✅ Prevent hydration mismatch
  

  const isSignIn = type === "SIGN_IN"
  // 1. Define your form.
const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema as ZodType<any, any, any>),
    defaultValues: defaultValues as DefaultValues<T>
  })

  // 2. Define a submit handler.
  const handleSubmit:SubmitHandler<T> = async (data) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(data)
  }
  // 3. Use useMounted to prevent hydration mismatch
  //    This is important for client-side only components.
  if (!mounted) return null;
return (
    <div className="flex flex-col items-center justify-center">
        <h3 className="text-orange-sys-light-prim dark:text-pink-sys-dark-prim">{isSignIn ? "Welcome back to DevToolkit": "Create your account"}</h3>
        <p className="font-handwriting text-xl mb-4" >{isSignIn ? "Access the vast collection of resources and stay updated": "Please complete all fields"}</p>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                <FormControl>
                  <Input
                        required
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                        }
                        {...field}
        
                      />
                </FormControl>
                <FormDescription>
                  {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]} is required
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
       ))}

        <Button type="submit">{isSignIn ? "Sign In" : "Sign Up"}</Button>
      </form>
    </Form>
    <p className="text-orange-sys-light-prim dark:text-pink-sys-dark-prim mt-4">{isSignIn ? "New to DevToolkit?" : "Already have an account?"}
      <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="ml-2 text-gray-300 hover:underline">
        {isSignIn ? "Create an account" : "Sign in"}
      </Link>
    </p>
    </div>

    
  )
}
export default AuthForm