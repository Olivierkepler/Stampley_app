// prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config"; // Import 'env' helper

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Prisma 7 recommends the env() helper for type-safety
    url: env("DATABASE_URL"), 
  },
});