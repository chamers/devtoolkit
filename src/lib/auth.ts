import { betterAuth } from "better-auth";
import prisma from "@/db";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  appName: "DevToolkit",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 20,
  },
  advanced: {
    database: {
      generateId: false, // ← IMPORTANT: let Postgres/Prisma create UUIDs
    },
  },
});
