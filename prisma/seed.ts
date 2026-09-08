import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Lagu Laskar Pelangi
  await prisma.song.upsert({
    where: { slug: "laskar-pelangi-nidji" },
    update: {},
    create: {
      title: "Laskar Pelangi",
      artist: "Nidji",
      slug: "laskar-pelangi-nidji",
      originalKey: "C",
      capo: 0,
      status: "PUBLISHED",
      content: `[C]Mimpi adalah kunci[F]
[C]Untuk kita menaklukkan[F] dunia
[Am]Berlarilah tanpa[Em] lelah
[F]Sampai engkau meraih[G]nya`,
    },
  });

  // 2. Lagu Kangen - Dewa 19
  await prisma.song.upsert({
    where: { slug: "kangen-dewa-19" },
    update: {},
    create: {
      title: "Kangen",
      artist: "Dewa 19",
      slug: "kangen-dewa-19",
      originalKey: "D",
      capo: 0,
      status: "PUBLISHED",
      content: `[D]Kuterima surat[Bm]mu
[G]Telah kubaca dan[A] aku mengerti`,
    },
  });

  console.log("✅ Seed data lagu berhasil ditambahkan!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });