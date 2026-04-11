import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { baseAuthConfig, resolveAuthSecret } from "./auth.config";

/**
 * Do not import `./prisma` at module scope: loading Prisma/pg on every auth route
 * (e.g. GET /api/auth/session, /api/auth/providers) can throw on Amplify if the DB
 * pool or TLS misconfigures before credentials sign-in. Prisma is loaded only
 * inside `authorize`.
 */

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...baseAuthConfig,
  secret: resolveAuthSecret(),
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);
        if (!email || !password) return null;

        try {
          const { prisma } = await import("./prisma");
          const user = await prisma.user.findFirst({
            where: {
              email: { equals: email, mode: "insensitive" },
            },
          });

          if (!user || !user.password) return null;
          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email?.trim().toLowerCase() ?? email,
            role: user.role,
          };
        } catch (e) {
          console.error("[auth] authorize failed:", e);
          return null;
        }
      },
    }),
  ],
});
