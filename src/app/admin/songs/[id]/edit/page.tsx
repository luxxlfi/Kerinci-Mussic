import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { SongEditor } from "@/components/SongEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSongPage({ params }: PageProps) {
  await requireRole(["ADMIN", "HEAD_ADMIN"]);
  const { id } = await params;

  const song = await prisma.song.findUnique({
    where: { id },
  });

  if (!song) notFound();

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 font-sans p-6 sm:p-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-extrabold text-white mb-6">Edit Lagu</h1>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <SongEditor initialData={song} />
        </div>
      </div>
    </div>
  );
}