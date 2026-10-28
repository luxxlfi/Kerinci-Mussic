"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/login/actions";
import { Badge } from "@/components/ui/badge";
import {
  Music2,
  PlusCircle,
  ShieldAlert,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Send,
} from "lucide-react";

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

  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  const displayName = profile?.username || profile?.email || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const isHeadAdmin = profile?.role === "HEAD_ADMIN";
  const isAdminOrHeadAdmin =
    profile?.role === "ADMIN" || profile?.role === "HEAD_ADMIN";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md px-4 sm:px-6 py-3 transition-all">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-lg sm:text-xl font-bold tracking-tight text-foreground transition hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight font-extrabold text-primary">
                Chord Lagu Kerinci
              </span>
              <span className="text-[10px] tracking-wider uppercase text-muted-foreground font-semibold">
                Kerinci Music
              </span>
            </div>
          </Link>

          {/* Nav Links Menu Berdasarkan Role */}
          <nav className="hidden md:flex items-center gap-2">
            {/* Request Lagu */}
            <Link
              href="/request"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                pathname === "/request"
                  ? "bg-primary-muted text-primary border border-primary-border"
                  : "text-muted hover:bg-surface hover:text-foreground"
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              <span>Request Lagu</span>
            </Link>

            {/* Menu Khusus ADMIN & HEAD_ADMIN */}
            {isAdminOrHeadAdmin && (
              <>
                <Link
                  href="/admin/songs"
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    pathname.startsWith("/admin/songs") && pathname !== "/admin/songs/new"
                      ? "bg-primary-muted text-primary border border-primary-border"
                      : "text-muted hover:bg-surface hover:text-foreground"
                  }`}
                >
                  <Music2 className="h-3.5 w-3.5" />
                  <span>Kelola Lagu</span>
                </Link>
                <Link
                  href="/admin/songs/new"
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    pathname === "/admin/songs/new"
                      ? "bg-primary text-primary-foreground font-bold"
                      : "bg-primary-muted text-primary border border-primary-border hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Tambah Lagu</span>
                </Link>
              </>
            )}

            {/* Menu Khusus HEAD_ADMIN */}
            {isHeadAdmin && (
              <Link
                href="/head-admin/users"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  pathname.startsWith("/head-admin")
                    ? "bg-role-admin-muted text-role-admin border border-role-admin-border"
                    : "text-role-admin hover:bg-surface hover:text-foreground"
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Kelola Role User</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Pojok Kanan: Avatar Profile & Popup Logout / Login */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-surface-hover border border-border" />
          ) : profile ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="group flex items-center gap-2.5 rounded-full border border-border bg-surface py-1 pl-1.5 pr-3 transition hover:border-primary-border hover:bg-surface-hover focus:outline-none shadow-sm"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-black text-xs text-primary-foreground shadow group-hover:scale-105 transition-transform">
                  {initial}
                </div>
                <div className="flex flex-col text-left">
                  <span className="max-w-[110px] truncate text-xs font-bold text-foreground group-hover:text-primary">
                    {displayName}
                  </span>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {/* Popup / Dropdown Menu ala shadcn */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 origin-top-right rounded-xl border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl z-50">
                  {/* Header info user di popup */}
                  <div className="border-b border-border px-3 py-2.5 mb-1">
                    <p className="text-xs font-bold text-foreground truncate">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-muted truncate">
                      {profile.email}
                    </p>
                    <div className="mt-1.5">
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
                          ? "Head Admin"
                          : profile.role === "ADMIN"
                          ? "Admin Musik"
                          : "User Member"}
                      </Badge>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="space-y-0.5">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted transition hover:bg-surface hover:text-foreground"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="h-3.5 w-3.5 text-muted" />
                      <span>Halaman Profil</span>
                    </Link>

                    {isAdminOrHeadAdmin && (
                      <Link
                        href="/admin/songs"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted transition hover:bg-surface hover:text-foreground"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Music2 className="h-3.5 w-3.5 text-primary" />
                        <span>Katalog Lagu Admin</span>
                      </Link>
                    )}

                    {isHeadAdmin && (
                      <Link
                        href="/head-admin/users"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-role-admin transition hover:bg-surface hover:text-role-admin"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <ShieldAlert className="h-3.5 w-3.5 text-role-admin" />
                        <span>Kelola Role User</span>
                      </Link>
                    )}
                  </div>

                  {/* Tombol Logout di Popup */}
                  <div className="border-t border-border mt-1 pt-1">
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-destructive transition hover:bg-destructive-muted hover:text-destructive"
                      >
                        <LogOut className="h-3.5 w-3.5 text-destructive" />
                        <span>Keluar / Logout</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground font-bold px-3.5 py-1.5 text-xs transition shadow-sm"
            >
              <User className="h-3.5 w-3.5 text-primary-foreground" />
              <span>Masuk / Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Bar Menu Khusus Mobile bila login sebagai Admin / Head Admin */}
      {profile && (isAdminOrHeadAdmin || isHeadAdmin) && (
        <div className="mt-2.5 flex md:hidden items-center gap-2 overflow-x-auto pt-2 border-t border-border text-xs">
          <Link
            href="/request"
            className="rounded-lg bg-surface px-3 py-1.5 text-muted whitespace-nowrap"
          >
            Request
          </Link>
          {isAdminOrHeadAdmin && (
            <>
              <Link
                href="/admin/songs"
                className="rounded-lg bg-surface px-3 py-1.5 text-primary whitespace-nowrap"
              >
                Kelola Lagu
              </Link>
              <Link
                href="/admin/songs/new"
                className="rounded-lg bg-primary-muted border border-primary-border px-3 py-1.5 text-primary whitespace-nowrap"
              >
                + Tambah
              </Link>
            </>
          )}
          {isHeadAdmin && (
            <Link
              href="/head-admin/users"
              className="rounded-lg bg-role-admin-muted border border-role-admin-border px-3 py-1.5 text-role-admin whitespace-nowrap"
            >
              👑 Role User
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
