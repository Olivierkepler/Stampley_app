import { createHash } from "crypto";

/** Store only hashes in the database; the raw token is sent once in email. */
export function hashResetToken(rawToken: string): string {
  return createHash("sha256").update(rawToken, "utf8").digest("hex");
}
