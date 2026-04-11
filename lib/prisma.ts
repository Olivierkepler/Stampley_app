import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import type { PoolConfig } from "pg";

/** Aligns root `@types/pg` with `@prisma/adapter-pg`'s nested `pg` types. */
type PrismaPgPoolArg = ConstructorParameters<typeof PrismaPg>[0];

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * AWS RDS (`DATABASE_URL` contains `rds.amazonaws.com`):
 * - Enable TLS via Pool `ssl` (see `buildPoolConfig` below).
 * - Default: `ssl: { rejectUnauthorized: false }` so Node accepts the RDS chain
 *   without bundling the Amazon RDS CA (typical for Amplify / serverless).
 * - Set `DATABASE_SSL_REJECT_UNAUTHORIZED=true` only after you configure strict
 *   certificate verification (RDS CA bundle).
 *
 * Also strip `sslmode` from the URL: recent `pg` / `pg-connection-string` treats
 * `sslmode=require` like `verify-full`, which can cause TLS errors without the CA.
 */
/** Remove `sslmode` from the query string without re-encoding (safer than URLSearchParams for odd passwords). */
function stripSslModeQueryParam(dsn: string): string {
  return dsn
    .replace(/([?&])sslmode=[^&#]*/gi, "$1")
    .replace(/\?&+/g, "?")
    .replace(/&&+/g, "&")
    .replace(/[?&]$/g, "");
}

function prepareConnectionString(raw: string): string {
  const dsn = raw.trim();
  if (!dsn.includes("rds.amazonaws.com")) return dsn;
  if (!/[?&]sslmode=/i.test(dsn)) return dsn;
  return stripSslModeQueryParam(dsn);
}

function buildPoolConfig(): PoolConfig {
  const raw = process.env.DATABASE_URL;
  if (!raw?.trim()) {
    throw new Error("DATABASE_URL must be set to use Prisma");
  }
  const connectionString = prepareConnectionString(raw);
  const isRds = raw.includes("rds.amazonaws.com");

  /** `false` unless `DATABASE_SSL_REJECT_UNAUTHORIZED` is exactly `"true"`. */
  const rejectUnauthorized =
    process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true";

  return {
    connectionString,
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idleTimeoutMillis: Number(process.env.DATABASE_POOL_IDLE_MS ?? 20_000),
    ...(isRds
      ? {
          ssl: {
            // RDS: default is do not reject (equivalent to rejectUnauthorized: false)
            rejectUnauthorized,
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
