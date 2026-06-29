-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'JEMAAT');

-- CreateEnum
CREATE TYPE "StatusAkun" AS ENUM ('PENDING', 'AKTIF', 'DITOLAK');

-- CreateEnum
CREATE TYPE "TipeKegiatan" AS ENUM ('UMUM', 'KHUSUS');

-- CreateEnum
CREATE TYPE "StatusPendaftaran" AS ENUM ('MENUNGGU_ACC', 'TERDAFTAR', 'DITOLAK', 'HADIR', 'TIDAK_HADIR');

-- CreateEnum
CREATE TYPE "ChatThreadStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(36) NOT NULL,
    "namaLengkap" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "nomorTelepon" VARCHAR(15),
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "alamat" VARCHAR(255),
    "sektor" VARCHAR(50),
    "role" "Role" NOT NULL DEFAULT 'JEMAAT',
    "statusAkun" "StatusAkun" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kegiatan" (
    "id" VARCHAR(36) NOT NULL,
    "namaAcara" VARCHAR(36) NOT NULL,
    "deskripsi" VARCHAR(255),
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3),
    "lokasi" VARCHAR(150),
    "kuota" INTEGER,
    "kategori" VARCHAR(36),
    "tipeKegiatan" "TipeKegiatan" NOT NULL DEFAULT 'UMUM',
    "imageUrl" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kegiatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pendaftaran" (
    "id" VARCHAR(36) NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "kegiatanId" VARCHAR(36) NOT NULL,
    "waktuDaftar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusPendaftaran" NOT NULL DEFAULT 'TERDAFTAR',
    "catatan" VARCHAR(255),
    "formulirData" JSONB,
    "waktuHadir" TIMESTAMP(3),

    CONSTRAINT "Pendaftaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatThread" (
    "id" VARCHAR(36) NOT NULL,
    "jemaatId" VARCHAR(36) NOT NULL,
    "status" "ChatThreadStatus" NOT NULL DEFAULT 'OPEN',
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" VARCHAR(36) NOT NULL,
    "threadId" VARCHAR(36) NOT NULL,
    "senderId" VARCHAR(36) NOT NULL,
    "body" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pendaftaran_userId_kegiatanId_key" ON "Pendaftaran"("userId", "kegiatanId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatThread_jemaatId_key" ON "ChatThread"("jemaatId");

-- CreateIndex
CREATE INDEX "ChatThread_status_idx" ON "ChatThread"("status");

-- CreateIndex
CREATE INDEX "ChatThread_lastMessageAt_idx" ON "ChatThread"("lastMessageAt");

-- CreateIndex
CREATE INDEX "ChatMessage_threadId_createdAt_idx" ON "ChatMessage"("threadId", "createdAt");

-- CreateIndex
CREATE INDEX "ChatMessage_senderId_idx" ON "ChatMessage"("senderId");

-- AddForeignKey
ALTER TABLE "Pendaftaran" ADD CONSTRAINT "Pendaftaran_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pendaftaran" ADD CONSTRAINT "Pendaftaran_kegiatanId_fkey" FOREIGN KEY ("kegiatanId") REFERENCES "Kegiatan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatThread" ADD CONSTRAINT "ChatThread_jemaatId_fkey" FOREIGN KEY ("jemaatId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "ChatThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
