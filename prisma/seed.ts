import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const ADMIN_EMAIL = "olivierkfrancois1@gmail.com";
/** bcrypt hash for bootstrap password — run seed after deploy; change password in production. */
const ADMIN_PASSWORD_HASH =
  "$2b$10$IZjbIN2q8rEC/xg6oDcaoeiJyuLbPx0U2ADhzU0VT3VTUwSd/7GyK";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url?.trim()) {
    throw new Error("DATABASE_URL is required to seed");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: url }),
  });

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    create: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD_HASH,
      role: "ADMIN",
    },
    update: {
      password: ADMIN_PASSWORD_HASH,
      role: "ADMIN",
    },
  });

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
