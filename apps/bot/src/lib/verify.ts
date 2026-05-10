import crypto from "crypto";

/**
 * Verifies that the webhook payload sent by Github only
 *
 * Github signs every payload using HMAC-SHA256 with our webhook secret
 * We recompute the signature and compare, if they match - it's real
 */

export function verifyGithubSignature(
  rawBody: string,
  signature: string | undefined,
  secret: string,
): boolean {
  if (!signature) return false;

  // Github sends signature as "sha256=<hex_hash>"
  const expectedSignature =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  } catch {
    return false;
  }
}
