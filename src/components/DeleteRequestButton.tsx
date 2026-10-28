"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteSongRequest } from "@/app/request/actions";

interface DeleteRequestButtonProps {
  requestId: string;
  requestTitle: string;
  variant?: "destructive" | "ghost" | "secondary" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function DeleteRequestButton({
  requestId,
  requestTitle,
  variant = "destructive",
  size = "sm",
  className,
}: DeleteRequestButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteSongRequest(requestId);
        setIsOpen(false);
      } catch (error) {
        console.error("Gagal menghapus request:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menghapus permintaan lagu."
        );
      }
    });
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={className}
        title={`Hapus request "${requestTitle}"`}
        disabled={isPending}
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only">Hapus Request</span>
      </Button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => {
          if (!isPending) setIsOpen(false);
        }}
        onConfirm={handleDelete}
        title="Hapus Permintaan Lagu?"
        description={`Apakah Anda yakin ingin menghapus permintaan "${requestTitle}" beserta seluruh riwayat obrolannya? Tindakan ini hanya dapat dilakukan oleh admin dan tidak dapat dibatalkan.`}
        confirmText={isPending ? "Menghapus..." : "Ya, Hapus"}
        cancelText="Batal"
        variant="destructive"
      />
    </>
  );
}
