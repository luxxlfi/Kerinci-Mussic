"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/login/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  ShieldCheck,
  Music2,
  PlusCircle,
  ShieldAlert,
  LogOut,
  ArrowLeft,
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  role: "USER" | "ADMIN" | "HEAD_ADMIN";
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile || null);
        }
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const displayName = profile?.username || profile?.email || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <main className="mx-auto max-w-xl px-4 py-12">
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-zinc-400 hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Beranda</span>
            </Button>
          </Link>
        </div>

        <Card className="border-zinc-800/80 bg-zinc-950 shadow-2xl">
          <CardHeader className="border-b border-zinc-800/80 pb-4">
            <CardTitle className="text-xl">Profil Pengguna</CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            {loading ? (
              <div className="py-12 text-center text-zinc-400">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                <p className="text-sm">Memuat data profil akun...</p>
              </div>
            ) : profile ? (
              <div className="space-y-6">
                {/* Header Profile dengan Avatar Besar */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 font-black text-2xl text-white shadow-lg shadow-emerald-950/50">
                    {initial}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{displayName}</span>
                      <ShieldCheck className="h-4 w-4 text-primary" />
                    </h2>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                      <Mail className="h-3.5 w-3.5 text-zinc-500" />
                      <span>{profile.email}</span>
                    </p>
                    <div className="mt-2">
                      <Badge
                        variant={
                          profile.role === "HEAD_ADMIN"
                            ? "purple"
                            : profile.role === "ADMIN"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {profile.role === "HEAD_ADMIN"
                          ? "👑 Head Admin"
                          : profile.role === "ADMIN"
                          ? "🎸 Admin Musik"
                          : "User Member"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Quick Links untuk Admin / Head Admin */}
                {(profile.role === "ADMIN" || profile.role === "HEAD_ADMIN") && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                      Akses Khusus Manajemen
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Link href="/admin/songs">
                        <Button variant="secondary" size="sm" className="gap-1.5 text-xs text-primary">
                          <Music2 className="h-3.5 w-3.5" />
                          <span>Katalog Lagu</span>
                        </Button>
                      </Link>
                      <Link href="/admin/songs/new">
                        <Button size="sm" className="gap-1.5 text-xs">
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>+ Tambah Lagu Baru</span>
                        </Button>
                      </Link>
                      {profile.role === "HEAD_ADMIN" && (
                        <Link href="/head-admin/users">
                          <Button variant="outline" size="sm" className="gap-1.5 text-xs text-purple-300 border-purple-800/50 hover:bg-purple-950/40">
                            <ShieldAlert className="h-3.5 w-3.5 text-purple-400" />
                            <span>👑 Kelola Role User</span>
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Tombol Logout */}
                <div className="pt-2 border-t border-zinc-800/80">
                  <form action={logoutAction}>
                    <Button
                      type="submit"
                      variant="destructive"
                      className="w-full gap-2 rounded-xl py-2.5 font-bold"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Keluar / Logout dari Akun</span>
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-zinc-400 mb-4">
                  Kamu belum login ke aplikasi.
                </p>
                <Link href="/login">
                  <Button className="gap-2">
                    <User className="h-4 w-4" />
                    <span>Masuk / Login Sekarang</span>
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
