/**
 * One-off: create an unused StudyKey (AIDES-XXXXXX) and print it for registration.
 *
 * Run from repo root.
 */
import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";

loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

function randomAidSegment(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

void (async () => {
  const { prisma } = await import("../lib/prisma");

  const maxAttempts = 10;
  try {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const key = `AIDES-${randomAidSegment()}`;
      try {
        await prisma.studyKey.create({
          data: {
            key,
            isUsed: false,
          },
        });
        console.log("");
        console.log("Study key created (unused). Use this when registering:");
        console.log(key);
        console.log("");
        return;
      } catch {
        // P2002 unique collision — try another random segment
      }
    }
    console.error("Failed to generate a unique key after several attempts.");
    process.exitCode = 1;
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
