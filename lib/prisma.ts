import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url?.trim()) {
    throw new Error("DATABASE_URL must be set to use Prisma");
  }
  const adapter = new PrismaPg({ connectionString: url });
  const client = new PrismaClient({ adapter });

  // Prisma exposes CRUD delegates for the model named in the schema.
  // The model is `PasswordResetToken` => delegate is `prisma.passwordResetToken`.
  const passwordResetTokenDelegate = (client as any).passwordResetToken;
  if (
    typeof passwordResetTokenDelegate?.deleteMany !== "function"
  ) {
    throw new Error(
      "Prisma Client is out of date or incorrectly bundled (passwordResetToken missing). Run `npx prisma generate`, then restart `next dev`."
    );
  }

  return client;
}

/**
 * In development, avoid caching on `globalThis` so a hot reload of this module
 * picks up a fresh client after `prisma generate`. Otherwise `prisma.passwordResetToken`
 * (and other new delegates) can stay undefined until a full `next dev` restart.
 * Production keeps a singleton to limit connection churn.
 */
export const prisma =
  process.env.NODE_ENV === "production"
    ? (globalForPrisma.prisma ??= createPrismaClient())
    : createPrismaClient();
