"use client";

import { useAuthState } from "@/hooks/useAuthState";
import { Button } from "./ui/button";
import { signIn } from "@/lib/auth-client";
import { set } from "zod";
import { toast } from "sonner";

interface SignInOauthButtonProps {
  provider: "google" | "github";
  signUp?: boolean;
}

const SignInOauthButton = ({ provider, signUp }: SignInOauthButtonProps) => {
  const { loading, setLoading } = useAuthState();
  const action = signUp ? "Up" : "In";
  const providerName = provider === "google" ? "Google" : "GitHub";

  async function handleClick() {
    await signIn.social({
      provider,
      callbackURL: "/profile",
      errorCallbackURL: "/signin/error",
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    });
  }
  return (
    <Button onClick={handleClick} disabled={loading}>
      Sign {action} with {providerName}
    </Button>
  );
};
export default SignInOauthButton;
