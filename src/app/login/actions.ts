"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email dan password wajib diisi.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Pastikan profile tersimpan di database Prisma
  if (data.user) {
    await prisma.profile.upsert({
      where: { email: data.user.email! },
      update: {},
      create: {
        id: data.user.id,
        email: data.user.email!,
        username: data.user.email!.split("@")[0],
        role: "USER",
      },
    });
  }

  redirect("/");
}

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  if (!email || !password) {
    throw new Error("Email dan password wajib diisi.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, role: "USER" },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  // Simpan profile baru ke database Prisma
  if (data.user) {
    const totalUsers = await prisma.profile.count();
    const role = totalUsers === 0 ? "HEAD_ADMIN" : "USER";

    await prisma.profile.upsert({
      where: { email: data.user.email! },
      update: {},
      create: {
        id: data.user.id,
        email: data.user.email!,
        username: username || data.user.email!.split("@")[0],
        role,
      },
    });

    // Otomatis login jika Supabase belum membuatkan session
    if (!data.session) {
      await supabase.auth.signInWithPassword({ email, password });
    }
  }

  redirect("/");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}