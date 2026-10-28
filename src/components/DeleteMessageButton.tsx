"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteChatMessage } from "@/app/request/actions";

interface DeleteMessageButtonProps {
  messageId: string;
  requestId: string;
}

export function DeleteMessageButton({
  messageId,
  requestId,
}: DeleteMessageButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteChatMessage(messageId, requestId);
        setShowConfirm(false);
      } catch (error) {
        console.error("Gagal menghapus pesan:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Gagal menghapus pesan. Hanya admin yang berhak menghapus pesan."
        );
      }
    });
  };

  if (showConfirm) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 bg-zinc-950 px-2 py-0.5 text-[11px] text-destructive shadow-sm">
        <span>Hapus pesan?</span>
        <button
          type="button"
          disabled={isPending}
          onClick={handleDelete}
          className="font-bold underline hover:text-red-400 disabled:opacity-50"
        >
          {isPending ? "..." : "Ya"}
        </button>
        <span className="text-zinc-600">/</span>
        <button
          type="button"
          disabled={isPending}
          onClick={() => setShowConfirm(false)}
          className="text-zinc-400 hover:text-zinc-200"
        >
          Batal
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirm(true)}
      disabled={isPending}
      title="Hapus pesan (Akses Admin)"
      className="inline-flex items-center justify-center rounded p-1 text-zinc-500 transition-colors hover:bg-destructive/15 hover:text-destructive active:scale-95 disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin text-destructive" />
      ) : (
        <Trash2 className="h-3 w-3" />
      )}
    </button>
  );
}
