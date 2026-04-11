import { handlers } from "@/lib/auth";

/** Credentials + Prisma + bcrypt must run on Node (not Edge). */
export const runtime = "nodejs";

export const { GET, POST } = handlers;
