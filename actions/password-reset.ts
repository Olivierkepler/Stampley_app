"use server";

import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/app-url";
import { sendPasswordResetEmail } from "@/lib/mail";
import { PASSWORD_RESET_REQUEST_MESSAGE } from "@/lib/password-reset-copy";
import { hashResetToken } from "@/lib/password-reset-token";

const RESET_TOKEN_EXPIRY_HOURS = 1;

function normalizeEmail(raw: unknown): string {
  return String(raw ?? "")
    .trim()
    .toLowerCase();
}

export async function requestPasswordReset(formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  if (!email) {
    return { error: "Please enter your email address." };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { success: true as const, message: PASSWORD_RESET_REQUEST_MESSAGE };
  }

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const rawToken = randomBytes(32).toString("base64url");
  const tokenHash = hashResetToken(rawToken);
  const expiresAt = new Date(
    Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
  );

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  const resetUrl = `${getAppUrl()}/reset-password?token=${encodeURIComponent(rawToken)}`;

  try {
    await sendPasswordResetEmail({ to: user.email, resetUrl });
  } catch (err) {
    console.error("[password-reset] send email failed:", err);
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    return {
      error:
        "We could not send the email right now. Please try again in a few minutes, or contact support if the problem continues.",
    };
  }

  return { success: true as const, message: PASSWORD_RESET_REQUEST_MESSAGE };
}

export async function resetPasswordWithToken(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!token) {
    return { error: "This reset link is invalid. Request a new password reset." };
  }
  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters.",
    };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  const tokenHash = hashResetToken(token);

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!record || record.expiresAt < new Date()) {
    return {
      error:
        "This reset link is invalid or has expired. Please request a new password reset.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.deleteMany({
      where: { userId: record.userId },
    }),
  ]);

  return { success: true as const };
}
