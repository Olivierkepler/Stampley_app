import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * Resolves the Auth.js / NextAuth signing secret at init time for each bundle
 * (Node API routes vs Edge middleware). Supports both v5 (`AUTH_SECRET`) and
 * legacy (`NEXTAUTH_SECRET`) env names used by many hosts including Amplify.
 *
 * In production, both must be set in the deployment environment or session
 * cookies cannot be signed and sign-in ends on `/api/auth/error`.
 */
export function resolveAuthSecret(): string | undefined {
  const fromAuth = process.env.AUTH_SECRET?.trim();
  if (fromAuth) return fromAuth;
  const fromLegacy = process.env.NEXTAUTH_SECRET?.trim();
  if (fromLegacy) return fromLegacy;
  if (process.env.NODE_ENV === "production") return undefined;
  return "local-dev-only-auth-secret-min-32-chars!!";
}

/** Emails that may access `/admin/*` even when DB role is not ADMIN */
const ADMIN_EMAIL_ALLOWLIST = new Set(
  ["olivierkfrancois1@gmail.com"].map((e) => e.toLowerCase())
);

export function canAccessAdminRoutes(
  email: string | null | undefined,
  role: Role | undefined
) {
  if (role === "ADMIN") return true;
  const normalized = email?.toLowerCase();
  return !!normalized && ADMIN_EMAIL_ALLOWLIST.has(normalized);
}

/**
 * Shared Auth.js options (no `secret`, no `providers`).
 * `secret` must be passed separately so it is not flattened by `{...authConfig}`
 * when composing the Credentials provider in `lib/auth.ts`.
 */
export const baseAuthConfig = {
  trustHost: true,
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
        token.id = user.id;
        token.role = user.role;
        if (user.email) token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        if (typeof token.email === "string") {
          session.user.email = token.email;
        }
      }
      return session;
    },
  },
} satisfies Omit<NextAuthConfig, "providers" | "secret">;
