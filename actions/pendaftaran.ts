'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Mengambil daftar kegiatan yang AKAN DATANG beserta status pendaftaran user saat ini
export async function getKegiatanTersedia (userId: string) {
  const now = new Date()
  return await prisma.kegiatan.findMany({
    where: { tanggalMulai: { gte: now } },
    orderBy: { tanggalMulai: 'asc' },
    include: {
      pendaftaran: {
        where: { userId: userId },
        select: { id: true }
      }
    }
  })
}

// Mengambil jadwal kegiatan yang SUDAH DIDAFTAR oleh user
export async function getJadwalSaya (userId: string) {
  const now = new Date()
  return await prisma.pendaftaran.findMany({
    where: {
      userId: userId,
      kegiatan: { tanggalMulai: { gte: now } }
    },
    include: { kegiatan: true },
    orderBy: { kegiatan: { tanggalMulai: 'asc' } }
  })
}

export async function daftarKegiatan (userId: string, kegiatanId: string) {
  try {
    await prisma.pendaftaran.create({
      data: { userId, kegiatanId }
    })
    revalidatePath('/jemaat/kegiatan')
    revalidatePath('/jemaat')
    return { success: true, message: 'Berhasil mendaftar kegiatan!' }
  } catch (error) {
    return {
      success: false,
      message: `Anda sudah terdaftar atau terjadi kesalahan ${error}.`
    }
  }
}

export async function batalDaftarKegiatan (userId: string, kegiatanId: string) {
  try {
    await prisma.pendaftaran.deleteMany({
      where: { userId, kegiatanId }
    })
    revalidatePath('/jemaat/kegiatan')
    revalidatePath('/jemaat')
    return { success: true, message: 'Pendaftaran berhasil dibatalkan.' }
  } catch (error) {
    return { success: false, message: `Terjadi kesalahan ${error}.` }
  }
}
