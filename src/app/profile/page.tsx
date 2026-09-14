"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/login/actions";

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
    <div className="min-h-screen bg-zinc-900 text-zinc-100 font-sans">
      <main className="mx-auto max-w-xl px-4 py-12">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl">
          <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
            <h1 className="text-2xl font-black text-white">Profil Pengguna</h1>
            <Link
              href="/"
              className="text-xs font-semibold text-emerald-400 hover:underline"
            >
              ← Beranda
            </Link>
          </div>

          {loading ? (
            <div className="py-10 text-center text-zinc-400">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
              Memuat data profil...
            </div>
          ) : profile ? (
            <div className="space-y-6">
              {/* Header Profile dengan Avatar Besar */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 font-black text-2xl text-white shadow-lg">
                  {initial}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{displayName}</h2>
                  <p className="text-xs text-zinc-400">{profile.email}</p>
                  <span
                    className={`mt-2 inline-block rounded px-2.5 py-0.5 text-xs font-bold ${
                      profile.role === "HEAD_ADMIN"
                        ? "bg-purple-950 text-purple-300 border border-purple-800/60"
                        : profile.role === "ADMIN"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60"
                        : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    Role: {profile.role}
                  </span>
                </div>
              </div>

              {/* Quick Links untuk Admin / Head Admin */}
              {(profile.role === "ADMIN" || profile.role === "HEAD_ADMIN") && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Akses Khusus
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/admin/songs"
                      className="rounded bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-zinc-700"
                    >
                      Katalog Lagu Admin
                    </Link>
                    <Link
                      href="/admin/songs/new"
                      className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                    >
                      + Tambah Lagu Baru
                    </Link>
                    {profile.role === "HEAD_ADMIN" && (
                      <Link
                        href="/head-admin/users"
                        className="rounded bg-purple-900/80 px-3 py-1.5 text-xs font-semibold text-purple-200 hover:bg-purple-800"
                      >
                        👑 Kelola Role User
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Tombol Logout */}
              <div className="pt-4 border-t border-zinc-800">
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-rose-600/20 border border-rose-800/40 px-4 py-2.5 text-sm font-bold text-rose-400 transition hover:bg-rose-600 hover:text-white"
                  >
                    Keluar / Logout dari Akun
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm text-zinc-400 mb-4">
                Kamu belum login ke aplikasi.
              </p>
              <Link
                href="/login"
                className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-500"
              >
                Masuk / Login Sekarang
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
