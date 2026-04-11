/**
 * `sanitizeAuthCallbackUrl(raw, currentOrigin)`
 *
 * Used when NextAuth adds `callbackUrl` on `/login`. If `raw` is an absolute URL
 * whose origin differs from `currentOrigin` (e.g. `https://localhost:3000/...`),
 * return `null` so the caller can strip it. Same-origin absolutes become a path.
 * Relative paths starting with `/` are returned as-is.
 */
export function sanitizeAuthCallbackUrl(
  raw: string | null,
  currentOrigin: string
): string | null {
  if (!raw?.trim()) return null;
  const value = raw.trim();
  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  try {
    const u = new URL(value);
    if (u.origin === currentOrigin) {
      return `${u.pathname}${u.search}${u.hash}` || "/dashboard";
    }
    return null;
  } catch {
    return null;
  }
}
