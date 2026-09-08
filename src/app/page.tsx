import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  // Query lagu PUBLISHED dari database Prisma
  const songs = await prisma.song.findMany({
    where: {
      status: "PUBLISHED",
      OR: query
        ? [
            { title: { contains: query, mode: "insensitive" } },
            { artist: { contains: query, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: { title: "asc" },
  });

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 font-sans">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-emerald-400">
            🎸 ChordGitar.id
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/request"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
            >
              Request Lagu
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Katalog Chord & Lirik Lagu
          </h1>
          <p className="mt-2 text-zinc-400">
            Cari lagu favorit kamu dan mulai mainkan gitar sekarang.
          </p>

          {/* Form Pencarian */}
          <form method="GET" className="mt-6 flex max-w-md gap-2">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Cari judul lagu atau nama penyanyi..."
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Cari
            </button>
          </form>
        </div>

        {/* List Lagu */}
        {songs.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-12 text-center">
            <p className="text-lg font-medium text-zinc-400">
              Lagu tidak ditemukan.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {songs.map((song) => (
              <Link
                key={song.id}
                href={`/songs/${song.slug}`}
                className="group rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-emerald-500/50 hover:bg-zinc-900"
              >
                <span className="inline-block rounded bg-zinc-800 px-2 py-0.5 text-xs font-medium text-emerald-400 mb-2">
                  Nada Dasar: {song.originalKey || "C"}
                </span>
                <h2 className="text-lg font-bold text-white group-hover:text-emerald-400">
                  {song.title}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {song.artist || "Tanpa Penyanyi"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}