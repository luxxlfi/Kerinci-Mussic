"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

export async function saveSong(formData: FormData) {
  // Wajib role ADMIN atau HEAD_ADMIN
  await requireRole(["ADMIN", "HEAD_ADMIN"]);

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const artist = formData.get("artist") as string;
  const slug = formData.get("slug") as string;
  const originalKey = formData.get("originalKey") as string;
  const capo = parseInt(formData.get("capo") as string) || 0;
  const content = formData.get("content") as string;
  const status = (formData.get("status") as "PENDING" | "PUBLISHED") || "PENDING";

  if (!title || !slug || !content) {
    throw new Error("Judul, Slug, dan Konten Lagu wajib diisi.");
  }

  if (id) {
    await prisma.song.update({
      where: { id },
      data: {
        title,
        artist: artist || null,
        slug,
        originalKey: originalKey || "C",
        capo,
        content,
        status,
      },
    });
  } else {
    await prisma.song.create({
      data: {
        title,
        artist: artist || null,
        slug,
        originalKey: originalKey || "C",
        capo,
        content,
        status,
      },
    });
  }

  redirect("/admin/songs");
}

export async function togglePublishStatus(id: string, currentStatus: "PENDING" | "PUBLISHED") {
  await requireRole(["ADMIN", "HEAD_ADMIN"]);

  const newStatus = currentStatus === "PUBLISHED" ? "PENDING" : "PUBLISHED";

  await prisma.song.update({
    where: { id },
    data: { status: newStatus },
  });
}