import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * Auth.js reads `AUTH_URL` for absolute URLs / CSRF in some deployments.
 * Many hosts still only set `NEXTAUTH_URL` — mirror so both are defined at runtime.
 */
function syncPublicAuthUrls(): void {
  const next = process.env.NEXTAUTH_URL?.trim();
  const auth = process.env.AUTH_URL?.trim();
  if (next && !auth) process.env.AUTH_URL = next;
  if (auth && !next) process.env.NEXTAUTH_URL = auth;
}

syncPublicAuthUrls();

/**
 * Resolves the Auth.js / NextAuth signing secret at init time for each bundle
 * (Node API routes vs Edge middleware). Supports both v5 (`AUTH_SECRET`) and
 * legacy (`NEXTAUTH_SECRET`) env names used by many hosts including Amplify.
 */
export function resolveAuthSecret(): string | undefined {
  const fromAuth = process.env.AUTH_SECRET?.trim();
  if (fromAuth) return fromAuth;
  const fromLegacy = process.env.NEXTAUTH_SECRET?.trim();
  if (fromLegacy) return fromLegacy;
  if (process.env.NODE_ENV === "production") return undefined;
  return "local-dev-only-auth-secret-min-32-chars!!";
}

/** Default admin emails; extend with `ADMIN_EMAIL_ALLOWLIST` (comma-separated). */
function adminEmailAllowlist(): Set<string> {
  const fromEnv =
    process.env.ADMIN_EMAIL_ALLOWLIST?.split(/[,;]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean) ?? [];
  const defaults = ["olivierkfrancois1@gmail.com"].map((e) => e.toLowerCase());
  return new Set([...defaults, ...fromEnv]);
}

export function canAccessAdminRoutes(
  email: string | null | undefined,
  role: Role | string | undefined
) {
  if (String(role) === "ADMIN") return true;
  const normalized = email?.trim().toLowerCase();
  return !!normalized && adminEmailAllowlist().has(normalized);
}

/**
 * Shared Auth.js options (no `secret`, no `providers`).
 * `secret` must be passed separately when composing `NextAuth()` in `lib/auth.ts`
 * and in `middleware.ts`.
 */
export const baseAuthConfig = {
  trustHost: true,
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const nextUrl = request.nextUrl;
      const pathname = nextUrl.pathname;
      const isLoggedIn = !!auth?.user;
      const isAdminLogin =
        pathname === "/admin/login" || pathname.startsWith("/admin/login/");
      const isDashboard = pathname.startsWith("/dashboard");
      const isCheckIn = pathname === "/check-in" || pathname.startsWith("/check-in/");
      const isAdminArea = pathname.startsWith("/admin");
      const role =
        auth?.user && "role" in auth.user ? auth.user.role : undefined;

      if (isAdminLogin) {
        return true;
      }

      if (isDashboard) {
        if (!isLoggedIn) return false;
        return true;
      }

      if (isCheckIn) {
        if (!isLoggedIn) return false;
        return true;
      }

      if (isAdminArea) {
        if (!isLoggedIn) {
          return NextResponse.redirect(new URL("/admin/login", nextUrl));
        }
        if (!canAccessAdminRoutes(auth?.user?.email ?? null, role)) {
          return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.id = user.id;
        token.role = user.role;
        if (user.email) token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub ?? token.id) as string;
        session.user.role = token.role as Role;
        if (typeof token.email === "string") {
          session.user.email = token.email;
        }
      }
      return session;
    },
  },
} satisfies Omit<NextAuthConfig, "providers" | "secret">;
