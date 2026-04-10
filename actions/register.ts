"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function registerWithKey(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const studyId = formData.get("studyId") as string;

  const keyRecord = await prisma.studyKey.findUnique({
    where: { key: studyId },
  });

  if (!keyRecord || keyRecord.isUsed) {
    return { error: "This Study ID is invalid or has already been used." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.$transaction([
      prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          studyId: studyId,
          role: "PARTICIPANT",
        },
      }),
      prisma.studyKey.update({
        where: { key: studyId },
        data: { isUsed: true },
      }),
    ]);

    return { success: true };
  } catch {
    return { error: "Account creation failed. Email might already be taken." };
  }
}
