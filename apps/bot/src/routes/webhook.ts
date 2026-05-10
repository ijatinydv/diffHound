import { Context } from "hono";
import { verifyGithubSignature } from "../lib/verify";
import { PRWebhookPayloadSchema } from "../lib/schema";
import { env } from "../config";
import { PREvent } from "@diffhound/types";

export async function webhookRoute(c: Context) {
  const rawBody = await c.req.text();

  const signature = c.req.header("x-hub-signature-256");
  const isValid = verifyGithubSignature(
    rawBody,
    signature,
    env.github.webhookSecret,
  );

  if (!isValid) {
    console.warn("Invalid webhook signature");
    return c.json({ error: "Unauthorized" }, 401);
  }

  let rawPayload: unknown;
  try {
    rawPayload = JSON.parse(rawBody);
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const event = c.req.header("x-github-event");
  const delivery = c.req.header("x-github-delivery");

  console.log(`Event : ${event}`);
  console.log(`Delivery : ${delivery}`);

  if (event === "pull_request") {
    await handlePullRequestEvent(rawPayload);
  }

  return c.json({ ok: true }, 200);
}

async function handlePullRequestEvent(rawPayload: unknown): Promise<void> {
  const result = PRWebhookPayloadSchema.safeParse(rawPayload);
  if (!result.success) {
    console.warn("Invalid payload", result.error);
    return;
  }
  const payload = result.data;
  if (payload.action !== "opened" && payload.action !== "synchronize") {
    console.log(`Skipping action : ${payload.action}`);
    return;
  }

  const event: PREvent = {
    installationId: payload.installation.id,
    repoFullName: payload.repository.full_name,
    prNumber: payload.pull_request.number,
    prTitle: payload.pull_request.title,
    baseCommit: payload.pull_request.base.sha,
    latestCommit: payload.pull_request.head.sha,
  };

  console.log(`PR #${event.prNumber} : ${event.prTitle}`);
  console.log(`Repo : ${event.repoFullName}`);
  console.log(`Author : ${payload.pull_request.user.login}`);
}
