import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Music, Sparkles, ArrowRight, RotateCcw } from "lucide-react";

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
            { content: { contains: query, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: { title: "asc" },
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface/60 via-background to-background px-6 py-14 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(52,211,153,0.15),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="relative mx-auto max-w-5xl text-center">
          

          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Chord Lagu Kerinci
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-muted leading-relaxed">
            selebew
          </p>

          {/* Form Pencarian Modern */}
        <SearchInput />
        </div>
      </section>

      {/* Main Container List Lagu */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {query ? "Hasil Pencarian" : "Daftar Lagu Terbaru"}
            </h2>
          </div>
          <span className="text-xs text-muted font-medium">
            Total {songs.length} Lagu
          </span>
        </div>

        {/* List Card Lagu */}
        {songs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-surface-hover text-muted-foreground mb-3">
              <Music className="h-6 w-6" />
            </div>
            <p className="text-base font-semibold text-foreground">
              Lagu tidak ditemukan
            </p>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
              Belum ada lagu yang cocok dengan pencarian kamu. Mau meminta lagu ini ditambahkan?
            </p>
            <Link href="/request" className="inline-block mt-4">
              <Button variant="outline" size="sm" className="gap-2">
                Request Lagu Sekarang
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {songs.map((song) => (
              <Link
                key={song.id}
                href={`/songs/${song.slug}`}
                className="group block"
              >
                <Card className="h-full border-border bg-card/60 backdrop-blur transition-all duration-200 group-hover:border-primary-border group-hover:bg-surface group-hover:-translate-y-0.5 group-hover:shadow-lg">
                  <CardContent className="p-5 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <Badge variant="default">
                          Key: {song.originalKey || "C"}
                        </Badge>
                        {song.capo ? (
                          <Badge variant="secondary" className="text-[10px]">
                            Capo {song.capo}
                          </Badge>
                        ) : null}
                      </div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {song.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted font-medium">
                        {song.artist || "Artis Kerinci"}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      <span className="font-semibold text-[11px]">Buka Chord & Lirik</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}