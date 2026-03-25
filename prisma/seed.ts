import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main () {
  console.log('Memulai proses seeding...')

  // 1. Bersihkan data lama (opsional, hati-hati di production!)
  await prisma.pendaftaran.deleteMany()
  await prisma.kegiatan.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash('password123', 12)

  // 2. Buat Admin
  await prisma.user.create({
    data: {
      namaLengkap: 'Admin HKBP',
      email: 'admin@hkbp.local',
      password: passwordHash,
      nomorTelepon: '081100000000',
      tanggalLahir: new Date('1985-01-01'),
      role: 'ADMIN'
    }
  })

  // 3. Buat 5 Data Jemaat
  const jemaatData = [
    {
      namaLengkap: 'Budi Santoso',
      email: 'budi@example.com',
      sektor: 'Sektor 1',
      tgl: '1990-05-15'
    },
    {
      namaLengkap: 'Siti Aminah',
      email: 'siti@example.com',
      sektor: 'Sektor 2',
      tgl: '1992-08-20'
    },
    {
      namaLengkap: 'Togar Sitorus',
      email: 'togar@example.com',
      sektor: 'Sektor 1',
      tgl: '1988-11-10'
    },
    {
      namaLengkap: 'Maria Panjaitan',
      email: 'maria@example.com',
      sektor: 'Sektor 3',
      tgl: '1995-02-28'
    },
    {
      namaLengkap: 'Lukas Hutagalung',
      email: 'lukas@example.com',
      sektor: 'Sektor 2',
      tgl: '2000-12-05'
    }
  ]

  const jemaatList = []
  for (const j of jemaatData) {
    const user = await prisma.user.create({
      data: {
        namaLengkap: j.namaLengkap,
        email: j.email,
        password: passwordHash, // Password semua jemaat = password123
        nomorTelepon: `0812${Math.floor(10000000 + Math.random() * 90000000)}`,
        tanggalLahir: new Date(j.tgl),
        sektor: j.sektor,
        role: 'JEMAAT'
      }
    })
    jemaatList.push(user)
  }

  // 4. Buat 6 Kegiatan (2 Lampau, 4 Mendatang)
  const now = new Date()
  const kegiatanList = []
  const kegiatanData = [
    {
      nama: 'Ibadah Minggu Pagi (Batak)',
      kategori: 'Ibadah Umum',
      offsetHari: -7
    }, // Sudah lewat
    {
      nama: 'Partangiangan Sektor 1',
      kategori: 'Ibadah Sektor',
      offsetHari: -3
    }, // Sudah lewat
    {
      nama: 'Ibadah Minggu Pagi (Batak)',
      kategori: 'Ibadah Umum',
      offsetHari: 2
    },
    {
      nama: 'Ibadah Pemuda (Naposobulon)',
      kategori: 'Ibadah Pemuda',
      offsetHari: 3
    },
    { nama: 'Latihan Koor Gabungan', kategori: 'Paduan Suara', offsetHari: 5 },
    {
      nama: 'Ibadah Minggu Siang (Indonesia)',
      kategori: 'Ibadah Umum',
      offsetHari: 9
    }
  ]

  for (const k of kegiatanData) {
    const tgl = new Date(now)
    tgl.setDate(tgl.getDate() + k.offsetHari)
    tgl.setHours(10, 0, 0, 0)

    const kegiatan = await prisma.kegiatan.create({
      data: {
        namaAcara: k.nama,
        deskripsi: `Deskripsi untuk kegiatan ${k.nama}. Mari hadir tepat waktu.`,
        kategori: k.kategori,
        lokasi: 'Gedung Utama Gereja',
        tanggalMulai: tgl
      }
    })
    kegiatanList.push(kegiatan)
  }

  // 5. Buat Pendaftaran Jemaat ke Kegiatan Mendatang
  for (const jemaat of jemaatList) {
    // Setiap jemaat mendaftar ke 1-2 kegiatan mendatang secara acak
    await prisma.pendaftaran.create({
      data: {
        userId: jemaat.id,
        kegiatanId: kegiatanList[2].id // Pasti daftar Ibadah Minggu terdekat
      }
    })

    if (Math.random() > 0.5) {
      await prisma.pendaftaran.create({
        data: {
          userId: jemaat.id,
          kegiatanId: kegiatanList[3].id // Daftar Naposobulon acak
        }
      })
    }
  }

  console.log(
    '✅ Seeding selesai! Gunakan email jemaat (cth: budi@example.com) & password "password123" untuk testing login.'
  )
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
