"use client" // This must be a Client Component
import { ThemeProvider } from "@/components/ThemeProvider"
import React from "react" // Import React for React.ReactNode

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}