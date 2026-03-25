import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import ExcelJS from 'exceljs'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

export async function GET (req: NextRequest) {
  // 1. Proteksi endpoint khusus admin
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = req.nextUrl.searchParams
  const kegiatanId = searchParams.get('kegiatanId')

  if (!kegiatanId) {
    return NextResponse.json(
      { error: 'kegiatanId wajib diisi' },
      { status: 400 }
    )
  }

  // 2. Ambil data kegiatan dan daftar kehadirannya dari database
  const kegiatan = await prisma.kegiatan.findUnique({
    where: { id: kegiatanId },
    include: {
      pendaftaran: {
        include: { user: true },
        orderBy: { waktuDaftar: 'asc' }
      }
    }
  })

  if (!kegiatan) {
    return NextResponse.json(
      { error: 'Kegiatan tidak ditemukan' },
      { status: 404 }
    )
  }

  // 3. Konfigurasi ExcelJS
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Laporan Kehadiran')

  // Header tabel
  worksheet.columns = [
    { header: 'No', key: 'no', width: 5 },
    { header: 'Nama Jemaat', key: 'nama', width: 30 },
    { header: 'Nomor Telepon', key: 'telepon', width: 20 },
    { header: 'Wijk / Sektor', key: 'sektor', width: 15 },
    { header: 'Status Kehadiran', key: 'status', width: 20 },
    { header: 'Waktu Daftar', key: 'waktu', width: 25 }
  ]

  // Styling Header
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0D47A1' }
  }

  // Masukkan data baris per baris
  kegiatan.pendaftaran.forEach((daftar, index) => {
    worksheet.addRow({
      no: index + 1,
      nama: daftar.user.namaLengkap,
      telepon: daftar.user.nomorTelepon || '-',
      sektor: daftar.user.sektor || '-',
      status: daftar.status, // MENDAFTAR, HADIR, TIDAK_HADIR
      waktu: format(new Date(daftar.waktuDaftar), 'dd MMM yyyy HH:mm', {
        locale: localeId
      })
    })
  })

  // 4. Generate file buffer dan berikan response Download
  const buffer = await workbook.xlsx.writeBuffer()

  // Format nama file: Laporan_NamaAcara_Tanggal.xlsx
  const filename = `Laporan_Kehadiran_${kegiatan.namaAcara.replace(
    /\s+/g,
    '_'
  )}.xlsx`

  return new NextResponse(buffer, {
    headers: {
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  })
}
