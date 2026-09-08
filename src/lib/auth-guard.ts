import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";


export async function getCurrentUser() {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await prisma.profile.findUnique({
    where: { email: user.email! },
  });

  return { user, profile };
}

export async function requireRole(allowedRoles:Role[]) {
    const data = await getCurrentUser();
    
     if (!data || !data.profile) {
    throw new Error("UNAUTHORIZED: Anda harus login terlebih dahulu.");
  }

   if (!allowedRoles.includes(data.profile.role)) {
    throw new Error("FORBIDDEN: Anda tidak memiliki akses ke fitur ini.");
  }

  return data;
}