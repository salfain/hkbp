'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function ajukanLayananKhusus (formData: FormData) {
  try {
    const userId = formData.get('userId') as string
    const kategori = formData.get('kategori') as string // Pernikahan, Sidi, dll
    const tanggalMulai = formData.get('tanggalPelaksanaan') as string
    const catatan = formData.get('catatan') as string

    // Cari nama user untuk penamaan acara
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return { success: false, message: 'User tidak ditemukan' }

    // 1. Buat Kegiatan (Diajukan oleh Jemaat)
    const kegiatanBaru = await prisma.kegiatan.create({
      data: {
        namaAcara: `Pengajuan ${kategori} - ${user.namaLengkap}`,
        kategori: kategori,
        tipeKegiatan: 'KHUSUS',
        tanggalMulai: new Date(tanggalMulai),
        deskripsi: catatan || 'Tidak ada catatan tambahan.'
      }
    })

    // 2. Otomatis buatkan pendaftaran untuk user tersebut dengan status MENUNGGU_ACC
    await prisma.pendaftaran.create({
      data: {
        userId: userId,
        kegiatanId: kegiatanBaru.id,
        status: 'MENUNGGU_ACC',
        catatan: catatan
      }
    })

    revalidatePath('/jemaat')
    revalidatePath('/admin/persetujuan')

    return {
      success: true,
      message: `Pengajuan ${kategori} berhasil dikirim ke Parhalado.`
    }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Gagal mengirim pengajuan.' }
  }
}
