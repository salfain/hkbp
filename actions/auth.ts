'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export async function registerJemaat (formData: FormData) {
  try {
    const namaLengkap = formData.get('namaLengkap') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const nomorTelepon = formData.get('nomorTelepon') as string
    const tanggalLahirRaw = formData.get('tanggalLahir') as string

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return {
        success: false,
        message: 'Email sudah terdaftar. Silakan gunakan email lain.'
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        namaLengkap,
        email,
        password: hashedPassword,
        nomorTelepon,
        tanggalLahir: new Date(tanggalLahirRaw),
        role: 'JEMAAT',
        statusAkun: 'PENDING' // Otomatis PENDING
      }
    })

    revalidatePath('/admin')
    revalidatePath('/admin/kelola-jemaat')

    return {
      success: true,
      message:
        'Pendaftaran berhasil! Silakan tunggu Admin mengonfirmasi akun Anda.'
    }
  } catch (error) {
    console.error('Register Error:', error)
    return {
      success: false,
      message: 'Terjadi kesalahan sistem saat mendaftar.'
    }
  }
}
