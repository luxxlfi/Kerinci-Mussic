"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { logoutAction } from "@/app/login/actions";

interface UserInfo {
  email: string;
  username: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setUser(null);
        return;
      }
      const meta = data.user.user_metadata as any;
      const username = meta?.username || data.user.email?.split("@")?.[0] || "";
      setUser({
        email: data.user.email!,
        username,
      });
    };
    fetchUser();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profil Pengguna</h1>
      {user ? (
        <div className="space-y-4">
          <p>
            <strong>Nama:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <form action={logoutAction} method="post">
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </form>
        </div>
      ) : (
        <p>Memuat data pengguna...</p>
      )}
    </div>
  );
}
