import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const count = await prisma.profile.count();
  return NextResponse.json({ ok: true, profileCount: count });
}