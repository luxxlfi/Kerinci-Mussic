import Link from "next/link";
import { createSongRequest } from "./actions";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-guard";

export default async function RequestPage() {
  const auth = await getCurrentUser();

  // Query daftar request user yang sedang login
  const myRequests = auth?.profile
    ? await prisma.songRequest.findMany({
        where: { userId: auth.profile.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 font-sans">
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-extrabold text-white">Request Lagu Baru</h1>
        <p className="mt-2 text-zinc-400">
          Minta lagu favorit kamu yang belum tersedia di katalog.
        </p>

        {/* Form Input Request */}
        <form action={createSongRequest} className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300">Judul Lagu *</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: Menghapus Jejakmu"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300">Nama Artis / Band</label>
            <input
              type="text"
              name="artist"
              placeholder="Contoh: Noah / Peterpan"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300">Catatan Tambahan</label>
            <textarea
              name="note"
              rows={3}
              placeholder="Versi akustik, nada dasar spesifik, dll..."
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500"
          >
            Kirim Request
          </button>
        </form>

        {/* List Request Saya */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-white mb-4">Request Saya</h2>
          {myRequests.length === 0 ? (
            <p className="text-sm text-zinc-500">Belum ada request lagu yang kamu buat.</p>
          ) : (
            <div className="space-y-3">
              {myRequests.map((req) => (
                <Link
                  key={req.id}
                  href={`/request/${req.id}`}
                  className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition hover:border-emerald-500/50"
                >
                  <div>
                    <h3 className="font-bold text-white">{req.title}</h3>
                    <p className="text-xs text-zinc-400">{req.artist || "Tanpa nama artis"}</p>
                  </div>
                  <span
                    className={`rounded px-2.5 py-1 text-xs font-bold ${
                      req.status === "OPEN"
                        ? "bg-amber-950 text-amber-400 border border-amber-800/50"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {req.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}