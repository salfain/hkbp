'use server'

import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export async function tambahJemaat (formData: FormData) {
  try {
    const namaLengkap = formData.get('namaLengkap') as string
    const email = formData.get('email') as string
    const nomorTelepon = formData.get('nomorTelepon') as string
    const sektor = formData.get('sektor') as string
    const tanggalLahirRaw = formData.get('tanggalLahir') as string

    // Default password untuk jemaat baru adalah nomor telepon atau default string
    const hashedPassword = await hashPassword(nomorTelepon || 'hkbp123')

    await prisma.user.create({
      data: {
        namaLengkap,
        email,
        password: hashedPassword,
        nomorTelepon,
        sektor,
        tanggalLahir: new Date(tanggalLahirRaw),
        role: 'JEMAAT'
      }
    })

    // Refresh halaman agar tabel ter-update
    revalidatePath('/admin/kelola-jemaat')

    return { success: true, message: 'Data jemaat berhasil ditambahkan.' }
  } catch (error) {
    console.error('Gagal menambah jemaat:', error)
    return { success: false, message: 'Gagal menyimpan data ke database.' }
  }
}

export async function getDaftarJemaat (query?: string) {
  return await prisma.user.findMany({
    where: {
      role: 'JEMAAT',
      ...(query
        ? {
            OR: [
              { namaLengkap: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
              { sektor: { contains: query, mode: 'insensitive' } }
            ]
          }
        : {})
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      namaLengkap: true,
      email: true,
      nomorTelepon: true,
      sektor: true
    }
  })
}
