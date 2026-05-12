import {Redis} from "ioredis"
import { env } from "../config"

/**
 * Creates a new redis connection.
 * BullMQ requires seperate connection for Queue and worker
 */
export function createRedisConnection():Redis{
    const redis = new Redis(env.redisUrl, {
        maxRetriesPerRequest : null,
        enableReadyCheck : false,
        tls: env.redisUrl?.startsWith("rediss://") ? {} : undefined
    })

    redis.on("error", (err) => console.log("Redis error:", err));
    redis.on("connect", () => console.log("Redis connected"))
    return redis;
}