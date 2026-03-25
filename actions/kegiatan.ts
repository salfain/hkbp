'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getDaftarKegiatan () {
  return await prisma.kegiatan.findMany({
    orderBy: { tanggalMulai: 'desc' }
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
