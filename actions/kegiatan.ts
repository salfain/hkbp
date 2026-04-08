'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getDaftarKegiatan (tipe?: 'UMUM' | 'KHUSUS') {
  return await prisma.kegiatan.findMany({
    where:
      tipe === 'KHUSUS'
        ? {
            tipeKegiatan: 'KHUSUS',
            // HANYA tampilkan kegiatan khusus jika pendaftarannya sudah di-ACC
            pendaftaran: { some: { status: { in: ['TERDAFTAR', 'HADIR'] } } }
          }
        : tipe === 'UMUM'
        ? { tipeKegiatan: 'UMUM' }
        : {},
    include: {
      pendaftaran: {
        where: { status: { in: ['TERDAFTAR', 'HADIR'] } }
      }
    },
    orderBy: { tanggalMulai: 'desc' }
  })
}

export async function getDetailKegiatanPeserta (kegiatanId: string) {
  return await prisma.kegiatan.findUnique({
    where: { id: kegiatanId },
    include: {
      pendaftaran: {
        where: {
          status: { in: ['TERDAFTAR', 'HADIR'] }
        },
        include: {
          user: {
            select: { namaLengkap: true, nomorTelepon: true, sektor: true }
          }
        },
        orderBy: { user: { namaLengkap: 'asc' } }
      }
    }
  })
}
export async function tambahKegiatan (formData: FormData) {
  try {
    const namaAcara = formData.get('namaAcara') as string
    const deskripsi = formData.get('deskripsi') as string
    const lokasi = formData.get('lokasi') as string
    const kategori = formData.get('kategori') as string
    const tanggalMulai = formData.get('tanggalMulai') as string

    await prisma.kegiatan.create({
      data: {
        namaAcara,
        deskripsi,
        lokasi,
        kategori,
        tanggalMulai: new Date(tanggalMulai)
      }
    })

    revalidatePath('/admin/kelola-kegiatan')
    return { success: true, message: 'Kegiatan berhasil ditambahkan.' }
  } catch (error) {
    console.error('Error tambah kegiatan:', error)
    return { success: false, message: 'Terjadi kesalahan pada server.' }
  }
}

export async function updateKegiatan (id: string, formData: FormData) {
  try {
    const namaAcara = formData.get('namaAcara') as string
    const deskripsi = formData.get('deskripsi') as string
    const lokasi = formData.get('lokasi') as string
    const kategori = formData.get('kategori') as string
    const tanggalMulai = formData.get('tanggalMulai') as string

    await prisma.kegiatan.update({
      where: { id },
      data: {
        namaAcara,
        deskripsi,
        lokasi,
        kategori,
        tanggalMulai: new Date(tanggalMulai)
      }
    })

    revalidatePath('/admin/kelola-kegiatan')
    return { success: true, message: 'Kegiatan berhasil diperbarui.' }
  } catch (error) {
    console.error('Error update kegiatan:', error)
    return { success: false, message: 'Terjadi kesalahan pada server.' }
  }
}

export async function hapusKegiatan (id: string) {
  try {
    await prisma.kegiatan.delete({
      where: { id }
    })
    revalidatePath('/admin/kelola-kegiatan')
    return { success: true, message: 'Kegiatan berhasil dihapus.' }
  } catch (error) {
    console.error('Error hapus kegiatan:', error)
    return { success: false, message: 'Gagal menghapus kegiatan.' }
  }
}
