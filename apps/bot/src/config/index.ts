import {config} from "dotenv";
import {z} from "zod"

config({path : "../../.env"})

const envSchema = z.object({
    PORT : z.string().default("3000"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    GITHUB_APP_ID : z.string(),
    GITHUB_PRIVATE_KEY: z.string(),
    GITHUB_WEBHOOK_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    REDIS_URL: z.string().default("redis://localhost:6379"),
    DATABASE_URL: z.string().optional()
})

const parsed = envSchema.safeParse(process.env)

if(!parsed.success){
    console.error("Invalid environment variables:", z.treeifyError(parsed.error));
    process.exit(1)
}

const data = parsed.data

export const env = {
    port: Number(data.PORT) || 3000,
    nodeEnv : data.NODE_ENV,
    github: {
        appId : data.GITHUB_APP_ID,
        privateKey : data.GITHUB_PRIVATE_KEY.replace(/\\n/g, "\n"),
        webhookSecret : data.GITHUB_WEBHOOK_SECRET,
        clientId : data.GITHUB_CLIENT_ID,
        clientSecret : data.GITHUB_CLIENT_SECRET
    },
    redisUrl: data.REDIS_URL,
    dbUrl : data.DATABASE_URL
} as const

export type Env = typeof env