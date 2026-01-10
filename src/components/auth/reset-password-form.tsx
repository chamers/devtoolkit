"use client";

import React, { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { resetPassword } from "@/lib/auth-client";

/* ------------------------------------------------------------------ */
/* Schema */
/* ------------------------------------------------------------------ */

const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

/* ------------------------------------------------------------------ */
/* Inner component (this is where useSearchParams lives) */
/* ------------------------------------------------------------------ */

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const errorParam = searchParams.get("error");

  const {
    error,
    success,
    loading,
    setSuccess,
    setError,
    setLoading,
    resetState,
  } = useAuthState();

  const tokenErrorMessage = useMemo(() => {
    if (!errorParam) return null;
    if (errorParam === "INVALID_TOKEN") {
      return "This reset link is invalid or expired. Please request a new one.";
    }
    return "This reset link is not valid.";
  }, [errorParam]);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordInput) => {
    resetState();

    if (!token) {
      setError("Missing reset token. Please request a new reset link.");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword({
        token,
        newPassword: values.password,
      });

      if (res?.error) {
        setError(res.error.message ?? "Could not reset password.");
        return;
      }

      setSuccess("Password updated successfully. You can now sign in.");
      router.push("/signin");
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      cardTitle="Set a new password"
      cardDescription="Choose a strong password for your DevToolkit account"
      cardFooterDescription="Back to"
      cardFooterLink="/signin"
      cardFooterLinkTitle="Sign in"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mx-auto w-full max-w-sm"
        >
          {tokenErrorMessage && <FormError message={tokenErrorMessage} />}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    disabled={loading || !!tokenErrorMessage}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    disabled={loading || !!tokenErrorMessage}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !!tokenErrorMessage}
          >
            {loading ? "Updating password..." : "Update password"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

/* ------------------------------------------------------------------ */
/* Exported component (Suspense boundary) */
/* ------------------------------------------------------------------ */

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
      <ResetPasswordInner />
    </Suspense>
  );
}
