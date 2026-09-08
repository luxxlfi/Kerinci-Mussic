"use client";

import React, { useState } from "react";
import Link from "next/link";
import { loginAction, registerAction } from "./actions";

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
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 px-4 font-sans text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
        <div className="text-center">
          <Link href="/" className="text-2xl font-black text-emerald-400">
            🎸 ChordGitar.id
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-white">
            {isRegister ? "Buat Akun Baru" : "Masuk ke Akun Kamu"}
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            {isRegister
              ? "Daftar untuk membuat request lagu & chat dengan admin"
              : "Masuk untuk melanjutkan request lagu kamu"}
          </p>
        </div>

        {errorMsg ? (
          <div className="mt-4 rounded-lg border border-rose-800/50 bg-rose-950/50 p-3 text-center text-xs font-semibold text-rose-300">
            {errorMsg}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isRegister ? (
            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-400">
                Username
              </label>
              <input
                type="text"
                name="username"
                required
                placeholder="gitaris_handal"
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          ) : null}

          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-400">
              Email *
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="user@example.com"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-400">
              Password *
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading
              ? "Memproses..."
              : isRegister
              ? "Daftar Akun Sekarang"
              : "Masuk Kebagian User"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-400">
          {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg("");
            }}
            className="font-bold text-emerald-400 underline hover:text-emerald-300"
          >
            {isRegister ? "Masuk di sini" : "Daftar sekarang"}
          </button>
        </div>
      </div>
    </div>
  );
}