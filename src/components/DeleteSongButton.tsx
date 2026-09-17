"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteSong } from "@/app/admin/songs/actions";

interface DeleteSongButtonProps {
  songId: string;
  songTitle: string;
  className?: string;
  variant?: "destructive" | "ghost" | "secondary" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

export function DeleteSongButton({
  songId,
  songTitle,
  className,
  variant = "destructive",
  size = "sm",
}: DeleteSongButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteSong(songId);
        setIsOpen(false);
      } catch (error) {
        console.error("Gagal menghapus lagu:", error);
        alert(error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus lagu.");
      }
    });
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={() => setIsOpen(true)}
        className={className}
        title={`Hapus lagu "${songTitle}"`}
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only">Hapus</span>
      </Button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => {
          if (!isPending) setIsOpen(false);
        }}
        onConfirm={handleDelete}
        title="Hapus Lagu?"
        description={`Apakah Anda yakin ingin menghapus lagu "${songTitle}"? Tindakan ini tidak dapat dibatalkan dan lagu akan dihapus secara permanen dari database.`}
        confirmText="Ya, Hapus Lagu"
        cancelText="Batal"
        variant="destructive"
        isLoading={isPending}
      />
    </>
  );
}
