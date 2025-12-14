// src/hooks/useMounted.ts
 
import { useEffect, useState } from "react";

/**
 * Returns true after the component hydrates on the client.
 * Safe to use to avoid SSR/CSR mismatches (e.g., theme, RHF, window usage).
 */
export default function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set on the next frame to avoid layout thrash and keep it predictable.
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return mounted;
}
