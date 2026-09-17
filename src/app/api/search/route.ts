import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q")?.trim() || "";

  const songs = await prisma.song.findMany({
    where: {
      status: "PUBLISHED",
      OR: query
        ? [
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              artist: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: query,
                mode: "insensitive",
              },
            },
          ]
        : undefined,
    },
    orderBy: {
      title: "asc",
    },
  });

  return NextResponse.json(songs)
}
