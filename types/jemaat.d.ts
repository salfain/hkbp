export interface Jemaat {
  id: string
  namaLengkap: string
  email: string
  nomorTelepon: string | null
  tanggalLahir: Date | string | number
  sektor: string | null
  statusAkun: string
}
