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
    const hashedPassword = await hashPassword('password123')

    await prisma.user.create({
      data: {
        namaLengkap,
        email,
        password: hashedPassword,
        nomorTelepon,
        sektor,
        tanggalLahir: new Date(tanggalLahirRaw),
        role: 'JEMAAT',
        statusAkun: 'AKTIF'
      }
    })

    revalidatePath('/admin/kelola-jemaat')

    return { success: true, message: 'Data jemaat berhasil ditambahkan.' }
  } catch (error) {
    console.error('Gagal menambah jemaat:', error)
    return { success: false, message: 'Gagal menyimpan data ke database.' }
  }
}

export async function updateJemaat (id: string, formData: FormData) {
  try {
    const namaLengkap = formData.get('namaLengkap') as string
    const email = formData.get('email') as string
    const nomorTelepon = formData.get('nomorTelepon') as string
    const sektor = formData.get('sektor') as string
    const tanggalLahirRaw = formData.get('tanggalLahir') as string

    await prisma.user.update({
      where: { id },
      data: {
        namaLengkap,
        email,
        nomorTelepon,
        sektor,
        tanggalLahir: new Date(tanggalLahirRaw)
      }
    })

    revalidatePath('/admin/kelola-jemaat')
    return { success: true, message: 'Data jemaat berhasil diperbarui.' }
  } catch (error) {
    console.error('Gagal update jemaat:', error)
    return { success: false, message: 'Gagal memperbarui data.' }
  }
}

export async function hapusJemaat (id: string) {
  try {
    await prisma.user.delete({
      where: { id }
    })
    revalidatePath('/admin/kelola-jemaat')
    return { success: true, message: 'Data jemaat berhasil dihapus.' }
  } catch (error) {
    console.error('Gagal hapus jemaat:', error)
    return { success: false, message: 'Gagal menghapus data.' }
  }
}

export async function ubahStatusAkun (
  userId: string,
  statusBaru: 'AKTIF' | 'DITOLAK'
) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { statusAkun: statusBaru }
    })
    revalidatePath('/admin/kelola-jemaat')
    return {
      success: true,
      message: `Status akun berhasil diubah menjadi ${statusBaru}.`
    }
  } catch (error) {
    console.error('Gagal mengubah status akun:', error)
    return { success: false, message: 'Gagal mengubah status akun.' }
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
      tanggalLahir: true,
      nomorTelepon: true,
      sektor: true,
      statusAkun: true
    }
  })
}
