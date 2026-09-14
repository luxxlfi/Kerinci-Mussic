import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { updateUserRole } from "./actions";

export default async function HeadAdminUsersPage() {
  await requireRole(["HEAD_ADMIN"]);

  const users = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 font-sans">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">Manajemen User & Role</h1>
        <p className="text-zinc-400 mb-6">Kelola dan ubah role pengguna aplikasi di bawah ini.</p>

        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900 text-xs uppercase text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-3">Email User</th>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Role Saat Ini</th>
                <th className="px-6 py-3 text-right">Aksi Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-900/50">
                  <td className="px-6 py-4 font-bold text-white">{user.email}</td>
                  <td className="px-6 py-4">{user.username || "-"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded px-2.5 py-1 text-xs font-bold ${
                        user.role === "HEAD_ADMIN"
                          ? "bg-purple-950 text-purple-400 border border-purple-800/50"
                          : user.role === "ADMIN"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role === "USER" ? (
                      <form
                        action={async () => {
                          "use server";
                          await updateUserRole(user.id, "ADMIN");
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500"
                        >
                          Make Admin
                        </button>
                      </form>
                    ) : user.role === "ADMIN" ? (
                      <form
                        action={async () => {
                          "use server";
                          await updateUserRole(user.id, "USER");
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-500"
                        >
                          Revoke Admin
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs text-zinc-500 italic">Head Admin Utama</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}