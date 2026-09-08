import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-guard";
import { sendChatMessage } from "../actions";

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

  async function handleSendMessage(formData: FormData) {
    "use server";
    const body = formData.get("body") as string;
    await sendChatMessage(id, body);
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 font-sans">
      <header className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/request" className="text-sm font-semibold text-emerald-400 hover:underline">
            ← Kembali ke Request Saya
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {/* Info Header Request */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">{req.title}</h1>
            <span
              className={`rounded px-3 py-1 text-xs font-bold ${
                req.status === "OPEN"
                  ? "bg-amber-950 text-amber-400 border border-amber-800/50"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {req.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">Penyanyi: {req.artist || "-"}</p>
          {req.note ? <p className="mt-3 text-sm text-zinc-300 italic">"{req.note}"</p> : null}
        </div>

        {/* Thread Chat Messages */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-white mb-4">Percakapan Chat</h2>
          <div className="space-y-3 min-h-[200px] max-h-[500px] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            {req.messages.length === 0 ? (
              <p className="text-center text-sm text-zinc-500 py-8">
                Belum ada pesan. Mulai obrolan dengan admin di bawah ini!
              </p>
            ) : (
              req.messages.map((msg) => {
                const isMe = auth?.profile?.id === msg.senderId;

                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] text-zinc-500 mb-1 font-semibold">
                      {msg.sender.username || msg.sender.email} ({msg.sender.role})
                    </span>
                    <div
                      className={`max-w-md rounded-lg px-4 py-2.5 text-sm ${
                        isMe
                          ? "bg-emerald-600 text-white rounded-br-none"
                          : "bg-zinc-800 text-zinc-200 rounded-bl-none border border-zinc-700"
                      }`}
                    >
                      {msg.body}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Form Kirim Chat */}
          {req.status === "OPEN" ? (
            <form action={handleSendMessage} className="mt-4 flex gap-2">
              <input
                type="text"
                name="body"
                required
                placeholder="Tulis pesan untuk admin..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500"
              >
                Kirim
              </button>
            </form>
          ) : (
            <p className="mt-4 text-center text-xs text-zinc-500">
              Request ini telah ditutup (CLOSED). Chat tidak dapat dilanjutkan.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}