import { serve } from "@upstash/workflow/nextjs";
import prisma from "@/db";
import { sendEmailViaQStash } from "@/lib/workflow";

type UserState = "active" | "slipping" | "dormant";

type InitialData = {
  email: string;
  name: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const SEVEN_DAYS_IN_MS = 7 * ONE_DAY_IN_MS;
const THIRTY_DAYS_IN_MS = 30 * ONE_DAY_IN_MS;

/**
 * active   = activity within the last 7 days
 * slipping = inactive for > 7 days and <= 30 days
 * dormant  = inactive for > 30 days (or never active)
 */
const getUserState = async (email: string): Promise<UserState> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { lastActivityDate: true },
  });

  // No activity recorded → dormant
  if (!user?.lastActivityDate) return "dormant";

  const now = Date.now();
  const last = user.lastActivityDate.getTime();
  const diff = now - last;

  if (diff <= SEVEN_DAYS_IN_MS) return "active";
  if (diff <= THIRTY_DAYS_IN_MS) return "slipping";
  return "dormant";
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, name } = context.requestPayload;

  // 1) Immediate welcome email
  await context.run("new-signup", async () => {
    await sendEmailViaQStash({
      email,
      subject: "Welcome to DevToolkit",
      html: `Welcome ${name}!`,
    });
  });

  // 2) Let them breathe before any nudges
  await context.sleep("wait-for-7-days", 7 * ONE_DAY_IN_MS);

  // 3) Ongoing engagement loop
  while (true) {
    const state = await context.run("check-user-state", async () => {
      return getUserState(email);
    });

    if (state === "active") {
      await context.run("send-active-newsletter", async () => {
        await sendEmailViaQStash({
          email,
          subject: "DevToolkit updates you’ll like",
          html: `Hi ${name}, great to see you again! 🎉  
We’ve added new tools, resources, and improvements since your last visit.`,
        });
      });

      // Active users → low noise
      await context.sleep("wait-30-days-active", THIRTY_DAYS_IN_MS);
      continue;
    }

    if (state === "slipping") {
      await context.run("send-slipping-nudge", async () => {
        await sendEmailViaQStash({
          email,
          subject: "Need a hand getting started?",
          html: `Hi ${name}, just checking in — want a quick tour of what’s new in DevToolkit?`,
        });
      });

      // Slipping users → check back sooner
      await context.sleep("wait-14-days-slipping", 14 * ONE_DAY_IN_MS);
      continue;
    }

    // dormant
    await context.run("send-dormant-reengagement", async () => {
      await sendEmailViaQStash({
        email,
        subject: "We saved your spot 👋",
        html: `Hi ${name}, it’s been a while — DevToolkit has grown a lot since your last visit.`,
      });
    });

    // Dormant users → minimal frequency
    await context.sleep("wait-30-days-dormant", THIRTY_DAYS_IN_MS);
  }
});
