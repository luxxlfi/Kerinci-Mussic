import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DeleteSongButton } from "@/components/DeleteSongButton";
import {
  Search,
  PlusCircle,
  ExternalLink,
  Edit,
  Music,
  RotateCcw,
} from "lucide-react";

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
    <div className="min-h-screen bg-background text-foreground font-sans">
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        {/* Header Title & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="default" className="text-[11px]">
                Panel Admin
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Manajemen Katalog Lagu
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              Kelola, edit, atau cari lagu berdasarkan judul, artis, maupun liriknya.
            </p>
          </div>
          <Link href="/admin/songs/new">
            <Button size="lg" className="gap-2 rounded-xl shadow-lg">
              <PlusCircle className="h-4 w-4" />
              <span>Buat Lagu Baru</span>
            </Button>
          </Link>
        </div>

        {/* Form Searching Berdasarkan Judul, Artis, dan Lirik */}
        <div className="mb-6">
          <form method="GET" className="flex max-w-lg gap-2">
            <div className="relative flex-1">
              <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Cari judul lagu, nama artis, atau potongan lirik..."
                className="pl-9 h-10 rounded-xl bg-surface border-border"
              />
            </div>
            <Button type="submit" size="default" className="rounded-xl px-4 gap-1.5">
              <Search className="h-4 w-4" />
              <span>Cari</span>
            </Button>
            {query && (
              <Link href="/admin/songs">
                <Button variant="outline" size="default" className="rounded-xl px-3 gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5 text-muted" />
                  <span className="hidden sm:inline">Reset</span>
                </Button>
              </Link>
            )}
          </form>
          {query && (
            <p className="mt-2 text-xs text-muted">
              Menampilkan hasil untuk:{" "}
              <strong className="text-primary">"{query}"</strong> ({songs.length} lagu ditemukan)
            </p>
          )}
        </div>

        {/* Tabel Lagu Modern shadcn style */}
        <Card className="overflow-hidden border-border bg-card shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-foreground">
              <thead className="bg-surface text-xs uppercase tracking-wider text-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Judul Lagu</th>
                  <th className="px-6 py-4 font-semibold">Artis</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {songs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-surface mb-2">
                        <Music className="h-5 w-5 text-muted-foreground" />
                      </div>
                      {query
                        ? `Tidak ada lagu yang cocok dengan kata kunci "${query}".`
                        : 'Belum ada lagu di katalog. Klik "Buat Lagu Baru" di atas.'}
                    </td>
                  </tr>
                ) : (
                  songs.map((song) => (
                    <tr
                      key={song.id}
                      className="hover:bg-surface-hover/50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-bold text-foreground">
                        <Link
                          href={`/songs/${song.slug}`}
                          target="_blank"
                          className="hover:text-primary transition inline-flex items-center gap-1.5 group-hover:underline underline-offset-4"
                          title="Lihat halaman publik lagu ini"
                        >
                          <span>{song.title}</span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-muted">{song.artist || "-"}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            song.status === "PUBLISHED" ? "default" : "amber"
                          }
                        >
                          {song.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/songs/${song.id}/edit`}>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="gap-1.5 text-xs text-primary hover:text-primary-hover font-bold"
                            >
                              <Edit className="h-3 w-3" />
                              <span>Edit</span>
                            </Button>
                          </Link>
                          <DeleteSongButton
                            songId={song.id}
                            songTitle={song.title}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}