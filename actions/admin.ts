"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function generateStudyKey() {
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
  const newKey = `AIDES-${randomChars}`;

  try {
    await prisma.studyKey.create({
      data: {
        key: newKey,
        isUsed: false,
      },
    });

    revalidatePath("/admin/keys");
    return { success: true, key: newKey };
  } catch {
    return { success: false, message: "Key already exists, try again." };
  }
}

export async function deleteStudyKey(id: string): Promise<void> {
  const record = await prisma.studyKey.findUnique({ where: { id } });

  if (!record) {
    throw new Error("Study key not found.");
  }

  if (record.isUsed) {
    throw new Error(
      "Cannot remove a key that is already assigned to a participant."
    );
  }

  await prisma.studyKey.delete({ where: { id } });
  revalidatePath("/admin/keys");
}
