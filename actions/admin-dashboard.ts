'use server'
import prisma from '@/lib/prisma'

export async function getDashboardMetrics () {
  const [
    totalJemaat,
    totalJemaatAktif,
    jemaatPending,
    jemaatDitolak,
    pengajuanPending,
    kegiatanMendatang,
    percakapanAktif
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'JEMAAT' } }),
    prisma.user.count({ where: { role: 'JEMAAT', statusAkun: 'AKTIF' } }),
    prisma.user.count({ where: { role: 'JEMAAT', statusAkun: 'PENDING' } }),
    prisma.user.count({ where: { role: 'JEMAAT', statusAkun: 'DITOLAK' } }),
    prisma.pendaftaran.count({ where: { status: 'MENUNGGU_ACC' } }),
    prisma.kegiatan.count({
      where: { tipeKegiatan: 'UMUM', tanggalMulai: { gte: new Date() } }
    }),
    prisma.chatThread.count({ where: { status: 'OPEN' } })
  ])

  return {
    totalJemaat,
    totalJemaatAktif,
    jemaatPending,
    jemaatDitolak,
    pengajuanPending,
    kegiatanMendatang,
    percakapanAktif
  }
}
