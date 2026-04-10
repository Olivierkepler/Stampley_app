/**
 * Canonical site origin for absolute URLs (e.g. password reset links).
 * Prefer AUTH_URL in production; Vercel sets VERCEL_URL automatically.
 */
export function getAppUrl(): string {
  const explicit =
    process.env.AUTH_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.startsWith("http") ? vercel : `https://${vercel}`;
    return host.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}
