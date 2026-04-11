"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Required for reliable `signIn` / `signOut` / session sync from client components
 * (NextAuth v5 / Auth.js with App Router).
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
