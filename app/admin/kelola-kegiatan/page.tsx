import { getDaftarKegiatan } from "@/actions/kegiatan";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Clock, Users, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FormTambahKegiatan from "@/components/forms/FormTambahKegiatan";
import RowActionKegiatan from "@/components/forms/RowActionKegiatan";
import CallToActionAlert from "@/components/CallToActionAlert";

export default async function KelolaKegiatanPage() {
    // Ambil data terpisah
    const kegiatanUmum = await getDaftarKegiatan("UMUM");
    const kegiatanKhusus = await getDaftarKegiatan("KHUSUS");

    const renderTableBody = (data: typeof kegiatanUmum) => {
        if (data.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 h-40">Belum ada jadwal kegiatan.</TableCell>
                </TableRow>
            );
        }
        return data.map((kegiatan) => (
            <TableRow key={kegiatan.id} className="hover:bg-indigo-50/50 transition-colors group">
                <TableCell className="font-medium text-slate-900 py-4 pl-6">
                    {kegiatan.namaAcara}
                    <div className="text-xs text-slate-500 font-normal mt-1">{kegiatan.kategori}</div>
                </TableCell>
                <TableCell>
                    <div className="flex flex-col text-sm text-slate-600">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-indigo-400" /> {format(new Date(kegiatan.tanggalMulai), "dd MMM yyyy", { locale: localeId })}</span>
                        <span className="ml-4">{format(new Date(kegiatan.tanggalMulai), "HH:mm", { locale: localeId })} WIB</span>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 text-indigo-400" /> {kegiatan.lokasi || "-"}
                    </div>
                </TableCell>
                <TableCell className="text-center">
                    {/* TOMBOL LIHAT PESERTA / DAFTAR HADIR */}
                    <Link href={`/admin/kelola-kegiatan/${kegiatan.id}`}>
                        <Button variant="outline" size="sm" className="rounded-lg text-blue-600 border-blue-200 hover:bg-blue-50">
                            <Users className="h-4 w-4 mr-2" /> Peserta
                        </Button>
                    </Link>
                </TableCell>

                <TableCell className="text-right pr-6">
                    <RowActionKegiatan kegiatan={kegiatan} />
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                        <CalendarDays className="h-8 w-8 text-indigo-600" /> Kelola Kegiatan
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">Buat jadwal ibadah umum dan pantau daftar peserta.</p>
                </div>
                <div className="shrink-0">
                    <FormTambahKegiatan />
                </div>
            </div>

            <Tabs defaultValue="umum" className="w-full">
                <div className="flex justify-center">
                    <TabsList className="grid w-full max-w-md grid-cols-2 mb-4 bg-white shadow-sm rounded-xl p-1">
                        <TabsTrigger value="umum" className="rounded-lg">Ibadah / Acara Umum</TabsTrigger>
                        <TabsTrigger value="khusus" className="rounded-lg">Layanan Khusus Jemaat</TabsTrigger>
                    </TabsList>
                </div>

                {["umum", "khusus"].map((tab) => (
                    <TabsContent key={tab} value={tab} className="animate-in fade-in duration-300">
                        {tab === "khusus" && (
                            <CallToActionAlert
                                variant="warning"
                                icon={ClipboardList}
                                title="Tinjau Pengajuan Masuk"
                                description={
                                    <>Pengajuan layanan khusus yang belum di-ACC <strong>tidak akan tampil di tabel ini</strong>. Silakan periksa halaman persetujuan.</>
                                }
                                actionText="Buka Persetujuan"
                                actionLink="/admin/persetujuan"
                            />
                        )}
                        <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-white gap-0">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg font-bold text-slate-800">
                                    Daftar {tab === "umum" ? "Kegiatan Umum" : "Layanan Khusus"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow className="hover:bg-transparent border-slate-100">
                                            <TableHead className="text-slate-600 font-semibold py-4 pl-6">Nama Acara</TableHead>
                                            <TableHead className="text-slate-600 font-semibold">Waktu</TableHead>
                                            <TableHead className="text-slate-600 font-semibold">Lokasi</TableHead>
                                            <TableHead className="text-slate-600 font-semibold text-center">Daftar Hadir</TableHead>
                                            <TableHead className="text-slate-600 font-semibold text-right pr-6">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {renderTableBody(tab === "umum" ? kegiatanUmum : kegiatanKhusus)}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}