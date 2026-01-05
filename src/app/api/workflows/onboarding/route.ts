import { serve } from "@upstash/workflow/nextjs";
import prisma from "@/db";
import { sendEmailViaQStash } from "@/lib/workflow";

type UserState = "non-active" | "active";

type InitialData = {
  email: string;
  name: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAYS_IN_MS = 30 * ONE_DAY_IN_MS;

const getUserState = async (email: string): Promise<UserState> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { lastActivityDate: true },
  });

  // No user = never active in the app
  if (!user || !user.lastActivityDate) {
    return "non-active";
  }

  const lastActivityDate = user.lastActivityDate;
  const now = new Date();
  const timeDifference = now.getTime() - lastActivityDate.getTime();

  if (
    timeDifference > THREE_DAYS_IN_MS &&
    timeDifference <= THIRTY_DAYS_IN_MS
  ) {
    return "non-active";
  }

  return "active";
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, name } = context.requestPayload;

  // 1. Welcome Email
  await context.run("new-signup", async () => {
    await sendEmailViaQStash({
      email,
      subject: "Welcome to the platform",
      html: `Welcome ${name}!`,
    });
  });
  // 2. Wait 3 days
  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  // 3. Monthly checks
  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmailViaQStash({
          email,
          subject: "Are you still there?",
          html: `Hey ${name}, we miss you!`,
        });
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmailViaQStash({
          email,
          subject: "Newsletter - Welcome back!",
          html: `Hi ${name}, great to see you again! 🎉  
We've just released fresh updates, hand-picked resources, and new features we think you'll love.  
Grab a coffee and dive into what's new!`,
        });
      });
    }

    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});
