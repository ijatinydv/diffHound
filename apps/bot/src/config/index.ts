import {config} from "dotenv";

config({path : "../../.env"})

function require(key : string) : string{
    const value = process.env.key;
    if(!value) throw new Error(`Missing required env variable ${key}`);
    return value;
}

export const env = {
    port: process.env.PORT || 3000,
    nodeEnv : process.env.NODE_ENV || "development",
    github: {
        appId : require("GITHUB_APP_ID"),
        privateKey : require("GITHUB_PRIVATE_KEY").replace(/\\n/g, "\n"),
        webhookSecret : require("GITHUB_WEBHOOK_SECRET"),
        clientId : require("GITHUB_CLIENT_ID"),
        clientSecret : require("GITHUB_CLIENT_SECRET")
    },
    redis:{
        url : process.env.REDIS_URL
    },
    dbUrl : process.env.DATABASE_URL
} as const