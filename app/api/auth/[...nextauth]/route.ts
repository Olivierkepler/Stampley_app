import { handlers } from "@/lib/auth";

/** Credentials + Prisma + bcrypt must run on Node (not Edge). */
export const runtime = "nodejs";

/** Avoid static caching of auth responses on CDNs / hosting layers. */
export const dynamic = "force-dynamic";

export const { GET, POST } = handlers;
