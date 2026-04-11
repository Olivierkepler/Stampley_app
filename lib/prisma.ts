import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import type { PoolConfig } from "pg";

/** Aligns root `@types/pg` with `@prisma/adapter-pg`'s nested `pg` types. */
type PrismaPgPoolArg = ConstructorParameters<typeof PrismaPg>[0];

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * AWS RDS: TLS is enabled via the Pool `ssl` option below.
 *
 * Do **not** leave `sslmode=require` in the URL on recent `pg` / `pg-connection-string`:
 * those treat `require` like `verify-full`, which fails with
 * "self-signed certificate in certificate chain" unless you install the RDS CA.
 * Stripping `sslmode` lets `ssl: { rejectUnauthorized: false }` apply.
 *
 * Set `DATABASE_SSL_REJECT_UNAUTHORIZED=true` only after you configure the RDS CA bundle.
 */
function prepareConnectionString(raw: string): string {
  const dsn = raw.trim();
  if (!dsn.includes("rds.amazonaws.com")) return dsn;

  const q = dsn.indexOf("?");
  if (q === -1) return dsn;

  const base = dsn.slice(0, q);
  const params = new URLSearchParams(dsn.slice(q + 1));
  params.delete("sslmode");
  const rest = params.toString();
  return rest ? `${base}?${rest}` : base;
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
