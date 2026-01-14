"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import { Label } from "@radix-ui/react-label";
import { StarIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { set } from "zod";

const MagicLinkLoginForm = () => {
  const [isPending, setIsPending] = useState(false);
  const ref = useRef<HTMLDetailsElement>(null);
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = String(formData.get("email"));
    if (!email) {
      return toast.error("Please enter a valid email address.");
    }
    await signIn.magicLink({
      email,
      name: email.split("@")[0],
      callbackURL: "/profile",
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(
            ctx.error?.message ||
              "An unexpected error occurred. Please try again."
          );
        },
        onSuccess: () => {
          toast.success("Magic link sent! Please check your email to sign in.");
          if (ref.current) ref.current.open = false;
        },
      },
    });
  }
  return (
    <details
      ref={ref}
      className="max-w-sm rounded-md border border-purple-600 overflow-hidden"
    >
      <summary className="flex gap-2 items-center px-2 py-1 bg-purple-600 text-white hover:bg-purple-600/80 transition">
        Try Magic Link <StarIcon size={16} className="ml-2" />
      </summary>
      <form onSubmit={handleSubmit} className="px-2 py-1">
        <Label htmlFor="email" className="sr-only">
          Email
        </Label>
        <div className="flex gap-2 items-center">
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
          ></Input>
          <Button type="submit" disabled={isPending}>
            Send
          </Button>
        </div>
      </form>
    </details>
  );
};
export default MagicLinkLoginForm;
