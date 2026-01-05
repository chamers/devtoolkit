import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient, resend } from "@upstash/qstash";
import config from "@/lib/config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const qstashClient = new QStashClient({
  token: config.env.upstash.qstashToken,
});

export async function sendEmailViaQStash(opts: {
  email: string;
  subject: string;
  html: string;
}) {
  try {
    return await qstashClient.publishJSON({
      api: {
        name: "email",
        provider: resend({ token: config.env.resendToken }),
      },
      body: {
        // ✅ match your verified sending domain (subdomain)
        from: "DevToolkit <no-reply@hello.devtoolkit.tech>",
        to: [opts.email],
        subject: opts.subject,
        html: opts.html,
      },
    });
  } catch (err) {
    // In production you *want* this logged
    console.error("[qstash] failed to publish email job:", err);
    throw err; // optional: keep throw so caller can decide; hooks already catch
  }
}
