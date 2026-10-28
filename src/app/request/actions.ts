"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth-guard";
import { Role } from "@prisma/client";

/**
 * Membuat permintaan lagu baru (Bisa dilakukan oleh user yang telah login)
 */
export async function createSongRequest(formData: FormData) {
  const auth = await getCurrentUser();
  if (!auth || !auth.profile) {
    throw new Error("Anda harus login untuk membuat request lagu.");
  }

  const title = formData.get("title") as string;
  const artist = formData.get("artist") as string;
  const note = formData.get("note") as string;

  if (!title || !title.trim()) {
    throw new Error("Judul lagu wajib diisi.");
  }

  const newRequest = await prisma.songRequest.create({
    data: {
      userId: auth.profile.id,
      title: title.trim(),
      artist: artist?.trim() || null,
      note: note?.trim() || null,
      status: "OPEN",
    },
  });

  revalidatePath("/request");
  redirect(`/request/${newRequest.id}`);
}

/**
 * Mengirim pesan dalam thread percakapan request lagu
 */
export async function sendChatMessage(requestId: string, body: string) {
  const auth = await getCurrentUser();
  if (!auth || !auth.profile) {
    throw new Error("Anda harus login untuk mengirim pesan.");
  }

  if (!body || !body.trim()) return;

  // Pastikan request masih OPEN
  const req = await prisma.songRequest.findUnique({
    where: { id: requestId },
    select: { status: true },
  });

  if (!req || req.status === "CLOSED") {
    throw new Error("Percakapan telah ditutup.");
  }

  await prisma.chatMessage.create({
    data: {
      requestId,
      senderId: auth.profile.id,
      body: body.trim(),
    },
  });

  revalidatePath(`/request/${requestId}`);
}

/**
 * Menghapus pesan chat tertentu.
 * KHUSUS ADMIN & HEAD_ADMIN. User biasa DILARANG (Forbidden).
 */
export async function deleteChatMessage(messageId: string, requestId: string) {
  // Guard role: Hanya ADMIN dan HEAD_ADMIN yang diizinkan
  await requireRole([Role.ADMIN, Role.HEAD_ADMIN]);

  if (!messageId) {
    throw new Error("ID pesan tidak valid.");
  }

  await prisma.chatMessage.delete({
    where: { id: messageId },
  });

  revalidatePath(`/request/${requestId}`);
}

/**
 * Menghapus satu thread permintaan lagu dan seluruh riwayat chat-nya.
 * KHUSUS ADMIN & HEAD_ADMIN.
 */
export async function deleteSongRequest(requestId: string) {
  // Guard role: Hanya ADMIN dan HEAD_ADMIN yang diizinkan
  await requireRole([Role.ADMIN, Role.HEAD_ADMIN]);

  if (!requestId) {
    throw new Error("ID permintaan tidak valid.");
  }

  await prisma.songRequest.delete({
    where: { id: requestId },
  });

  revalidatePath("/request");
  redirect("/request");
}

/**
 * Mengubah status permintaan lagu (OPEN / CLOSED).
 * KHUSUS ADMIN & HEAD_ADMIN.
 */
export async function toggleSongRequestStatus(requestId: string, newStatus: "OPEN" | "CLOSED") {
  await requireRole([Role.ADMIN, Role.HEAD_ADMIN]);

  await prisma.songRequest.update({
    where: { id: requestId },
    data: { status: newStatus },
  });

  revalidatePath(`/request/${requestId}`);
  revalidatePath("/request");
}
