import {config} from "dotenv";

config({path : "../../.env"})

function requireEnvVar(key : string) : string{
    const value = process.env[key];
    if(!value) throw new Error(`Missing required env variable ${key}`);
    return value;
}

export const env = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv : process.env.NODE_ENV || "development",
    github: {
        appId : requireEnvVar("GITHUB_APP_ID"),
        privateKey : requireEnvVar("GITHUB_PRIVATE_KEY").replace(/\\n/g, "\n"),
        webhookSecret : requireEnvVar("GITHUB_WEBHOOK_SECRET"),
        clientId : requireEnvVar("GITHUB_CLIENT_ID"),
        clientSecret : requireEnvVar("GITHUB_CLIENT_SECRET")
    },
    redis:{
        url : process.env.REDIS_URL
    },
    dbUrl : process.env.DATABASE_URL
} as const