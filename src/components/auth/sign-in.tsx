// components/auth/sign-in.tsx
"use client";
import React from "react";
import CardWrapper from "../card-wrapper";
import FormError from "../form-error";
import { FcGoogle } from "react-icons/fc";
//import SocialButton from './social-button'
import { FaGithub } from "react-icons/fa";
import { useAuthState } from "@/hooks/useAuthState";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import FormSuccess from "../form-success";
import { SigninInput, SigninSchema } from "@/lib/validation/auth.schema";
import { signInEmailAction } from "@/actions/sign-in-email.action";

const SignIn = () => {
  const router = useRouter();
  const {
    error,
    success,
    loading,
    setSuccess,
    setError,
    setLoading,
    resetState,
  } = useAuthState();

  const form = useForm<SigninInput>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SigninSchema>) => {
    resetState();
    setLoading(true);
    try {
      // Build FormData for the server action
      const fd = new FormData();
      fd.set("email", values.email);
      fd.set("password", values.password);

      const result = await signInEmailAction(fd);

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setSuccess("Signin successful! Good to have you back.");
      router.push("/profile");
    } catch (e) {
      console.error(e);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      cardTitle="Sign In"
      cardDescription="Enter your email below to login to your account"
      cardFooterDescription="Don't have an account?"
      cardFooterLink="/signup"
      cardFooterLinkTitle="Sign up"
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="email"
                    placeholder="example@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="password"
                    placeholder="********"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={loading} type="submit" className="w-full">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default SignIn;
