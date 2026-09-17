import Link from "next/link";
import { createSongRequest } from "./actions";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-guard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Music, MessageSquare, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950">
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Fitur Komunitas Musik</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Request Lagu Baru
          </h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            Minta lagu favorit atau lagu daerah Kerinci yang belum tersedia di katalog untuk dibuatkan chord gitarnya.
          </p>
        </div>

        {/* Form Input Request Modern Card */}
        <Card className="border-zinc-800/80 bg-zinc-950/90 shadow-xl mb-12">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Formulir Permintaan Lagu</CardTitle>
            <CardDescription className="text-xs">
              Isi informasi lagu selengkap mungkin agar mempermudah admin musik memprosesnya.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form action={createSongRequest} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Judul Lagu *
                </label>
                <Input
                  type="text"
                  name="title"
                  required
                  placeholder="Contoh: Bunga Tanjung / Menghapus Jejakmu"
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Nama Artis / Penyanyi
                </label>
                <Input
                  type="text"
                  name="artist"
                  placeholder="Contoh: Musisi Kerinci / Noah"
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  name="note"
                  rows={3}
                  placeholder="Contoh: Nada dasar C, versi akustik santai, dsb..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 rounded-xl py-2.5 font-bold mt-2"
              >
                <Send className="h-4 w-4" />
                <span>Kirim Permintaan Lagu</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* List Request Saya */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              <span>Daftar Request Saya</span>
            </h2>
            <span className="text-xs text-zinc-400 font-medium">
              {myRequests.length} Permintaan
            </span>
          </div>

          {myRequests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center text-zinc-500 text-sm">
              Kamu belum membuat request lagu. Coba kirimkan lagu yang ingin kamu pelajari melalui formulir di atas!
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.map((req) => (
                <Link
                  key={req.id}
                  href={`/request/${req.id}`}
                  className="group block"
                >
                  <Card className="border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-900 hover:border-primary-border transition-all p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                          {req.title}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {req.artist || "Tanpa nama artis"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge
                          variant={req.status === "OPEN" ? "amber" : "secondary"}
                        >
                          {req.status === "OPEN" ? "Sedang Diproses" : "Selesai"}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}