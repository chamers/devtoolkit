"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import React from "react";
import type { Session } from "next-auth";

export default function ClientProviders({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <ThemeProvider>
      <SessionProvider session={session}>
        <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}>
          {children}
          <Toaster richColors position="top-right" />
        </ImageKitProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
