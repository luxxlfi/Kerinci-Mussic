import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { updateUserRole } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldAlert, ShieldCheck, UserMinus, UserCheck, Users } from "lucide-react";

export default async function HeadAdminUsersPage() {
  await requireRole(["HEAD_ADMIN"]);

  const users = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="purple" className="text-[11px] gap-1">
                <ShieldAlert className="h-3 w-3" />
                <span>Super Admin Area</span>
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Manajemen User & Role
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Kelola dan atur izin role pengguna aplikasi (User biasa vs Admin).
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl">
            <Users className="h-4 w-4 text-purple-400" />
            <span>Total {users.length} Akun Terdaftar</span>
          </div>
        </div>

        <Card className="overflow-hidden border-zinc-800/80 bg-zinc-950 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900/80 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Email User</th>
                  <th className="px-6 py-4 font-semibold">Username</th>
                  <th className="px-6 py-4 font-semibold">Role Saat Ini</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{user.email}</td>
                    <td className="px-6 py-4 text-zinc-400">{user.username || "-"}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          user.role === "HEAD_ADMIN"
                            ? "purple"
                            : user.role === "ADMIN"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {user.role === "HEAD_ADMIN"
                          ? "Head Admin"
                          : user.role === "ADMIN"
                          ? "Admin"
                          : "User Biasa"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role === "USER" ? (
                        <form
                          action={async () => {
                            "use server";
                            await updateUserRole(user.id, "ADMIN");
                          }}
                        >
                          <Button
                            type="submit"
                            size="sm"
                            className="gap-1.5 text-xs font-bold"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            <span>Make Admin</span>
                          </Button>
                        </form>
                      ) : user.role === "ADMIN" ? (
                        <form
                          action={async () => {
                            "use server";
                            await updateUserRole(user.id, "USER");
                          }}
                        >
                          <Button
                            type="submit"
                            variant="destructive"
                            size="sm"
                            className="gap-1.5 text-xs font-bold"
                          >
                            <UserMinus className="h-3.5 w-3.5" />
                            <span>Revoke Admin</span>
                          </Button>
                        </form>
                      ) : (
                        <span className="text-xs text-purple-400/80 font-semibold italic flex items-center justify-end gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Head Admin Utama</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}