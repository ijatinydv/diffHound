import { z } from "zod";

const GithubUserSchema = z.object({
  login: z.string(),
  id: z.number(),
});

const GithubRepoSchema = z.object({
  full_name: z.string(),
  id: z.number(),
});

const GithubRefSchema = z.object({
  sha: z.string(),
  ref: z.string(),
});

const PullRequestSchema = z.object({
  number: z.number(),
  title: z.string(),
  html_url: z.string(),
  user: GithubUserSchema,
  base: GithubRefSchema,
  head: GithubRefSchema,
});

const InstallationSchema = z.object({
  id: z.number(),
});

export const PRWebhookPayloadSchema = z.object({
  action: z.enum([
    "opened",
    "closed",
    "synchronize",
    "reopened",
    "edited",
    "labeled",
    "unlabeled",
    "assigned",
    "unassigned",
    "review_requested",
    "review_request_removed",
    "ready_for_review",
    "converted_to_draft",
    "locked",
    "unlocked",
  ]),
  pull_request: PullRequestSchema,
  repository: GithubRepoSchema,
  installation: InstallationSchema,
  sender: GithubUserSchema,
});

export type PRWebhookPayload = z.infer<typeof PRWebhookPayloadSchema>;
