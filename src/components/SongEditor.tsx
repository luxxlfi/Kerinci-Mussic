"use client";

import React, { useState } from "react";
import { ChordRenderer } from "./ChordRenderer";
import { saveSong } from "@/app/admin/songs/actions";

interface SongEditorProps {
  initialData?: {
    id?: string;
    title: string;
    artist?: string | null;
    slug: string;
    originalKey?: string | null;
    capo?: number | null;
    content: string;
    status: "PENDING" | "PUBLISHED";
  };
}

export function SongEditor({ initialData }: SongEditorProps) {
  const [content, setContent] = useState(initialData?.content || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");

  // Auto-generate slug dari judul
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!initialData?.id) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
    }
  };

  return (
    <form action={saveSong} className="space-y-6">
      {initialData?.id ? <input type="hidden" name="id" value={initialData.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-zinc-300">Judul Lagu *</label>
          <input
            type="text"
            name="title"
            required
            value={title}
            onChange={handleTitleChange}
            placeholder="Contoh: Laskar Pelangi"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300">Slug (URL) *</label>
          <input
            type="text"
            name="slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="laskar-pelangi-nidji"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300">Nama Artis / Band</label>
          <input
            type="text"
            name="artist"
            defaultValue={initialData?.artist || ""}
            placeholder="Nidji"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-zinc-300">Nada Dasar</label>
            <input
              type="text"
              name="originalKey"
              defaultValue={initialData?.originalKey || "C"}
              placeholder="C"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300">Capo (Fret)</label>
            <input
              type="number"
              name="capo"
              defaultValue={initialData?.capo || 0}
              placeholder="0"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300">Status Publish</label>
        <select
          name="status"
          defaultValue={initialData?.status || "PENDING"}
          className="mt-1 w-full sm:w-48 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
        >
          <option value="PENDING">PENDING (Draft)</option>
          <option value="PUBLISHED">PUBLISHED (Publik)</option>
        </select>
      </div>

      {/* Editor Side-by-Side dengan Live Preview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Input Konten (Tulis Chord di dalam [BRACKET]) *
          </label>
          <textarea
            name="content"
            required
            rows={15}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`[C]Mimpi adalah kunci[F]\n[C]Untuk kita menaklukkan[F] dunia`}
            className="w-full font-mono text-sm leading-relaxed rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-400 mb-2 font-bold">
            Live Real-Time Preview:
          </label>
          <div className="min-h-[350px] rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <ChordRenderer content={content || "Pratinjau chord akan muncul di sini..."} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500"
        >
          {initialData?.id ? "Simpan Perubahan Lagu" : "Buat Lagu Baru"}
        </button>
      </div>
    </form>
  );
}