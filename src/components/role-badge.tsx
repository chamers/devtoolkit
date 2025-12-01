// src/components/role-badge.tsx
"use client";

import { cn } from "@/lib/utils";

type Role = "USER" | "ADMIN" | (string & {});

const ROLE_LABELS: Record<Role, string> = {
  USER: "User",
  ADMIN: "Admin",
};

const ROLE_STYLES: Record<Role, string> = {
  USER: "bg-blue-100 text-blue-800 border-blue-300",
  ADMIN: "bg-red-100 text-red-800 border-red-300",
};

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const label = ROLE_LABELS[role] ?? role.toLowerCase();
  const roleStyles =
    ROLE_STYLES[role] ?? "bg-slate-100 text-slate-800 border-slate-300";

  return (
    <span
      data-role={role}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        roleStyles,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      <span>{label}</span>
    </span>
  );
}
