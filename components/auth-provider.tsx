"use client";

import { SessionProvider, __NEXTAUTH } from "next-auth/react";
import { useLayoutEffect } from "react";

/**
 * NextAuth v5 inlines `process.env.NEXTAUTH_URL` into `__NEXTAUTH` at build time.
 * On Amplify, if that var is missing during `next build`, the client defaults to
 * `http://localhost:3000`, which breaks sign-in and produces `callbackUrl=...localhost...`.
 * Patch to the real browser origin before any child runs session/auth calls.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const origin = window.location.origin;
    __NEXTAUTH.baseUrl = origin;
    __NEXTAUTH.baseUrlServer = origin;
    __NEXTAUTH.basePath = "/api/auth";
    __NEXTAUTH.basePathServer = "/api/auth";
  }, []);

  return <SessionProvider basePath="/api/auth">{children}</SessionProvider>;
}
