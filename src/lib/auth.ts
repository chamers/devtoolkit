import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import prisma from "@/db";
import { Role } from "@/generated/prisma";
import { ac, roles } from "./permissions";

export const auth = betterAuth({
  appName: "DevToolkit",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 20,
  },
  hooks: {},
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(";") || [];
          if (ADMIN_EMAILS.includes(user.email)) {
            return { data: { ...user, role: Role.ADMIN } };
          }
          return { data: user };
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN", "MODERATOR", "EDITOR", "VIEWER"],
        input: false,
      },
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
  },
  advanced: {
    database: {
      generateId: false, // ← IMPORTANT: let Postgres/Prisma create UUIDs
    },
  },
  plugins: [
    nextCookies(),
    admin({
      defaultRole: Role.USER,
      adminRoles: [Role.ADMIN, Role.MODERATOR, Role.EDITOR], // admin, user
      ac,
      roles,
    }),
  ],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES;
