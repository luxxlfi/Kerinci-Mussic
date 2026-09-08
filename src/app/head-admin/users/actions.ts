"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { Role } from "@prisma/client";

export async function updateUserRole(userId: string, newRole: Role) {
  // Proteksi ketat: Hanya HEAD_ADMIN yang diperbolehkan!
  await requireRole(["HEAD_ADMIN"]);

  await prisma.profile.update({
    where: { id: userId },
    data: { role: newRole },
  });

  revalidatePath("/head-admin/users");
}