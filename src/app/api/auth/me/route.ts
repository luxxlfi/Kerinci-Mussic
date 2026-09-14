import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guard";

export async function GET() {
  try {
    const data = await getCurrentUser();
    if (!data || !data.user) {
      return NextResponse.json({ user: null, profile: null });
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      profile: {
        id: data.profile?.id,
        email: data.profile?.email,
        username: data.profile?.username,
        role: data.profile?.role,
      },
    });
  } catch {
    return NextResponse.json({ user: null, profile: null });
  }
}
