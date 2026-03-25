import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main () {
  // 1. Buat Akun Admin Dummy
  const hashedAdminPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@hkbp.local' },
    update: {},
    create: {
      namaLengkap: 'Administrator Gereja',
      email: 'admin@hkbp.local',
      password: hashedAdminPassword,
      tanggalLahir: new Date('1990-01-01'),
      role: 'ADMIN'
    }
  })

  // 2. Buat Dummy Kegiatan
  const kegiatanData = [
    {
      namaAcara: 'Ibadah Minggu Pagi (Bahasa Batak)',
      deskripsi:
        'Ibadah rutin minggu pagi untuk seluruh jemaat HKBP Ressort Pondok Kopi dengan pengantar Bahasa Batak.',
      tanggalMulai: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 hari dari sekarang
      lokasi: 'Gedung Utama Gereja',
      kategori: 'Ibadah Minggu'
    },
    {
      namaAcara: 'Ibadah Pemuda (Naposobulon)',
      deskripsi:
        'Ibadah dan persekutuan khusus untuk Naposobulon (Pemuda/i) gereja.',
      tanggalMulai: new Date(new Date().setDate(new Date().getDate() + 3)),
      lokasi: 'Ruang Serbaguna Lt. 2',
      kategori: 'Pemuda'
    },
    {
      namaAcara: 'Partangiangan Wijk / Sektor',
      deskripsi:
        'Ibadah sektor rutin untuk mempererat tali persaudaraan antar jemaat dalam satu wilayah.',
      tanggalMulai: new Date(new Date().setDate(new Date().getDate() + 5)),
      lokasi: 'Rumah Keluarga Bpk. Sitorus (Sektor 3)',
      kategori: 'Partangiangan'
    }
  ]

  for (const kegiatan of kegiatanData) {
    await prisma.kegiatan.create({
      data: kegiatan
    })
  }

  console.log('✅ Seeding database berhasil!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
