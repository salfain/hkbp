import { getPendaftaranMenunggu } from "@/actions/persetujuan";
import { Card, CardContent, } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { TombolPersetujuan } from "@/components/Button";

export default async function PersetujuanPage() {
    const pendaftaran = await getPendaftaranMenunggu();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                    <ClipboardList className="h-8 w-8 text-orange-600" />
                    Persetujuan Layanan Khusus
                </h1>
                <p className="text-slate-500 mt-1 text-sm">
                    Kelola pengajuan layanan khusus (Sidi, Pernikahan, Baptis, dll) dari jemaat.
                </p>
            </div>

            <div className="grid gap-4">
                {pendaftaran.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 bg-white border border-dashed rounded-2xl">
                        Tidak ada pengajuan baru yang menunggu persetujuan.
                    </div>
                ) : (
                    pendaftaran.map((item) => (
                        <Card key={item.id} className="rounded-2xl border-orange-100 shadow-sm bg-orange-50/30">
                            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-md uppercase">
                                        {item.kegiatan.kategori}
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-900 mt-2">{item.kegiatan.namaAcara}</h3>
                                    <p className="text-sm text-slate-600">
                                        <strong>Pengaju:</strong> {item.user.namaLengkap} ({item.user.nomorTelepon})<br />
                                        <strong>Catatan:</strong> {item.catatan || "-"}
                                    </p>
                                </div>
                                <div className="shrink-0 w-full sm:w-auto">
                                    <TombolPersetujuan pendaftaranId={item.id} />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}