import { serve } from "@upstash/workflow/nextjs";
import prisma from "@/db";
import { sendEmailViaQStash } from "@/lib/workflow";

type InitialData = {
  email: string;
  name: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

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

  // 2) Initial grace period
  await context.sleep("initial-wait", 7 * ONE_DAY_IN_MS);

  // 3) Ongoing engagement loop
  let iteration = 1; // Used to create unique step IDs

  while (true) {
    // We fetch the state inside context.run with a UNIQUE ID per loop
    const state = await context.run(`check-state-i${iteration}`, async () => {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { lastActivityDate: true },
      });

      if (!user?.lastActivityDate) return "dormant";

      const diff = Date.now() - user.lastActivityDate.getTime();
      const SEVEN_DAYS = 7 * ONE_DAY_IN_MS;
      const THIRTY_DAYS = 30 * ONE_DAY_IN_MS;

      if (diff <= SEVEN_DAYS) return "active";
      if (diff <= THIRTY_DAYS) return "slipping";
      return "dormant";
    });

    // 4) Send email based on state with a UNIQUE ID
    await context.run(`send-email-i${iteration}`, async () => {
      const content = {
        active: {
          sub: "Keep it up!",
          body: `Hi ${name}, you're doing great...`,
        },
        slipping: { sub: "We miss you", body: `Hi ${name}, need any help?` },
        dormant: {
          sub: "Still there?",
          body: `Hi ${name}, it's been a while...`,
        },
      }[state as "active" | "slipping" | "dormant"];

      await sendEmailViaQStash({
        email,
        subject: content.sub,
        html: content.body,
      });
    });

    // 5) Wait before next check with a UNIQUE ID
    await context.sleep(`wait-interval-i${iteration}`, 14 * ONE_DAY_IN_MS);

    iteration++; // Increment so next loop has unique IDs
  }
});
