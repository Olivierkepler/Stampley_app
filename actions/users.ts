"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { canAccessAdminRoutes } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

/** Matches `enum Role` in `prisma/schema.prisma` (no import from `@prisma/client`). */
type Role = "ADMIN" | "PARTICIPANT";

const ROLES: Role[] = ["ADMIN", "PARTICIPANT"];

function parseRole(input: string | null): Role | null {
  if (!input) return null;
  return ROLES.includes(input as Role) ? (input as Role) : null;
}

export async function createManualUser(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = parseRole(
    typeof formData.get("role") === "string"
      ? (formData.get("role") as string)
      : null
  );

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }
  if (!role) {
    throw new Error("Invalid role.");
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashed,
      role,
    },
  });

  revalidatePath("/admin/users");
}

export async function updateUserRole(
  userId: string,
  newRole: Role
): Promise<void> {
  if (!ROLES.includes(newRole)) {
    throw new Error("Invalid role.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized.");
  }
  if (
    !canAccessAdminRoutes(session.user.email ?? null, session.user.role)
  ) {
    throw new Error("Forbidden.");
  }
  if (session.user.id === userId) {
    throw new Error("You cannot delete your own account.");
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) {
    throw new Error("User not found.");
  }

  if (target.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      throw new Error("Cannot delete the last administrator.");
    }
  }

  await prisma.$transaction([
    prisma.reflection.deleteMany({ where: { userId } }),
    prisma.passwordResetToken.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  revalidatePath("/admin/users");
}
