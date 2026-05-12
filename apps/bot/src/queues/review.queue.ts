import { Queue } from "bullmq";
import { createRedisConnection } from "../lib/redis";
import { PREvent } from "@diffhound/types";

// used to connect webhook and worker
export const REVIEW_QUEUE_NAME = "pr-review";

export const reviewQueue = new Queue<PREvent>(REVIEW_QUEUE_NAME, {
  connection: createRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 200,
  },
});

/**
 * Add a PR review job to queue
 */
export async function enqueueReview(event: PREvent): Promise<void> {
  const job = await reviewQueue.add("review", event, {
    jobId: `${event.repoFullName}-pr-${event.prNumber}-${event.latestCommit}`,
  });
  console.log(`Job enqueued: ${job.id} for PR #${event.prNumber}`);
}
