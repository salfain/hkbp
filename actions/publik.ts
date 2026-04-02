'use server'

import prisma from '@/lib/prisma'

// Menarik 3 kegiatan UMUM terdekat untuk ditampilkan di Beranda
export async function getKegiatanMendatangPublic () {
  return await prisma.kegiatan.findMany({
    where: {
      tanggalMulai: { gte: new Date() },
      tipeKegiatan: 'UMUM'
    },
    orderBy: { tanggalMulai: 'asc' },
    take: 6
  })
}

// Menarik riwayat kegiatan yang SUDAH LEWAT untuk halaman Agenda / Informasi Kegiatan
export async function getAgendaLampau () {
  return await prisma.kegiatan.findMany({
    where: {
      tanggalMulai: { lt: new Date() }
    },
    orderBy: { tanggalMulai: 'desc' },
    take: 12
  })
}
