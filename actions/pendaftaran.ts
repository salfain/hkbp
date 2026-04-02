'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getKegiatanTersedia (
  userId: string,
  tipe: 'UMUM' | 'KHUSUS'
) {
  const now = new Date()
  return await prisma.kegiatan.findMany({
    where: {
      tanggalMulai: { gte: now },
      tipeKegiatan: tipe
    },
    orderBy: { tanggalMulai: 'asc' },
    include: {
      pendaftaran: {
        where: { userId: userId },
        select: { id: true, status: true, catatan: true } // Tarik status untuk UI
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

export async function daftarKegiatan (
  userId: string,
  kegiatanId: string,
  tipe: 'UMUM' | 'KHUSUS',
  catatan?: string
) {
  try {
    const statusDaftar = tipe === 'KHUSUS' ? 'MENUNGGU_ACC' : 'TERDAFTAR'

    await prisma.pendaftaran.create({
      data: {
        userId,
        kegiatanId,
        status: statusDaftar,
        catatan: catatan || null
      }
    })
    revalidatePath('/jemaat/kegiatan')
    revalidatePath('/jemaat')
    return {
      success: true,
      message:
        tipe === 'KHUSUS'
          ? 'Pengajuan terkirim. Menunggu ACC Admin.'
          : 'Berhasil mendaftar kegiatan!'
    }
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
