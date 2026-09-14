"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/login/actions";

interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  role: "USER" | "ADMIN" | "HEAD_ADMIN";
}

export function Navbar() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function loadUser() {
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
    loadUser();
  }, [pathname]);

  // Tutup dropdown saat klik di luar area avatar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Tutup dropdown saat pindah halaman
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  // Initial huruf nama untuk avatar
  const displayName = profile?.username || profile?.email || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const isHeadAdmin = profile?.role === "HEAD_ADMIN";
  const isAdminOrHeadAdmin = profile?.role === "ADMIN" || profile?.role === "HEAD_ADMIN";

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur px-4 sm:px-6 py-3.5">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight text-emerald-400 hover:text-emerald-300 transition"
          >
            <span>🎸</span>
            <span>ChordGitar.id</span>
          </Link>

          {/* Nav Links Menu Berdasarkan Role */}
          <nav className="hidden md:flex items-center gap-3">
            {/* Request Lagu (Selalu ada untuk user / publik) */}
            <Link
              href="/request"
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                pathname === "/request"
                  ? "bg-zinc-800 text-emerald-400 border border-emerald-500/30"
                  : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              Request Lagu
            </Link>

            {/* Menu Khusus ADMIN & HEAD_ADMIN */}
            {isAdminOrHeadAdmin && (
              <>
                <Link
                  href="/admin/songs"
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    pathname.startsWith("/admin/songs")
                      ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                      : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  Kelola Lagu
                </Link>
                <Link
                  href="/admin/songs/new"
                  className="rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold transition hover:bg-emerald-600 hover:text-white"
                >
                  + Tambah Lagu
                </Link>
              </>
            )}

            {/* Menu Khusus HEAD_ADMIN */}
            {isHeadAdmin && (
              <Link
                href="/head-admin/users"
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  pathname.startsWith("/head-admin")
                    ? "bg-purple-950 text-purple-300 border border-purple-800/60"
                    : "text-purple-400 hover:bg-purple-950/40 hover:text-purple-300"
                }`}
              >
                👑 Kelola Role User
              </Link>
            )}
          </nav>
        </div>

        {/* Pojok Kanan: Avatar Profile & Popup Logout / Login */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-zinc-800" />
          ) : profile ? (
            /* Sudah Login: Tombol Avatar yang Memunculkan Popup Logout */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="group flex items-center gap-2.5 rounded-full border border-zinc-800 bg-zinc-900/80 py-1 pl-1.5 pr-3 transition hover:border-emerald-500/50 hover:bg-zinc-900 focus:outline-none"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 font-bold text-sm text-white shadow-inner group-hover:bg-emerald-500 transition">
                  {initial}
                </div>
                <div className="flex flex-col text-left">
                  <span className="max-w-[120px] truncate text-xs font-bold text-white group-hover:text-emerald-400">
                    {displayName}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                    {profile.role === "HEAD_ADMIN"
                      ? "Head Admin"
                      : profile.role === "ADMIN"
                      ? "Admin"
                      : "Member"}
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-4 w-4 text-zinc-400 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Popup / Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl backdrop-blur-lg animate-in fade-in zoom-in-95 duration-100 z-50">
                  {/* Header info user di popup */}
                  <div className="border-b border-zinc-800 px-3 py-2.5">
                    <p className="text-xs font-bold text-white truncate">{displayName}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{profile.email}</p>
                    <span
                      className={`mt-1.5 inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                        profile.role === "HEAD_ADMIN"
                          ? "bg-purple-950 text-purple-300 border border-purple-800/60"
                          : profile.role === "ADMIN"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60"
                          : "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      {profile.role}
                    </span>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>👤</span>
                      <span>Halaman Profil Lengkap</span>
                    </Link>

                    {isAdminOrHeadAdmin && (
                      <Link
                        href="/admin/songs"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span>🎵</span>
                        <span>Kelola Lagu</span>
                      </Link>
                    )}

                    {isHeadAdmin && (
                      <Link
                        href="/head-admin/users"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-purple-300 transition hover:bg-purple-950/40 hover:text-purple-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span>👑</span>
                        <span>Kelola Role User</span>
                      </Link>
                    )}
                  </div>

                  {/* Tombol Logout di Popup */}
                  <div className="border-t border-zinc-800 pt-1">
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-rose-400 transition hover:bg-rose-950/40 hover:text-rose-300"
                      >
                        <span>🚪</span>
                        <span>Keluar / Logout</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Belum Login: Avatar Anonim dan tombol / tulisan Login di bawah */
            <div className="flex flex-col items-center">
              <Link
                href="/login"
                className="group flex flex-col items-center gap-0.5 text-center transition hover:opacity-90"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-400 group-hover:border-emerald-500 group-hover:text-emerald-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 group-hover:underline">
                  Login
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bar Menu Khusus Mobile bila login sebagai Admin / Head Admin */}
      {profile && (isAdminOrHeadAdmin || isHeadAdmin) && (
        <div className="mt-2 flex md:hidden items-center gap-2 overflow-x-auto pt-2 border-t border-zinc-900 text-xs">
          <Link
            href="/request"
            className="rounded bg-zinc-900 px-2.5 py-1 text-zinc-300 whitespace-nowrap"
          >
            Request
          </Link>
          {isAdminOrHeadAdmin && (
            <>
              <Link
                href="/admin/songs"
                className="rounded bg-zinc-900 px-2.5 py-1 text-emerald-400 whitespace-nowrap"
              >
                Kelola Lagu
              </Link>
              <Link
                href="/admin/songs/new"
                className="rounded bg-emerald-600/20 px-2.5 py-1 text-emerald-400 whitespace-nowrap"
              >
                + Tambah
              </Link>
            </>
          )}
          {isHeadAdmin && (
            <Link
              href="/head-admin/users"
              className="rounded bg-purple-950 px-2.5 py-1 text-purple-300 whitespace-nowrap"
            >
              👑 Role User
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
