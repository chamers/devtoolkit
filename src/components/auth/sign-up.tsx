"use client";
import React from "react";
import CardWrapper from "../card-wrapper";
import FormError from "../form-error";

import { FcGoogle } from "react-icons/fc";
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

// import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import FormSuccess from "../form-success";
import { SignupInput, SignupSchema } from "@/lib/validation/auth.schema";
import { signUpEmailAction } from "@/actions/sign-up-email.action";
import SignInOauthButton from "../sign-in-oauth-button";

const SignUp = () => {
  const router = useRouter();
  const {
    error,
    success,
    loading,
    setLoading,
    setError,
    setSuccess,
    resetState,
  } = useAuthState();

  const form = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignupSchema>) => {
    resetState();
    setLoading(true);
    try {
      // Build FormData for the server action
      const fd = new FormData();
      fd.set("name", values.name);
      fd.set("email", values.email);
      fd.set("password", values.password);

      const result = await signUpEmailAction(fd);

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setSuccess("User has been created");
      router.push("/profile");
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      cardTitle="SignUp"
      cardDescription="Create a new account"
      cardFooterLink="/signin"
      cardFooterDescription="Already have an account?"
      cardFooterLinkTitle="Sign In"
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="text"
                    placeholder="john"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            {loading ? "Submitting..." : "Submit"}
          </Button>
          <div className="flex flex-col max-w-sm gap-4">
            <hr className="max-w-sm" />
            <SignInOauthButton signUp provider="google" />
            <SignInOauthButton signUp provider="github" />
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default SignUp;
