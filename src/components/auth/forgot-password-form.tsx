"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import CardWrapper from "../card-wrapper";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { useAuthState } from "@/hooks/useAuthState";
import { requestPasswordReset } from "@/lib/auth-client";

/* ------------------------------------------------------------------ */
/* Schema */
/* ------------------------------------------------------------------ */

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

const ForgotPasswordForm = () => {
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

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    resetState();
    setLoading(true);

    try {
      const redirectTo = `${window.location.origin}/reset-password`;

      const res = await requestPasswordReset({
        email: values.email,
        redirectTo,
      });

      // Always show generic message (good security practice)
      setSuccess(
        "If an account exists for that email, we’ve sent a password reset link."
      );

      // optionally: if you want to log real errors during dev
      if (res?.error) console.warn(res.error);
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      cardTitle="Reset your password"
      cardDescription="Enter your email and we’ll send you a reset link"
      cardFooterDescription="Remembered your password?"
      cardFooterLink="/signin"
      cardFooterLinkTitle="Back to sign in"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mx-auto w-full max-w-sm"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending reset link..." : "Send reset link"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ForgotPasswordForm;
