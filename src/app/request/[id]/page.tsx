import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-guard";
import { sendChatMessage, toggleSongRequestStatus } from "../actions";
import { DeleteMessageButton } from "@/components/DeleteMessageButton";
import { DeleteRequestButton } from "@/components/DeleteRequestButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, MessageSquare, Send, CheckCircle2, Lock } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RequestDetailPage({ params }: PageProps) {
  const { id } = await params;
  const auth = await getCurrentUser();

  const req = await prisma.songRequest.findUnique({
    where: { id },
    include: {
      user: true,
      messages: {
        include: { sender: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!req) notFound();

  const isAdmin =
    auth?.profile?.role === "ADMIN" || auth?.profile?.role === "HEAD_ADMIN";

  async function handleSendMessage(formData: FormData) {
    "use server";
    const body = formData.get("body") as string;
    await sendChatMessage(id, body);
  }

  async function handleToggleStatus() {
    "use server";
    const nextStatus = req?.status === "OPEN" ? "CLOSED" : "OPEN";
    await toggleSongRequestStatus(id, nextStatus);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950">
      <header className="border-b border-zinc-800/80 bg-zinc-950 px-4 sm:px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            href="/request"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Daftar Permintaan</span>
          </Link>

          {isAdmin && (
            <Badge variant="secondary" className="gap-1 border-primary/30 text-primary bg-primary/10">
              <ShieldCheck className="h-3 w-3" />
              <span>Akses Admin</span>
            </Badge>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        {/* Info Header Request */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6 shadow-lg backdrop-blur">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Request Lagu
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs text-muted">
                  Oleh: {req.user.username || req.user.email}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {req.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={req.status === "OPEN" ? "amber" : "secondary"}
                className="px-2.5 py-1 text-xs"
              >
                {req.status === "OPEN" ? "Sedang Diproses" : "Selesai (Closed)"}
              </Badge>

              {/* Kontrol Khusus Admin: Ubah Status & Hapus Request */}
              {isAdmin && (
                <div className="flex items-center gap-1.5 ml-1">
                  <form action={handleToggleStatus}>
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs gap-1 border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800"
                      title={req.status === "OPEN" ? "Tandai Selesai" : "Buka Kembali"}
                    >
                      {req.status === "OPEN" ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="hidden sm:inline">Selesai</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5 text-amber-400" />
                          <span className="hidden sm:inline">Buka</span>
                        </>
                      )}
                    </Button>
                  </form>

                  <DeleteRequestButton
                    requestId={req.id}
                    requestTitle={req.title}
                    size="sm"
                    className="h-7 text-xs"
                  />
                </div>
              )}
            </div>
          </div>

          <p className="mt-2 text-sm text-zinc-300">
            Penyanyi: <strong className="text-white font-medium">{req.artist || "-"}</strong>
          </p>

          {req.note && (
            <div className="mt-3 rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3 text-xs sm:text-sm text-zinc-300 italic">
              &ldquo;{req.note}&rdquo;
            </div>
          )}
        </div>

        {/* Percakapan Gaya WhatsApp */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              <span>Percakapan Diskusi</span>
            </h2>
            <span className="text-xs text-muted-foreground">
              {req.messages.length} Pesan
            </span>
          </div>

          {/* WhatsApp Chat Canvas */}
          <div className="flex flex-col space-y-2.5 min-h-[350px] max-h-[580px] overflow-y-auto rounded-2xl border border-zinc-800/90 bg-[#0b141a] p-3 sm:p-5 shadow-inner">
            {/* Info notice WhatsApp pill */}
            <div className="flex justify-center my-2">
              <span className="rounded-lg bg-[#182229] px-3 py-1 text-[11px] text-zinc-400 text-center border border-zinc-800">
                Percakapan antara Anda dan Admin terkait lagu <strong className="text-zinc-200">{req.title}</strong>
              </span>
            </div>

            {req.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center my-auto py-12 text-center text-zinc-500">
                <MessageSquare className="h-8 w-8 mb-2 opacity-30 text-emerald-500" />
                <p className="text-sm font-medium text-zinc-400">Belum ada obrolan</p>
                <p className="text-xs mt-0.5 text-zinc-500 max-w-xs">
                  Ketik pesan di bawah untuk memulai percakapan layaknya WhatsApp.
                </p>
              </div>
            ) : (
              req.messages.map((msg) => {
                const isMe = auth?.profile?.id === msg.senderId;
                const isSenderAdmin =
                  msg.sender.role === "ADMIN" || msg.sender.role === "HEAD_ADMIN";

                const timeString = new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={msg.id}
                    className={`group flex items-end gap-1.5 w-full ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Tombol Hapus Khusus Admin (Bila pesan saya, tombol di sebelah kiri bubble) */}
                    {isMe && isAdmin && (
                      <div className="opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity mb-1 shrink-0">
                        <DeleteMessageButton
                          messageId={msg.id}
                          requestId={req.id}
                        />
                      </div>
                    )}

                    {/* Balon Pesan WhatsApp */}
                    <div
                      className={`relative max-w-[85%] sm:max-w-md px-3.5 pt-2 pb-2.5 shadow-md ${
                        isMe
                          ? "bg-[#005c4b] text-white rounded-2xl rounded-tr-xs"
                          : "bg-[#202c33] text-zinc-100 rounded-2xl rounded-tl-xs border border-zinc-700/30"
                      }`}
                    >
                      {/* Nama Pengirim untuk pesan masuk dari lawan bicara */}
                      {!isMe && (
                        <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold">
                          <span
                            className={
                              isSenderAdmin ? "text-emerald-400" : "text-sky-400"
                            }
                          >
                            {msg.sender.username || msg.sender.email}
                          </span>
                          {isSenderAdmin && (
                            <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[9px] font-bold text-emerald-300">
                              Admin
                            </span>
                          )}
                        </div>
                      )}

                      {/* Teks Isi Chat */}
                      <p className="text-sm leading-relaxed break-words pr-14 whitespace-pre-wrap">
                        {msg.body}
                      </p>

                      {/* Jam & Status Centang WhatsApp di pojok kanan bawah bubble */}
                      <div className="absolute right-2.5 bottom-1 flex items-center gap-1 text-[10px] text-zinc-400/90 select-none">
                        <span>{timeString}</span>
                        {isMe && (
                          <svg
                            className="h-3.5 w-3.5 text-sky-400 inline-block"
                            viewBox="0 0 16 15"
                            fill="currentColor"
                          >
                            <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Tombol Hapus Khusus Admin (Bila pesan balasan, tombol di sebelah kanan bubble) */}
                    {!isMe && isAdmin && (
                      <div className="opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity mb-1 shrink-0">
                        <DeleteMessageButton
                          messageId={msg.id}
                          requestId={req.id}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Form Input Chat Gaya WhatsApp */}
          {req.status === "OPEN" ? (
            <form action={handleSendMessage} className="mt-3 flex items-center gap-2">
              <input
                type="text"
                name="body"
                required
                autoComplete="off"
                placeholder="Ketik pesan..."
                className="h-12 w-full rounded-full border border-zinc-800 bg-[#202c33] px-5 text-sm text-white placeholder-zinc-500 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-colors"
              />
              <button
                type="submit"
                aria-label="Kirim Pesan"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white shadow-md transition-all hover:bg-[#008f6f] active:scale-95"
              >
                <Send className="h-5 w-5 ml-0.5" />
              </button>
            </form>
          ) : (
            <div className="mt-4 rounded-xl border border-zinc-800/80 bg-[#182229] p-3.5 text-center text-xs text-zinc-400">
              Permintaan lagu ini telah ditutup (<strong className="text-zinc-300">CLOSED</strong>). Percakapan telah diarsipkan.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
