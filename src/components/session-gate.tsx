"use client";

import { useSession } from "@/lib/auth-client";

export function SessionGate() {
  // This triggers Better Auth's session fetch/refresh behavior on the client.
  useSession();
  return null;
}
