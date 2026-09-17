import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ChordRenderer } from "@/components/ChordRenderer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music2, Share2, KeyRound } from "lucide-react";

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950">
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        {/* Tombol Back & Share */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-zinc-400 hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Katalog</span>
            </Button>
          </Link>
        </div>

        {/* Header Info Lagu */}
        <div className="border-b border-zinc-800/80 pb-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Music2 className="h-5 w-5 text-primary" />
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              Katalog Lagu Kerinci
            </span>
          </div>

          <h1 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
            {song.title}
          </h1>
          <p className="mt-1.5 text-base sm:text-lg text-zinc-400 font-medium">
            {song.artist || "Tanpa Penyanyi"}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="default" className="gap-1">
              <KeyRound className="h-3 w-3" />
              <span>Nada Dasar: {song.originalKey || "C"}</span>
            </Badge>

            {song.capo ? (
              <Badge variant="secondary">
                Capo: Fret {song.capo}
              </Badge>
            ) : null}
          </div>
        </div>

        {/* Card Lembar Lirik & Chord Presisi */}
        <Card className="border-zinc-800/80 bg-zinc-950/90 shadow-2xl overflow-hidden backdrop-blur">
          <div className="border-b border-zinc-800/80 bg-zinc-900/40 px-6 py-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Lembar Chord & Lirik Gitar
            </h2>
            <span className="text-[11px] text-zinc-500">
              Span-based Flex Alignment
            </span>
          </div>
          <CardContent className="p-6 sm:p-8">
            <ChordRenderer content={song.content} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
