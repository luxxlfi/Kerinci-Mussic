import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminSongsPage({ searchParams }: PageProps) {
  await requireRole(["ADMIN", "HEAD_ADMIN"]);

  const { q } = await searchParams;
  const query = q?.trim() || "";

  // Query lagu dari database Prisma dengan pencarian judul, artis, dan lirik (content)
  const songs = await prisma.song.findMany({
    where: query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { artist: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 font-sans">
      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Header Title & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Manajemen Katalog Lagu</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Kelola, edit, atau cari lagu berdasarkan judul, artis, maupun liriknya.
            </p>
          </div>
          <Link
            href="/admin/songs/new"
            className="self-start sm:self-auto rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500 shadow-lg shadow-emerald-950/50"
          >
            + Buat Lagu Baru
          </Link>
        </div>

        {/* Form Searching Berdasarkan Judul, Artis, dan Lirik */}
        <div className="mb-6">
          <form method="GET" className="flex max-w-lg gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400 pointer-events-none">
                🔍
              </span>
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Cari judul lagu, nama artis, atau penggalan lirik..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Cari
            </button>
            {query && (
              <Link
                href="/admin/songs"
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-700"
              >
                Reset
              </Link>
            )}
          </form>
          {query && (
            <p className="mt-2 text-xs text-zinc-400">
              Menampilkan hasil pencarian untuk:{" "}
              <strong className="text-emerald-400">"{query}"</strong> ({songs.length} lagu ditemukan)
            </p>
          )}
        </div>

        {/* Tabel Lagu */}
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900 text-xs uppercase text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-3.5">Judul Lagu</th>
                <th className="px-6 py-3.5">Artis</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {songs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">
                    {query
                      ? `Tidak ada lagu yang cocok dengan kata kunci "${query}".`
                      : "Belum ada lagu di katalog. Klik \"+ Buat Lagu Baru\" di atas."}
                  </td>
                </tr>
              ) : (
                songs.map((song) => (
                  <tr key={song.id} className="hover:bg-zinc-900/50 transition">
                    <td className="px-6 py-4 font-bold text-white">
                      <Link
                        href={`/songs/${song.slug}`}
                        target="_blank"
                        className="hover:text-emerald-400 transition inline-flex items-center gap-1.5"
                        title="Lihat halaman publik lagu ini"
                      >
                        <span>{song.title}</span>
                        <span className="text-xs text-zinc-500">↗</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">{song.artist || "-"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded px-2.5 py-1 text-xs font-bold ${
                          song.status === "PUBLISHED"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                            : "bg-amber-950 text-amber-400 border border-amber-800/50"
                        }`}
                      >
                        {song.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/songs/${song.id}/edit`}
                        className="inline-block rounded bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
                      >
                        Edit Lagu
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}