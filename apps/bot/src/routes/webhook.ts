import { Context } from "hono";
import { error } from "node:console";

export async function webhookRoute(c : Context){
    const rawBody = await c.req.text();
    const event = c.req.header("x-github-event")
    const delivery = c.req.header("x-github-delivery");

    let payload : Record<string, unknown>;
    try{
        payload = JSON.parse(rawBody);
    }catch{
        return c.json({error : "Invalid JSON"}, 400);
    }

    console.log(`Event : ${event}`)
    console.log(`Delivery : ${delivery}`)
    console.log(`Action : ${payload.action}`);

    if(event === "pull_request" && payload.pull_request){
        const pr = payload.pull_request as Record<string,unknown>
        const repo = payload.repository as Record<string,unknown>
        console.log(`PR #${pr.number} : ${pr.title}`);
        console.log(`Repo : ${repo.full_name}`);
        console.log(`Author : ${(pr.user as Record<string,unknown>).login}`)
        console.log(`URL : ${pr.html_url}`)
    }

    return c.json({ok : true}, 200)
}