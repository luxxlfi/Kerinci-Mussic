import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

export default async function AdminSongsPage() {
  await requireRole(["ADMIN", "HEAD_ADMIN"]);

  const songs = await prisma.song.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 font-sans">
      <header className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-emerald-400">
            🎸 Admin ChordGitar.id
          </Link>
          <Link
            href="/admin/songs/new"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-500"
          >
            + Buat Lagu Baru
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-extrabold text-white mb-6">Manajemen Katalog Lagu</h1>

        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900 text-xs uppercase text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-3">Judul Lagu</th>
                <th className="px-6 py-3">Artis</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {songs.map((song) => (
                <tr key={song.id} className="hover:bg-zinc-900/50">
                  <td className="px-6 py-4 font-bold text-white">{song.title}</td>
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
                      className="text-xs font-bold text-emerald-400 hover:underline"
                    >
                      Edit Lagu
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}