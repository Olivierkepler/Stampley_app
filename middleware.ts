/**
 * Edge runtime: imports only `@/lib/auth.config` (no `@/lib/auth`, no `@/lib/prisma`).
 * JWT verification uses `edgeAuth` from that module; credentials live in Node API routes.
 */
import { edgeAuth } from "@/lib/auth.config";

export const middleware = edgeAuth;
export default edgeAuth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin",
    "/admin/:path*",
    "/check-in",
    "/check-in/:path*",
  ],
};
