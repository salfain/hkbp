'use server'
import prisma from '@/lib/prisma'

export type MonthlyJemaatStat = {
  month: string
  monthKey: string
  totalJemaat: number
  jemaatAktif: number
  newJemaat: number
  newJemaatAktif: number
}

type MonthlyJemaatRow = {
  month: Date
  newJemaat: number
  newJemaatAktif: number
}

type MonthlyJemaatBaseline = {
  totalJemaat: number
  jemaatAktif: number
}

function getMonthStart (date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function addMonths (date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1)
}

function toMonthKey (date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function formatMonthLabel (date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    month: 'short',
    year: '2-digit'
  }).format(date)
}

async function getMonthlyJemaatStats (): Promise<MonthlyJemaatStat[]> {
  const currentMonthStart = getMonthStart(new Date())
  const rangeStart = addMonths(currentMonthStart, -11)
  const rangeEnd = addMonths(currentMonthStart, 1)

  const [baselineRows, monthlyRows] = await Promise.all([
    prisma.$queryRaw<MonthlyJemaatBaseline[]>`
      SELECT
        COUNT(*)::int AS "totalJemaat",
        COUNT(*) FILTER (WHERE "statusAkun" = 'AKTIF'::"StatusAkun")::int AS "jemaatAktif"
      FROM "User"
      WHERE "role" = 'JEMAAT'::"Role"
        AND "createdAt" < ${rangeStart}
    `,
    prisma.$queryRaw<MonthlyJemaatRow[]>`
      SELECT
        DATE_TRUNC('month', "createdAt")::date AS "month",
        COUNT(*)::int AS "newJemaat",
        COUNT(*) FILTER (WHERE "statusAkun" = 'AKTIF'::"StatusAkun")::int AS "newJemaatAktif"
      FROM "User"
      WHERE "role" = 'JEMAAT'::"Role"
        AND "createdAt" >= ${rangeStart}
        AND "createdAt" < ${rangeEnd}
      GROUP BY 1
      ORDER BY 1
    `
  ])

  const rowByMonth = new Map(
    monthlyRows.map(row => [toMonthKey(new Date(row.month)), row])
  )

  let totalJemaat = Number(baselineRows[0]?.totalJemaat ?? 0)
  let jemaatAktif = Number(baselineRows[0]?.jemaatAktif ?? 0)

  return Array.from({ length: 12 }, (_, index) => {
    const monthDate = addMonths(rangeStart, index)
    const monthKey = toMonthKey(monthDate)
    const row = rowByMonth.get(monthKey)
    const newJemaat = Number(row?.newJemaat ?? 0)
    const newJemaatAktif = Number(row?.newJemaatAktif ?? 0)

    totalJemaat += newJemaat
    jemaatAktif += newJemaatAktif

    return {
      month: formatMonthLabel(monthDate),
      monthKey,
      totalJemaat,
      jemaatAktif,
      newJemaat,
      newJemaatAktif
    }
  })
}

export async function getDashboardMetrics () {
  const [
    totalJemaat,
    totalJemaatAktif,
    jemaatPending,
    jemaatDitolak,
    pengajuanPending,
    kegiatanMendatang,
    percakapanAktif,
    monthlyJemaatStats
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'JEMAAT' } }),
    prisma.user.count({ where: { role: 'JEMAAT', statusAkun: 'AKTIF' } }),
    prisma.user.count({ where: { role: 'JEMAAT', statusAkun: 'PENDING' } }),
    prisma.user.count({ where: { role: 'JEMAAT', statusAkun: 'DITOLAK' } }),
    prisma.pendaftaran.count({ where: { status: 'MENUNGGU_ACC' } }),
    prisma.kegiatan.count({
      where: { tipeKegiatan: 'UMUM', tanggalMulai: { gte: new Date() } }
    }),
    prisma.chatThread.count({ where: { status: 'OPEN' } }),
    getMonthlyJemaatStats()
  ])

  return {
    totalJemaat,
    totalJemaatAktif,
    jemaatPending,
    jemaatDitolak,
    pengajuanPending,
    kegiatanMendatang,
    percakapanAktif,
    monthlyJemaatStats
  }
}
