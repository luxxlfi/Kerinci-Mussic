import { requireRole } from "@/lib/auth-guard";
import { SongEditor } from "@/components/SongEditor";

export default async function NewSongPage() {
  await requireRole(["ADMIN", "HEAD_ADMIN"]);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 font-sans p-6 sm:p-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-extrabold text-white mb-6">Tambah Lagu Baru</h1>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <SongEditor />
        </div>
      </div>
    </div>
  );
}