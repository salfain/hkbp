'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getPendaftaranMenunggu () {
  return await prisma.pendaftaran.findMany({
    where: { status: 'MENUNGGU_ACC' },
    include: { user: true, kegiatan: true },
    orderBy: { waktuDaftar: 'desc' }
  })
}

export async function ubahStatusPendaftaran (
  pendaftaranId: string,
  status: 'TERDAFTAR' | 'DITOLAK'
) {
  try {
    await prisma.pendaftaran.update({
      where: { id: pendaftaranId },
      data: { status }
    })
    revalidatePath('/admin/persetujuan')
    return {
      success: true,
      message: `Pendaftaran berhasil ${
        status === 'TERDAFTAR' ? 'disetujui' : 'ditolak'
      }.`
    }
  } catch (e) {
    return { success: false, message: `Gagal merubah status. ${e}` }
  }
}
