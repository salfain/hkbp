'use server'
import prisma from '@/lib/prisma'

export async function getDashboardMetrics () {
  const [totalJemaatAktif, jemaatPending, pengajuanPending, kegiatanMendatang] =
    await Promise.all([
      prisma.user.count({ where: { role: 'JEMAAT', statusAkun: 'AKTIF' } }),
      prisma.user.count({ where: { role: 'JEMAAT', statusAkun: 'PENDING' } }),
      prisma.pendaftaran.count({ where: { status: 'MENUNGGU_ACC' } }),
      prisma.kegiatan.count({
        where: { tipeKegiatan: 'UMUM', tanggalMulai: { gte: new Date() } }
      })
    ])

  return {
    totalJemaatAktif,
    jemaatPending,
    pengajuanPending,
    kegiatanMendatang
  }
}
