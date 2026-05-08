
export const QUEUE_NAMES = {
    REVIEW : "review"
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES]