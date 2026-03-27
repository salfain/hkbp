# Sistem Informasi Pendaftaran dan Komunikasi Gereja (HKBP Pondok Kopi)

Aplikasi berbasis web ini dirancang untuk memfasilitasi manajemen data jemaat, pendaftaran kegiatan gereja, serta komunikasi informasi secara efisien. Proyek ini dikembangkan sebagai bagian dari Tugas Akhir/Skripsi (Studi Kasus: HKBP Ressort Pondok Kopi).

## 🚀 Teknologi yang Digunakan

Proyek ini dibangun menggunakan _stack_ teknologi modern (T3-Stack Concept) dengan performa tinggi:

- **Framework**: [Next.js 14/15 (App Router)](https://nextjs.org/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [PostgreSQL (Neon DB)](https://neon.tech/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Autentikasi**: [NextAuth.js v4](https://next-auth.js.org/)
- **Ekspor Laporan**: [ExcelJS](https://github.com/exceljs/exceljs)
- **Deployment & Cron**: [Vercel](https://vercel.com/)

---

## ✨ Fitur Utama

### 👑 Panel Administrator (Parhalado)

- **Dashboard Analitik**: Ringkasan total jemaat terdaftar dan kegiatan aktif.
- **Kelola Jemaat**: CRUD (Create, Read, Update, Delete) data jemaat beserta fitur pencarian _real-time_ berbasis URL.
- **Kelola Kegiatan**: Pembuatan jadwal ibadah, rapat, atau acara gereja dengan pengaturan waktu dan deskripsi rinci.
- **Ekspor Laporan**: Mengunduh daftar kehadiran jemaat per kegiatan dalam format `.xlsx` (Excel).

### 👥 Panel Jemaat

- **Dashboard Profil**: Tampilan sapaan personal dan jadwal kegiatan yang akan diikuti.
- **Daftar Kegiatan**: Eksplorasi jadwal pelayanan terbuka dan fitur "Satu Klik Daftar/Batal".
- **Manajemen Profil**: Pembaruan biodata mandiri dan perubahan kata sandi.

### 🤖 Sistem Otomasi (Background Jobs)

- **Notifikasi Ulang Tahun**: Terintegrasi dengan Vercel Cron untuk mengecek jemaat yang berulang tahun setiap pukul 08:00 pagi (siap dihubungkan ke API WhatsApp/Fonnte).