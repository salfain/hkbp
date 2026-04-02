export interface Kegiatan {
  id: string
  namaAcara: string
  deskripsi: string | null
  tanggalMulai: Date
  tipeKegiatan: 'UMUM' | 'KHUSUS'
  lokasi: string | null
  kategori: string | null
}
