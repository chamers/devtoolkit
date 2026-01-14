import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin, magicLink } from "better-auth/plugins";
import prisma from "@/db";
import { ac, roles } from "./permissions";
import { redis } from "@/lib/redis";
import { Role } from "@prisma/client";
import { sendEmailViaQStash } from "@/lib/workflow";

// Small helpers to keep email templates tidy
function verifyEmailHtml(url: string) {
  return `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system; line-height: 1.5;">
      <h2>Verify your email</h2>
      <p>Click the button below to verify your email for <strong>DevToolkit</strong>.</p>
      <p>
        <a href="${url}" style="display:inline-block;padding:10px 14px;border-radius:8px;text-decoration:none;border:1px solid #ccc;">
          Verify email
        </a>
      </p>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    </div>
  `;
}

function resetPasswordHtml(url: string) {
  return `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system; line-height: 1.5;">
      <h2>Reset your password</h2>
      <p>Click the button below to reset your DevToolkit password.</p>
      <p>
        <a href="${url}" style="display:inline-block;padding:10px 14px;border-radius:8px;text-decoration:none;border:1px solid #ccc;">
          Reset password
        </a>
      </p>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    </div>
  `;
}

export const auth = betterAuth({
  appName: "DevToolkit",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // ------------------------
  // Secondary storage (Upstash Redis)
  // ------------------------
  secondaryStorage: {
    get: async (key) => {
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
    enabled: true,
    window: 60,
    max: 100,
    storage: "secondary-storage",
    customRules: {
      "/sign-in/email": {
        window: 60,
        max: 5,
      },
      "/sign-up/email": {
        window: 60,
        max: 3,
      },
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

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log("[verify] sendVerificationEmail called for:", user.email);
      await sendEmailViaQStash({
        email: user.email,
        subject: "Verify your email for DevToolkit",
        html: verifyEmailHtml(url),
      }).catch((err) => {
        console.error("[verify] failed to queue verification email:", err);
      });
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmailViaQStash({
        email: user.email,
        subject: "Reset your DevToolkit password",
        html: resetPasswordHtml(url),
      }).catch((err) => {
        console.error("[reset] failed to queue reset email:", err);
      });
    },
    onPasswordReset: async ({ user }, request) => {
      console.log(`[reset] Password reset for ${user.email}`);
    },
  },

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
    updateAge: 60 * 60 * 24, // refresh once per day
  },

  account: {
    accountLinking: {
      enabled: false,
    },
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // 2. Use your existing QStash/Resend setup
        await sendEmailViaQStash({
          email: email,
          subject: "Your Magic Link for DevToolkit",
          html: `Click here to sign in: <a href="${url}">Sign In</a>`,
        });
      },
    }),
    admin({
      defaultRole: Role.USER,
      adminRoles: [Role.ADMIN, Role.MODERATOR, Role.EDITOR],
      ac,
      roles,
    }),

    nextCookies(),
  ],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES;
