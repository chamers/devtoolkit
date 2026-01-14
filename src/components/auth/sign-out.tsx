"use client";

import { Button } from "../ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthState } from "@/hooks/useAuthState";

const SignOut = () => {
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

  return (
    <Button
      variant="destructive"
      disabled={loading}
      onClick={async () => {
        await signOut({
          fetchOptions: {
            onResponse: () => {
              setLoading(false);
            },
            onRequest: () => {
              resetState();
              setLoading(true);
            },
            onSuccess: () => {
              toast.success("Signed out successfully. See you next time!");
              // 1. Tell Next.js to clear its client-side cache
              // 2. Redirect the user
              router.push("/");
              router.refresh();
            },
            onError: (ctx) => {
              setLoading(false);
              toast.error(ctx.error.message || "Error signing out");
            },
          },
        });
      }}
    >
      Sign Out
    </Button>
  );
};

export default SignOut;
