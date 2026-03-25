import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Pastikan endpoint ini selalu berjalan dinamis, tidak di-cache oleh Next.js
export const dynamic = 'force-dynamic'

interface JemaatUltah {
  id: string
  namaLengkap: string
  nomorTelepon: string | null
}

export async function GET (req: Request) {
  try {
    // 1. Verifikasi Keamanan (Hanya Vercel yang boleh menembak API ini)
    const authHeader = req.headers.get('authorization')
    if (
      process.env.NODE_ENV === 'production' &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Cari Jemaat yang berulang tahun HARI INI
    const today = new Date()
    const currentMonth = today.getMonth() + 1 // getMonth() dimulai dari 0
    const currentDay = today.getDate()

    // Menggunakan raw query karena Prisma belum mendukung pencocokan Hari & Bulan
    // secara langsung pada tipe data DateTime dengan mudah tanpa mengabaikan Tahun.
    const jemaatUltah = await prisma.$queryRaw<JemaatUltah[]>`
            SELECT id, "namaLengkap", "nomorTelepon" 
            FROM "User" 
            WHERE EXTRACT(MONTH FROM "tanggalLahir") = ${currentMonth} 
            AND EXTRACT(DAY FROM "tanggalLahir") = ${currentDay}
            AND role = 'JEMAAT'
        `

    if (jemaatUltah.length === 0) {
      return NextResponse.json({
        message: 'Tidak ada jemaat yang berulang tahun hari ini.'
      })
    }

    // 3. Logika Pengiriman Pesan (Mockup)
    let pesanTerkirim = 0

    for (const jemaat of jemaatUltah) {
      if (jemaat.nomorTelepon) {
        // DI SINI ADALAH TEMPAT INTEGRASI API WHATSAPP (contoh: Fonnte / Wablas)
        // Contoh format pesan:
        const pesan = `Horas ${jemaat.namaLengkap}! Segenap Parhalado HKBP Pondok Kopi mengucapkan Selamat Ulang Tahun. Semoga panjang umur, sehat selalu, dan senantiasa diberkati Tuhan Yesus Kristus.`

        console.log(`[CRON] Mengirim WA ke ${jemaat.nomorTelepon}: ${pesan}`)

        // await fetch('https://api.fonnte.com/send', { ... });
        pesanTerkirim++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil mengeksekusi cron. ${pesanTerkirim} pesan ulang tahun dikirim.`
    })
  } catch (error) {
    console.error('Cron Error:', error)
    return NextResponse.json(
      { error: 'Gagal mengeksekusi cron job' },
      { status: 500 }
    )
  }
}
