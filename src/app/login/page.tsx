"use client";

import React, { useState } from "react";
import Link from "next/link";
import { loginAction, registerAction } from "./actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, LogIn, UserPlus } from "lucide-react";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      if (isRegister) {
        await registerAction(formData);
      } else {
        await loginAction(formData);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Terjadi kesalahan, silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 font-sans text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-zinc-400 hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Beranda</span>
            </Button>
          </Link>
        </div>

        <Card className="border-zinc-800/80 bg-zinc-950/90 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-zinc-950 shadow-md shadow-emerald-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-2xl font-black">
              {isRegister ? "Buat Akun Baru" : "Masuk ke Akun"}
            </CardTitle>
            <CardDescription className="text-xs">
              {isRegister
                ? "Daftar untuk request lagu & komunikasi dengan admin musik"
                : "Masuk untuk mengakses request lagu & profil akun kamu"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {errorMsg ? (
              <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-center text-xs font-semibold text-rose-300">
                {errorMsg}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister ? (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Username
                  </label>
                  <Input
                    type="text"
                    name="username"
                    required
                    placeholder="gitaris_kerinci"
                    className="h-10 rounded-xl"
                  />
                </div>
              ) : null}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  required
                  placeholder="user@example.com"
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="h-10 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gap-2 rounded-xl py-2.5 font-bold mt-2"
                size="lg"
              >
                {loading ? (
                  <span>Memproses...</span>
                ) : isRegister ? (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>Daftar Akun Sekarang</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>Masuk ke Akun</span>
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-zinc-400 border-t border-zinc-800/80 pt-4">
              {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setErrorMsg("");
                }}
                className="font-bold text-primary underline hover:text-primary-hover ml-1"
              >
                {isRegister ? "Masuk di sini" : "Daftar sekarang"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}