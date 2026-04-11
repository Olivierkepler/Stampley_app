import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import type { PoolConfig } from "pg";

/** Aligns root `@types/pg` with `@prisma/adapter-pg`'s nested `pg` types. */
type PrismaPgPoolArg = ConstructorParameters<typeof PrismaPg>[0];

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * AWS RDS (and many managed Postgres hosts) require TLS. The `pg` driver does
 * not always infer SSL from the connection string alone; missing TLS can
 * surface as connection failures or, in some setups, Prisma P1010 ("denied
 * access on the database") when the server rejects the session.
 *
 * Append `sslmode=require` when missing, and pass explicit `ssl` for RDS hosts.
 * Set `DATABASE_SSL_REJECT_UNAUTHORIZED=true` after configuring the RDS CA
 * bundle for strict certificate verification.
 */
function prepareConnectionString(raw: string): string {
  const trimmed = raw.trim();
  const isRds = trimmed.includes("rds.amazonaws.com");
  if (!isRds) return trimmed;
  if (/[?&]sslmode=/i.test(trimmed)) return trimmed;
  return trimmed.includes("?")
    ? `${trimmed}&sslmode=require`
    : `${trimmed}?sslmode=require`;
}

function buildPoolConfig(): PoolConfig {
  const raw = process.env.DATABASE_URL;
  if (!raw?.trim()) {
    throw new Error("DATABASE_URL must be set to use Prisma");
  }
  const connectionString = prepareConnectionString(raw);
  const isRds = raw.includes("rds.amazonaws.com");

  return {
    connectionString,
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idleTimeoutMillis: Number(process.env.DATABASE_POOL_IDLE_MS ?? 20_000),
    ...(isRds
      ? {
          ssl: {
            rejectUnauthorized:
              process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true",
          },
        }
      : {}),
  };
}

function createPrismaClient() {
  const adapter = new PrismaPg(buildPoolConfig() as PrismaPgPoolArg);
  const client = new PrismaClient({ adapter });

  const passwordResetTokenDelegate = (client as any).passwordResetToken;
  if (typeof passwordResetTokenDelegate?.deleteMany !== "function") {
    throw new Error(
      "Prisma Client is out of date or incorrectly bundled (passwordResetToken missing). Run `npx prisma generate`, then restart `next dev`."
    );
  }

  return client;
}

/**
 * In development, avoid caching on `globalThis` so a hot reload of this module
 * picks up a fresh client after `prisma generate`. Production keeps a singleton
 * client to limit connection churn on serverless hosts.
 */
export const prisma =
  process.env.NODE_ENV === "production"
    ? (globalForPrisma.prisma ??= createPrismaClient())
    : createPrismaClient();
