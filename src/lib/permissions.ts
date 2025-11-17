import { Role } from "@/generated/prisma/client";
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statements = {
  ...defaultStatements,
  resources: ["create", "read", "update", "delete", "update:own", "delete:own"],
} as const;

export const ac = createAccessControl(statements);

// Role definitions mapped to your Prisma Role enum
export const roles = {
  // Read-only access
  [Role.VIEWER]: ac.newRole({
    resources: ["read"],
  }),

  // Standard user: can manage their own content
  [Role.USER]: ac.newRole({
    resources: ["create", "read", "update:own", "delete:own"],
  }),

  // Editor: can create and update everything, delete own
  [Role.EDITOR]: ac.newRole({
    resources: ["create", "read", "update", "update:own", "delete:own"],
  }),

  // Moderator: moderation powers over others’ content
  [Role.MODERATOR]: ac.newRole({
    ...adminAc.statements,
    resources: ["read", "update", "delete", "update:own", "delete:own"],
  }),

  // Admin: full control
  [Role.ADMIN]: ac.newRole({
    ...adminAc.statements,
    resources: [
      "create",
      "read",
      "update",
      "delete",
      "update:own",
      "delete:own",
    ],
  }),
} as const;
