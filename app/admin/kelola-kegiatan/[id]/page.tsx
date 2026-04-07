import { getDetailKegiatanPeserta } from "@/actions/kegiatan";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { PrintButton } from "@/components/Button";

export default async function DetailPesertaPage({ params }: { params: Promise<{ id: string }> }) {
    // Await params karena Next.js 15
    const resolvedParams = await params;
    const kegiatan = await getDetailKegiatanPeserta(resolvedParams.id);

    if (!kegiatan) return <div>Kegiatan tidak ditemukan.</div>;

    const daftarPeserta = kegiatan.pendaftaran;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 bg-white p-4 sm:p-8 rounded-3xl shadow-sm border border-slate-100">

            {/* BAGIAN HEADER (Disembunyikan saat print, diganti header khusus cetak) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <div>
                    <Link href="/admin/kelola-kegiatan" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-2 transition-colors">
                        <ArrowLeft className="mr-1 h-4 w-4" /> Kembali ke Daftar Kegiatan
                    </Link>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{kegiatan.namaAcara}</h1>
                    <p className="text-slate-500 mt-1">
                        {format(new Date(kegiatan.tanggalMulai), "EEEE, dd MMMM yyyy - HH:mm", { locale: localeId })} WIB
                    </p>
                </div>
                <div className="shrink-0">
                    <PrintButton />
                </div>
            </div>

            {/* HEADER KHUSUS UNTUK KERTAS PRINT (Tersembunyi di layar normal) */}
            <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-6">
                <h1 className="text-2xl font-bold uppercase">Daftar Hadir Jemaat</h1>
                <h2 className="text-xl font-semibold mt-1">{kegiatan.namaAcara}</h2>
                <p className="text-sm mt-1">Tanggal: {format(new Date(kegiatan.tanggalMulai), "dd MMMM yyyy", { locale: localeId })} | Lokasi: {kegiatan.lokasi}</p>
            </div>

            {/* TABEL PESERTA YANG AKAN DICETAK */}
            <div className="border border-slate-200 rounded-xl overflow-hidden print:border-black print:rounded-none">
                <Table>
                    <TableHeader className="bg-slate-50 print:bg-transparent">
                        <TableRow className="print:border-black">
                            <TableHead className="w-50px text-center print:text-black font-bold border-r print:border-black">No.</TableHead>
                            <TableHead className="print:text-black font-bold border-r print:border-black">Nama Lengkap</TableHead>
                            <TableHead className="print:text-black font-bold border-r print:border-black">Sektor</TableHead>
                            <TableHead className="print:text-black font-bold border-r print:border-black">No. Telepon</TableHead>
                            <TableHead className="w-150px text-center print:text-black font-bold">Tanda Tangan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {daftarPeserta.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-slate-500 h-32">Belum ada peserta yang mendaftar.</TableCell>
                            </TableRow>
                        ) : (
                            daftarPeserta.map((peserta, index) => (
                                <TableRow key={peserta.id} className="print:border-black">
                                    <TableCell className="text-center font-medium border-r print:border-black">{index + 1}</TableCell>
                                    <TableCell className="font-semibold text-slate-900 border-r print:border-black">{peserta.user.namaLengkap}</TableCell>
                                    <TableCell className="border-r print:border-black">{peserta.user.sektor || "-"}</TableCell>
                                    <TableCell className="border-r print:border-black">{peserta.user.nomorTelepon || "-"}</TableCell>
                                    <TableCell className="relative h-12">
                                        {/* Kolom kosong untuk TTD saat di-print */}
                                        <span className="absolute top-1 left-2 text-[10px] text-slate-300 print:text-black">{index + 1}.</span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* INFO TAMBAHAN SAAT PRINT */}
            <div className="hidden print:flex justify-end mt-12 pr-12">
                <div className="text-center">
                    <p className="mb-20">Mengetahui,</p>
                    <p className="font-bold border-b border-black inline-block px-8">Parhalado HKBP</p>
                </div>
            </div>
        </div>
    );
}