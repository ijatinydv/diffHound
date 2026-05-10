import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { webhookRoute } from "./routes/webhook";
import { env } from "./config/index";

const app = new Hono();

app.post("/webhook", webhookRoute);

app.notFound((c) => c.json({ error: "Not found" }, 404));

serve(
  {
    fetch: app.fetch,
    port: env.port,
  },
  (info) => {
    console.log(`Diffhound bot is running on the port ${info.port}`);
    console.log("waiting for github webhooks..");
  },
);
