'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function updateProfilUser (userId: string, formData: FormData) {
  try {
    const namaLengkap = formData.get('namaLengkap') as string
    const nomorTelepon = formData.get('nomorTelepon') as string
    const sektor = formData.get('sektor') as string
    const tanggalLahirRaw = formData.get('tanggalLahir') as string
    const passwordBaru = formData.get('password') as string

    // Siapkan objek update
    const updateData: {
      namaLengkap: string
      nomorTelepon: string
      sektor: string
      tanggalLahir: Date
      password?: string
    } = {
      namaLengkap,
      nomorTelepon,
      sektor,
      tanggalLahir: new Date(tanggalLahirRaw)
    }

    // Jika user mengisi password baru, hash dan masukkan ke data update
    if (passwordBaru && passwordBaru.trim() !== '') {
      updateData.password = await bcrypt.hash(passwordBaru, 12)
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    // Revalidate kedua path untuk memastikan data terbaru ter-render
    revalidatePath('/admin/profil')
    revalidatePath('/jemaat/profil')

    return { success: true, message: 'Profil berhasil diperbarui!' }
  } catch (error) {
    console.error('Error update profil:', error)
    return {
      success: false,
      message: 'Gagal memperbarui profil. Silakan coba lagi.'
    }
  }
}
