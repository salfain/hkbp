import { getDaftarKegiatan } from "@/actions/kegiatan";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, Download } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default async function LaporanPage() {
    // Ambil daftar kegiatan untuk dipilih sebagai laporan
    const kegiatanList = await getDaftarKegiatan();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="h-8 w-8 text-green-600" />
                    Ekspor Laporan
                </h1>
                <p className="text-slate-500 mt-1 text-sm">Unduh rekapitulasi kehadiran jemaat dalam format Excel (.xlsx)</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {kegiatanList.map((kegiatan) => (
                    <Card key={kegiatan.id} className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-all group">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg leading-tight text-slate-800 group-hover:text-green-700 transition-colors">
                                {kegiatan.namaAcara}
                            </CardTitle>
                            <CardDescription>
                                {format(new Date(kegiatan.tanggalMulai), "EEEE, dd MMMM yyyy", { locale: localeId })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Tombol Download akan menembak ke API Route yang mereturn file Blob */}
                            <a href={`/api/export-excel?kegiatanId=${kegiatan.id}`} download>
                                <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-50 text-green-700 font-semibold py-2.5 px-4 transition-colors hover:bg-green-600 hover:text-white border border-green-200 hover:border-green-600">
                                    <Download className="h-4 w-4" /> Unduh Data Kehadiran
                                </button>
                            </a>
                        </CardContent>
                    </Card>
                ))}

                {kegiatanList.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 border border-dashed rounded-2xl">
                        Belum ada kegiatan yang tersedia untuk diekspor.
                    </div>
                )}
            </div>
        </div>
    );
}