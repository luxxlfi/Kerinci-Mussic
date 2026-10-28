import Link from "next/link";
import { createSongRequest } from "./actions";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-guard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteRequestButton } from "@/components/DeleteRequestButton";
import { Send, Music, MessageSquare, ArrowRight, ShieldCheck, User } from "lucide-react";

export default async function RequestPage() {
  const auth = await getCurrentUser();
  const isAdmin =
    auth?.profile?.role === "ADMIN" || auth?.profile?.role === "HEAD_ADMIN";

  // Jika admin: tampilkan semua request masuk untuk dimoderasi dan dibalas.
  // Jika user biasa: hanya tampilkan request milik sendiri.
  const requests = auth?.profile
    ? await prisma.songRequest.findMany({
        where: isAdmin ? undefined : { userId: auth.profile.id },
        include: {
          user: true,
          _count: { select: { messages: true } },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950">
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Fitur Komunitas Musik</span>
            </div>

            {isAdmin && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Mode Admin Aktif</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {isAdmin ? "Manajemen & Request Lagu" : "Request Lagu Baru"}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            {isAdmin
              ? "Kelola permintaan lagu dari pengguna, tanggapi pesan diskusi, atau hapus percakapan."
              : "Minta lagu favorit atau lagu daerah Kerinci yang belum tersedia di katalog untuk dibuatkan chord gitarnya."}
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

        {/* List Request */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              <span>{isAdmin ? "Semua Permintaan Masuk (Admin)" : "Daftar Request Saya"}</span>
            </h2>
            <span className="text-xs text-zinc-400 font-medium">
              {requests.length} Permintaan
            </span>
          </div>

          {requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center text-zinc-500 text-sm">
              {isAdmin
                ? "Belum ada permintaan lagu yang masuk dari pengguna."
                : "Kamu belum membuat request lagu. Coba kirimkan lagu yang ingin kamu pelajari melalui formulir di atas!"}
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="group relative flex items-center justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition-all hover:border-primary-border hover:bg-zinc-900"
                >
                  <Link
                    href={`/request/${req.id}`}
                    className="flex-1 min-w-0"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors truncate">
                        {req.title}
                      </h3>
                      {req._count?.messages ? (
                        <span className="inline-flex items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-300">
                          <MessageSquare className="h-2.5 w-2.5" />
                          {req._count.messages}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-zinc-400">
                      <span>Penyanyi: {req.artist || "Tanpa nama artis"}</span>
                      {isAdmin && (
                        <>
                          <span className="text-zinc-600">•</span>
                          <span className="inline-flex items-center gap-1 text-zinc-400">
                            <User className="h-3 w-3 text-zinc-500" />
                            {req.user.username || req.user.email}
                          </span>
                        </>
                      )}
                    </div>
                  </Link>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <Badge
                      variant={req.status === "OPEN" ? "amber" : "secondary"}
                    >
                      {req.status === "OPEN" ? "Sedang Diproses" : "Selesai"}
                    </Badge>

                    {/* Tombol Hapus Request Khusus Admin */}
                    {isAdmin && (
                      <DeleteRequestButton
                        requestId={req.id}
                        requestTitle={req.title}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-zinc-500 hover:text-destructive hover:bg-destructive/10"
                      />
                    )}

                    <Link href={`/request/${req.id}`}>
                      <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
