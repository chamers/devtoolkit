// import { serve } from "@upstash/workflow/nextjs";
// import prisma from "@/db";
// import { sendEmailViaQStash } from "@/lib/workflow";

// type InitialData = {
//   email: string;
//   name: string;
// };

// const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

// export const { POST } = serve<InitialData>(async (context) => {
//   const { email, name } = context.requestPayload;

//   // 1) Immediate welcome email
//   await context.run("new-signup", async () => {
//     await sendEmailViaQStash({
//       email,
//       subject: "Welcome to DevToolkit",
//       html: `Welcome ${name}!`,
//     });
//   });

//   // 2) Initial grace period
//   await context.sleep("initial-wait", 7 * ONE_DAY_IN_MS);

//   // 3) Ongoing engagement loop
//   let iteration = 1; // Used to create unique step IDs

//   while (true) {
//     // We fetch the state inside context.run with a UNIQUE ID per loop
//     const state = await context.run(`check-state-i${iteration}`, async () => {
//       const user = await prisma.user.findUnique({
//         where: { email },
//         select: { lastActivityDate: true },
//       });

//       if (!user?.lastActivityDate) return "dormant";

//       const diff = Date.now() - user.lastActivityDate.getTime();
//       const SEVEN_DAYS = 7 * ONE_DAY_IN_MS;
//       const THIRTY_DAYS = 30 * ONE_DAY_IN_MS;

//       if (diff <= SEVEN_DAYS) return "active";
//       if (diff <= THIRTY_DAYS) return "slipping";
//       return "dormant";
//     });

//     // 4) Send email based on state with a UNIQUE ID
//     await context.run(`send-email-i${iteration}`, async () => {
//       const content = {
//         active: {
//           sub: "Keep it up!",
//           body: `Hi ${name}, you're doing great...`,
//         },
//         slipping: { sub: "We miss you", body: `Hi ${name}, need any help?` },
//         dormant: {
//           sub: "Still there?",
//           body: `Hi ${name}, it's been a while...`,
//         },
//       }[state as "active" | "slipping" | "dormant"];

//       await sendEmailViaQStash({
//         email,
//         subject: content.sub,
//         html: content.body,
//       });
//     });

//     // 5) Wait before next check with a UNIQUE ID
//     await context.sleep(`wait-interval-i${iteration}`, 14 * ONE_DAY_IN_MS);

//     iteration++; // Increment so next loop has unique IDs
//   }
// });

// src/app/api/workflows/onboarding/route.ts
import { serve } from "@upstash/workflow/nextjs";
import prisma from "@/db";
import { sendEmailViaQStash } from "@/lib/workflow";

type InitialData = {
  email: string;
  name: string;
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, name } = context.requestPayload;

  // 1. Immediate Welcome Email
  await context.run("new-signup", async () => {
    await sendEmailViaQStash({
      email,
      subject: "Welcome to DevToolkit",
      html: `Welcome ${name}! We're glad to have you on board.`,
    });
  });

  // 2. Wait 14 days total (Broken into two 7-day sleeps for Free Tier compliance)
  // Upstash Free Tier limit is 7 days (604800 seconds) per sleep.
  await context.sleep("wait-week-1", 60 * 60 * 24 * 7);
  await context.sleep("wait-week-2", 60 * 60 * 24 * 7);

  // 3. One-time follow-up check
  const state = await context.run("check-user-activity", async () => {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { lastActivityDate: true },
    });

    if (!user?.lastActivityDate) return "non-active";

    const diff = Date.now() - user.lastActivityDate.getTime();
    const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;

    // If they haven't been active in the last 3 days
    return diff > THREE_DAYS_IN_MS ? "non-active" : "active";
  });

  // 4. Send the Follow-up
  if (state === "non-active") {
    await context.run("follow-up-email", async () => {
      await sendEmailViaQStash({
        email,
        subject: "Are you still there?",
        html: `Hey ${name}, we noticed you haven't been around lately. Need any help getting started?`,
      });
    });
  } else {
    await context.run("active-reassurance-email", async () => {
      await sendEmailViaQStash({
        email,
        subject: "You're doing great!",
        html: `Hi ${name}, it's great to see you're finding DevToolkit useful. Keep it up!`,
      });
    });
  }
});
