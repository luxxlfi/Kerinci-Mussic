import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ChordRenderer } from "@/components/ChordRenderer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SongDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch lagu dari Prisma DB berdasarkan slug dan status PUBLISHED
  const song = await prisma.song.findUnique({
    where: { slug },
  });

  if (!song || song.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 font-sans">
      {/* Detail Content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            ← Kembali ke Katalog
          </Link>
        </div>
        <div className="border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            {song.title}
          </h1>
          <p className="mt-2 text-lg text-zinc-400">
            {song.artist || "Tanpa Penyanyi"}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-800/50">
              Nada Dasar: {song.originalKey || "C"}
            </span>
            {song.capo ? (
              <span className="rounded bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-300">
                Capo: Fret {song.capo}
              </span>
            ) : null}
          </div>
        </div>

        {/* Tampilan Konten Lirik & Chord Mentah (Fase 3 akan kita buatkan renderer khusus) */}
        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
            Lirik & Chord (Raw)
          </h3>
          {/* Tampilan Chord Presisi di Atas Kata */}
          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
            <ChordRenderer content={song.content} />
          </div>
        </div>
      </main>
    </div>
  );
}
