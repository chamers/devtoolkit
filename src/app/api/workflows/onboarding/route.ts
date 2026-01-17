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

// --- Adjusted for Upstash Free Tier (Max Delay 604800s / 7 Days) ---
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const INITIAL_WAIT = 2 * ONE_DAY_IN_MS; // Wait 2 days before first nudge
const LOOP_WAIT = 4 * ONE_DAY_IN_MS; // Nudge every 4 days
const MAX_ITERATIONS = 5; // Total sequence length: ~22 days

export const { POST } = serve<InitialData>(async (context) => {
  const { email, name } = context.requestPayload;

  // 1. Immediate welcome email
  await context.run("new-signup", async () => {
    await sendEmailViaQStash({
      email,
      subject: "Welcome to DevToolkit!",
      html: `Hi ${name}, welcome to the platform! We're excited to have you.`,
    });
  });

  // 2. Initial grace period (Stay under 7 days)
  await context.sleep("initial-wait-period", INITIAL_WAIT);

  // 3. Engagement loop
  let iteration = 1;

  while (iteration <= MAX_ITERATIONS) {
    // Determine user status
    const state = await context.run(
      `check-status-step-${iteration}`,
      async () => {
        const user = await prisma.user.findUnique({
          where: { email },
          select: { lastActivityDate: true },
        });

        if (!user?.lastActivityDate) return "dormant";

        const diff = Date.now() - user.lastActivityDate.getTime();

        // If active in the last 3 days
        if (diff <= 3 * ONE_DAY_IN_MS) return "active";
        // If inactive for more than 3 but less than 10
        if (diff <= 10 * ONE_DAY_IN_MS) return "slipping";
        return "dormant";
      }
    );

    // Send targeted email based on state
    await context.run(`send-email-step-${iteration}`, async () => {
      const emailContent = {
        active: {
          subject: "Keep it up!",
          body: `Hi ${name}, we love seeing your progress on DevToolkit. Check out the new dashboard features!`,
        },
        slipping: {
          subject: "We miss you!",
          body: `Hi ${name}, it's been a few days. Need a hand getting back into your workflow?`,
        },
        dormant: {
          subject: "Still there?",
          body: `Hi ${name}, DevToolkit has some new updates you might have missed since your last visit.`,
        },
      }[state as "active" | "slipping" | "dormant"];

      await sendEmailViaQStash({
        email,
        subject: emailContent.subject,
        html: emailContent.body,
      });
    });

    // 4. Wait for the next check (Stay under 7 days)
    await context.sleep(`wait-step-${iteration}`, LOOP_WAIT);

    iteration++;
  }
});
