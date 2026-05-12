import { Worker, Job } from "bullmq";
import { createRedisConnection } from "../lib/redis";
import { REVIEW_QUEUE_NAME } from "../queues/review.queue";
import { PREvent } from "@diffhound/types";

/**
 * The worker listen on the same queue name and processes
 * one job at a time (concurrency: 1 for now)
 */
export function startReviewWorker(): Worker {
  const worker = new Worker<PREvent>(
    REVIEW_QUEUE_NAME,
    async (job: Job<PREvent>) => {
      try {
        console.log(`Processing job ${job.id} - PR ${job.data.prNumber}`);

        // To Do - review logic
        console.log(`Job ${job.id} done✅`);
      } catch (err) {
        console.log("Error occured in jobId : ", err);
        throw err;
      }
    },{
        connection: createRedisConnection(),
        concurrency: 1
    }
  );
  worker.on("failed", (job, err)=>{
    console.error(`❌ Job ${job?.id} is failed, ${err.message}`)
  })
  worker.on("error", (err)=>{
    console.error(`Worker Error : ${err}`)
  })
  return worker;
}
