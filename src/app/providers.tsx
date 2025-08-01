"use client" // This must be a Client Component
import { ThemeProvider } from "@/components/ThemeProvider"
import { ImageKitProvider } from "@imagekit/next"
import React from "react" // Import React for React.ReactNode
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}>
        {children}
        <Toaster richColors position="top-right" />
      </ImageKitProvider>
    </ThemeProvider>
  )
}