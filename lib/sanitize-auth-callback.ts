/**
 * NextAuth may put `callbackUrl` on /login after a failed auth redirect.
 * If it points at another origin (e.g. localhost from a dev build), strip it
 * so post-login navigation stays on the current deployment.
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
