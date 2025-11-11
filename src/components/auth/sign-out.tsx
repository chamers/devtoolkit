"use client";
import React from "react";
import { Button } from "../ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignOut = () => {
  const router = useRouter();
  return (
    <Button
      variant="destructive"
      onClick={async () => {
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/signin");
            },
            onError: (ctx) => {
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
