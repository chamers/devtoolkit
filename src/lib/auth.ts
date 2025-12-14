import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import prisma from "@/db";
import { ac, roles } from "./permissions";
import { redis } from "@/lib/redis";
import { Role } from "@prisma/client";

export const auth = betterAuth({
  appName: "DevToolkit",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // ------------------------
  // Secondary storage (Upstash Redis)
  // ------------------------
  secondaryStorage: {
    // must be async, Better Auth expects Promise-like
    get: async (key) => {
      // Upstash returns null or the stored JSON/string
      return redis.get(key);
    },
    set: async (key, value, ttlSeconds) => {
      if (ttlSeconds && ttlSeconds > 0) {
        await redis.set(key, value, { ex: ttlSeconds });
      } else {
        await redis.set(key, value);
      }
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },
  // ------------------------
  // Rate limiting via Upstash secondary storage
  // ------------------------
  rateLimit: {
    //enabled: process.env.NODE_ENV === "production",
    //enabled: !!process.env.UPSTASH_REDIS_REST_URL,
    enabled: true, // 👈 force ON while debugging

    // global fallback window/max (seconds & requests)
    window: 60,
    max: 100,

    // use our Redis-based secondaryStorage instead of DB
    storage: "secondary-storage",

    // fine-grained per-route rules
    customRules: {
      // stricter login attempts
      "/sign-in/email": {
        window: 60, // 1 minute
        max: 5, // 5 attempts per IP per minute
      },
      "/sign-up/email": {
        window: 60,
        max: 3,
      },
      // allow get-session to be freely called (no rate limit)
      "/get-session": false,
    },
  },

  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip", "cf-connecting-ip"],
      fallbackIP:
        process.env.NODE_ENV === "development" ? "127.0.0.1" : undefined,
    },
    database: {
      generateId: false,
    },
  },

  socialProviders: {
    google: {
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    },
    github: {
      clientId: String(process.env.GITHUB_CLIENT_ID),
      clientSecret: String(process.env.GITHUB_CLIENT_SECRET),
    },
  },
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
  account: {
    accountLinking: {
      enabled: false,
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
