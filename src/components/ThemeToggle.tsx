"use client";


import useMounted from "@/hooks/useMounted";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
    if (!mounted) return null;

  return (
    <div className="flex gap-2">
      <button onClick={() => setTheme("light")}>☀️ Light</button>
      <button onClick={() => setTheme("dark")}>🌙 Dark</button>
      <button onClick={() => setTheme("system")}>💻 System</button>
    </div>
  );
}
