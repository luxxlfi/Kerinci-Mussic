"use me";
"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-guard";

export async function createSongRequest(formData: FormData) {
  const auth = await getCurrentUser();
  if (!auth || !auth.profile) {
    throw new Error("Anda harus login untuk membuat request lagu.");
  }

  const title = formData.get("title") as string;
  const artist = formData.get("artist") as string;
  const note = formData.get("note") as string;

  if (!title) {
    throw new Error("Judul lagu wajib diisi.");
  }

  const newRequest = await prisma.songRequest.create({
    data: {
      userId: auth.profile.id,
      title,
      artist: artist || null,
      note: note || null,
      status: "OPEN",
    },
  });

  redirect(`/request/${newRequest.id}`);
}

export async function sendChatMessage(requestId: string, body: string) {
  const auth = await getCurrentUser();
  if (!auth || !auth.profile) {
    throw new Error("Anda harus login untuk mengirim pesan.");
  }

  if (!body.trim()) return;

  await prisma.chatMessage.create({
    data: {
      requestId,
      senderId: auth.profile.id,
      body: body.trim(),
    },
  });
}