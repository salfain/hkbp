import { getDaftarJemaat } from "@/actions/jemaat";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FormTambahJemaat from "@/components/forms/FormTambahJemaat";
import SearchComp from "@/components/Search"; // Pastikan path ini benar
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, UserPlus, Users } from "lucide-react";
import { Suspense } from "react";
import RowActionJemaat from "@/components/forms/RowActionJemaat";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Jemaat } from "@/types/jemaat";
import CallToActionAlert from "@/components/CallToActionAlert";

export default async function KelolaJemaatPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>;
}) {
    const resolvedParams = await searchParams;
    const query = resolvedParams?.query || "";
    const dataJemaat = await getDaftarJemaat(query);
    const adaPendingJemaat = dataJemaat.some((jemaat: Jemaat) => jemaat.statusAkun === "PENDING");

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                        <Users className="h-8 w-8 text-blue-600" />
                        Kelola Data Jemaat
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">
                        Manajemen profil, kontak, dan penempatan sektor jemaat.
                    </p>
                </div>
                <div className="shrink-0">
                    <FormTambahJemaat />
                </div>
            </div>
            {adaPendingJemaat && (
                <CallToActionAlert
                    variant="info"
                    icon={UserPlus}
                    title="Persetujuan Anggota Baru"
                    description="Terdapat pendaftaran akun jemaat baru yang berstatus MENUNGGU ACC. Silakan setujui (ACC) atau tolak melalui tombol Aksi (Titik Tiga) di tabel bawah ini."
                />
            )}
            <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-white gap-0">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <CardTitle className="text-lg font-bold text-slate-800">Daftar Jemaat Terdaftar</CardTitle>
                        <Suspense fallback={<div className="h-11 w-full max-w-sm animate-pulse rounded-xl bg-slate-100" />}>
                            <SearchComp />
                        </Suspense>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow className="hover:bg-transparent border-slate-100">
                                <TableHead className="w-300px text-slate-600 font-semibold py-4 pl-6">Nama Lengkap</TableHead>
                                <TableHead className="text-slate-600 font-semibold">Email</TableHead>
                                <TableHead className="text-slate-600 font-semibold">Tanggal Lahir</TableHead>
                                <TableHead className="text-slate-600 font-semibold">No. Telepon / WA</TableHead>
                                <TableHead className="text-slate-600 font-semibold text-center">Wijk / Sektor</TableHead>
                                <TableHead className="text-slate-600 font-semibold text-center">Status</TableHead>
                                <TableHead className="text-slate-600 font-semibold text-right pr-6">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataJemaat.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-slate-500 h-40 bg-slate-50/30">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="bg-slate-100 p-3 rounded-full">
                                                <Users className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <p className="font-medium text-slate-600">
                                                {query ? "Data tidak ditemukan" : "Belum ada data jemaat"}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                dataJemaat.map((jemaat: Jemaat) => (
                                    <TableRow
                                        key={jemaat.id}
                                        className="hover:bg-blue-50/50 transition-colors border-slate-100 group"
                                    >
                                        <TableCell className="font-medium text-slate-900 py-3 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs border border-blue-200 shadow-sm transition-transform group-hover:scale-110">
                                                    {jemaat.namaLengkap.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="truncate">{jemaat.namaLengkap}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-600">{jemaat.email}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Clock className="h-4 w-4 text-indigo-400" />
                                                {format(new Date(jemaat.tanggalLahir), "dd MMM yyyy", { locale: localeId })}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-600">{jemaat.nomorTelepon || "-"}</TableCell>
                                        <TableCell className="text-center">
                                            {jemaat.sektor ? (
                                                <span className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                                                    {jemaat.sektor}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {jemaat.statusAkun === "PENDING" && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">MENUNGGU ACC</span>}
                                            {jemaat.statusAkun === "AKTIF" && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">AKTIF</span>}
                                            {jemaat.statusAkun === "DITOLAK" && <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">DITOLAK</span>}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <RowActionJemaat jemaat={jemaat} />
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