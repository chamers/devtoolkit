"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false)
  

  useEffect(() => setIsClient(true), []);

    if (!isClient) return null; // Ensure the component is mounted before rendering

  return (
    <div className="flex gap-2">
      <button onClick={() => setTheme("light")}>☀️ Light</button>
      <button onClick={() => setTheme("dark")}>🌙 Dark</button>
      <button onClick={() => setTheme("system")}>💻 System</button>
    </div>
  );
}
