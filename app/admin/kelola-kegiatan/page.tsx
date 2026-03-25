import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { getDaftarKegiatan } from "@/actions/kegiatan";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import FormTambahKegiatan from "@/components/forms/FormTambahKegiatan";

export default async function KelolaKegiatanPage() {
    const dataKegiatan = await getDaftarKegiatan();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                        <CalendarDays className="h-8 w-8 text-indigo-600" />
                        Kelola Kegiatan
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">Buat dan pantau jadwal ibadah serta acara gereja.</p>
                </div>
                <div className="shrink-0">
                    <FormTambahKegiatan />
                </div>
            </div>

            <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg font-bold text-slate-800">Daftar Jadwal Acara</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow className="hover:bg-transparent border-slate-100">
                                <TableHead className="text-slate-600 font-semibold py-4 pl-6">Nama Acara</TableHead>
                                <TableHead className="text-slate-600 font-semibold">Waktu</TableHead>
                                <TableHead className="text-slate-600 font-semibold">Lokasi</TableHead>
                                <TableHead className="text-slate-600 font-semibold text-right pr-6">Kategori</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataKegiatan.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-slate-500 h-40">
                                        Belum ada jadwal kegiatan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                dataKegiatan.map((kegiatan) => (
                                    <TableRow key={kegiatan.id} className="hover:bg-indigo-50/50 transition-colors group">
                                        <TableCell className="font-medium text-slate-900 py-4 pl-6">
                                            {kegiatan.namaAcara}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Clock className="h-4 w-4 text-indigo-400" />
                                                {format(new Date(kegiatan.tanggalMulai), "dd MMM yyyy, HH:mm", { locale: localeId })} WIB
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <MapPin className="h-4 w-4 text-indigo-400" />
                                                {kegiatan.lokasi || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                                                {kegiatan.kategori}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}