/**
 * Create a User with role ADMIN (bcrypt password). Run from repo root.
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts <email> [password]
 *
 * If password is omitted, a random one is generated and printed once.
 *
 * Example:
 *   npx tsx scripts/create-admin.ts admin@yourdomain.com "MyLongSecurePass1!"
 */
import { randomBytes } from "node:crypto";
import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";

loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

function randomPassword(): string {
  return randomBytes(16).toString("base64url");
}

void (async () => {
  const { prisma } = await import("../lib/prisma");
  const bcrypt = await import("bcryptjs");

  try {
    const emailArg = process.argv[2];
    const passwordArg = process.argv[3];

    if (!emailArg?.trim()) {
      console.error(
        "Usage: npx tsx scripts/create-admin.ts <email> [password]\n" +
          "  If password is omitted, a random password is generated."
      );
      process.exitCode = 1;
      return;
    }

    const email = emailArg.trim().toLowerCase();
    const plainPassword = passwordArg?.trim() || randomPassword();

    const existing = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    if (existing) {
      console.error(
        `A user with email "${email}" already exists (id: ${existing.id}, role: ${existing.role}).\n` +
          "Use Admin → Users to change role/password, or pick a different email."
      );
      process.exitCode = 1;
      return;
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("");
    console.log("Admin user created.");
    console.log("  Sign in at: /admin/login");
    console.log("");
    console.log("  Email:    ", email);
    console.log("  Password: ", plainPassword);
    console.log("");
    if (!passwordArg?.trim()) {
      console.log("(Save this password now — it will not be shown again.)");
      console.log("");
    }
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
