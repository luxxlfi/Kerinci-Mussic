-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'HEAD_ADMIN');

-- CreateEnum
CREATE TYPE "SongStatus" AS ENUM ('PENDING', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "username" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "slug" TEXT NOT NULL,
    "originalKey" TEXT,
    "capo" INTEGER,
    "content" TEXT NOT NULL,
    "status" "SongStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongRequest" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "note" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SongRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "requestId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- CreateIndex
CREATE INDEX "Profile_role_idx" ON "Profile"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Song_slug_key" ON "Song"("slug");

-- CreateIndex
CREATE INDEX "Song_status_idx" ON "Song"("status");

-- CreateIndex
CREATE INDEX "Song_title_idx" ON "Song"("title");

-- CreateIndex
CREATE INDEX "Song_artist_idx" ON "Song"("artist");

-- CreateIndex
CREATE INDEX "SongRequest_userId_idx" ON "SongRequest"("userId");

-- CreateIndex
CREATE INDEX "SongRequest_status_idx" ON "SongRequest"("status");

-- CreateIndex
CREATE INDEX "ChatMessage_requestId_createdAt_idx" ON "ChatMessage"("requestId", "createdAt");

-- AddForeignKey
ALTER TABLE "SongRequest" ADD CONSTRAINT "SongRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "SongRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
