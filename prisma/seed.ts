import {
  PrismaClient,
  Role,
  StatusAkun,
  TipeKegiatan,
  StatusPendaftaran
} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main () {
  console.log('🌱 Memulai proses seeding database...')

  // 1. Bersihkan database sebelum melakukan seeding (Urutan penting agar relasi tidak error)
  await prisma.pendaftaran.deleteMany()
  await prisma.kegiatan.deleteMany()
  await prisma.user.deleteMany()
  console.log('🧹 Database lama berhasil dibersihkan.')

  // Default Password untuk semua akun testing: "password123"
  const hashedPassword = await bcrypt.hash('password123', 12)

  // ==========================================
  // 2. SEEDING USERS (SKENARIO AKUN)
  // ==========================================
  console.log('👤 Membuat data Users...')

  // Admin
  await prisma.user.create({
    data: {
      namaLengkap: 'Administrator HKBP',
      email: 'admin@hkbp.local',
      password: hashedPassword,
      nomorTelepon: '08111111111',
      tanggalLahir: new Date('1980-01-01'),
      sektor: 'Pusat',
      role: Role.ADMIN,
      statusAkun: StatusAkun.AKTIF
    }
  })

  // Jemaat Aktif (Siap pakai)
  const jemaatAktif = []
  for (let i = 1; i <= 5; i++) {
    jemaatAktif.push(
      await prisma.user.create({
        data: {
          namaLengkap: `Jemaat Aktif ${i}`,
          email: `jemaat${i}@hkbp.com`,
          password: hashedPassword,
          nomorTelepon: `0822222222${i}`,
          tanggalLahir: new Date(`199${i}-05-15`),
          sektor: `Sektor ${i}`,
          role: Role.JEMAAT,
          statusAkun: StatusAkun.AKTIF
        }
      })
    )
  }

  // Jemaat Menunggu ACC (PENDING)
  await prisma.user.create({
    data: {
      namaLengkap: 'Jemaat Baru (Menunggu ACC)',
      email: 'pending@hkbp.com',
      password: hashedPassword,
      nomorTelepon: '08333333333',
      tanggalLahir: new Date('1995-10-10'),
      sektor: 'Sektor 6',
      role: Role.JEMAAT,
      statusAkun: StatusAkun.PENDING
    }
  })

  // Jemaat Ditolak
  await prisma.user.create({
    data: {
      namaLengkap: 'Jemaat Ditolak',
      email: 'ditolak@hkbp.com',
      password: hashedPassword,
      nomorTelepon: '08444444444',
      tanggalLahir: new Date('1990-12-12'),
      role: Role.JEMAAT,
      statusAkun: StatusAkun.DITOLAK
    }
  })

  // ==========================================
  // 3. SEEDING KEGIATAN UMUM (MENDATANG & LAMPAU)
  // ==========================================
  console.log('⛪ Membuat data Kegiatan Umum...')

  const hariIni = new Date()
  const mingguDepan = new Date()
  mingguDepan.setDate(hariIni.getDate() + 7)
  const bulanDepan = new Date()
  bulanDepan.setDate(hariIni.getDate() + 30)
  const mingguLalu = new Date()
  mingguLalu.setDate(hariIni.getDate() - 7)

  const ibadahMingguDepan = await prisma.kegiatan.create({
    data: {
      namaAcara: 'Ibadah Raya Minggu (Mendatang)',
      deskripsi: 'Ibadah raya minggu pagi. Menggunakan bahasa Indonesia.',
      kategori: 'Ibadah Raya',
      tipeKegiatan: TipeKegiatan.UMUM,
      lokasi: 'Gedung Utama Gereja',
      tanggalMulai: mingguDepan
    }
  })

  await prisma.kegiatan.create({
    data: {
      namaAcara: 'Ibadah Naposobulon (Mendatang)',
      kategori: 'Pemuda',
      tipeKegiatan: TipeKegiatan.UMUM,
      lokasi: 'Ruang Serbaguna',
      tanggalMulai: bulanDepan
    }
  })

  const ibadahLampau = await prisma.kegiatan.create({
    data: {
      namaAcara: 'Ibadah Raya Minggu (Selesai)',
      kategori: 'Ibadah Raya',
      tipeKegiatan: TipeKegiatan.UMUM,
      lokasi: 'Gedung Utama Gereja',
      tanggalMulai: mingguLalu
    }
  })

  // ==========================================
  // 4. SEEDING KEGIATAN KHUSUS (PENGAJUAN JEMAAT)
  // ==========================================
  console.log('📝 Membuat data Layanan Khusus...')

  const pengajuanMenunggu = await prisma.kegiatan.create({
    data: {
      namaAcara: `Pengajuan Pemberkatan Pernikahan - ${jemaatAktif[0].namaLengkap}`,
      deskripsi:
        'Mohon dijadwalkan pernikahan kami. Nama pasangan: Siti Maria.',
      kategori: 'Pemberkatan Pernikahan',
      tipeKegiatan: TipeKegiatan.KHUSUS,
      tanggalMulai: bulanDepan
    }
  })

  const pengajuanDisetujui = await prisma.kegiatan.create({
    data: {
      namaAcara: `Pengajuan Baptisan Kudus - ${jemaatAktif[1].namaLengkap}`,
      deskripsi: 'Baptisan untuk anak kami tercinta.',
      kategori: 'Baptisan Kudus',
      tipeKegiatan: TipeKegiatan.KHUSUS,
      tanggalMulai: mingguDepan
    }
  })

  const pengajuanDitolak = await prisma.kegiatan.create({
    data: {
      namaAcara: `Pengajuan Sidi - ${jemaatAktif[2].namaLengkap}`,
      deskripsi: 'Mohon ikuti kelas sidi.',
      kategori: 'Sidi',
      tipeKegiatan: TipeKegiatan.KHUSUS,
      tanggalMulai: bulanDepan
    }
  })

  // ==========================================
  // 5. SEEDING PENDAFTARAN & ABSENSI (FLOWS)
  // ==========================================
  console.log('✅ Menghubungkan Jemaat dengan Kegiatan (Pendaftaran)...')

  // Skenario 1: Jemaat 1, 2, 3 daftar Ibadah Mendatang (Sukses)
  for (let i = 0; i < 3; i++) {
    await prisma.pendaftaran.create({
      data: {
        userId: jemaatAktif[i].id,
        kegiatanId: ibadahMingguDepan.id,
        status: StatusPendaftaran.TERDAFTAR
      }
    })
  }

  // Skenario 2: History Absensi Ibadah Lampau (1 Hadir, 1 Tidak Hadir)
  await prisma.pendaftaran.create({
    data: {
      userId: jemaatAktif[0].id,
      kegiatanId: ibadahLampau.id,
      status: StatusPendaftaran.HADIR,
      waktuHadir: new Date()
    }
  })
  await prisma.pendaftaran.create({
    data: {
      userId: jemaatAktif[1].id,
      kegiatanId: ibadahLampau.id,
      status: StatusPendaftaran.TIDAK_HADIR
    }
  })

  // Skenario 3: Pendaftaran Kegiatan Khusus
  // a. Menunggu ACC (Tampil di notifikasi Dashboard Admin)
  await prisma.pendaftaran.create({
    data: {
      userId: jemaatAktif[0].id,
      kegiatanId: pengajuanMenunggu.id,
      status: StatusPendaftaran.MENUNGGU_ACC,
      catatan: 'Mohon dijadwalkan pernikahan kami. Nama pasangan: Siti Maria.'
    }
  })

  // b. Disetujui (Tampil di tabel Kegiatan Khusus Admin)
  await prisma.pendaftaran.create({
    data: {
      userId: jemaatAktif[1].id,
      kegiatanId: pengajuanDisetujui.id,
      status: StatusPendaftaran.TERDAFTAR,
      catatan: 'Baptisan untuk anak kami tercinta.'
    }
  })

  // c. Ditolak (History Jemaat jadi merah)
  await prisma.pendaftaran.create({
    data: {
      userId: jemaatAktif[2].id,
      kegiatanId: pengajuanDitolak.id,
      status: StatusPendaftaran.DITOLAK,
      catatan: 'Mohon ikuti kelas sidi.'
    }
  })

  console.log('🎉 Seeding Selesai! Data testing siap digunakan.')
  console.log(`
    ========================================================
    🔑 KREDENSIAL LOGIN TESTING:
    --------------------------------------------------------
    1. Akun Admin:
       Email: admin@hkbp.local
       Pass : password123
       
    2. Akun Jemaat Aktif (Test History & Daftar):
       Email: jemaat1@hkbp.com (Tersedia jemaat1 s/d jemaat5)
       Pass : password123

    3. Akun Jemaat Menunggu ACC (Test Block Login):
       Email: pending@hkbp.com
       Pass : password123

    4. Akun Jemaat Ditolak:
       Email: ditolak@hkbp.com
       Pass : password123
    ========================================================
    `)
}

main()
  .catch(e => {
    console.error('❌ Error saat seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
