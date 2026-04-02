import PublicNavbar from "@/components/layouts/PublicNav";
import { getAgendaLampau } from "@/actions/publik";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, MapPin } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default async function AgendaPage() {
    const agendaLampau = await getAgendaLampau();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <PublicNavbar />

            <main className="grow pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">

                    <div className="text-center space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Riwayat Kegiatan</h1>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Arsip agenda dan pelayanan gereja yang telah sukses diselenggarakan.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {agendaLampau.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-white border border-dashed border-slate-300 rounded-3xl">
                                <p className="text-slate-500 font-medium">Belum ada riwayat kegiatan tercatat.</p>
                            </div>
                        ) : (
                            agendaLampau.map((kegiatan, i) => (
                                <Card key={kegiatan.id} className="rounded-2xl border-none shadow-sm bg-white overflow-hidden opacity-80 hover:opacity-100 transition-opacity animate-in fade-in zoom-in-95" style={{ animationDelay: `${i * 100}ms` }}>
                                    <CardContent className="p-5 flex flex-col gap-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CalendarCheck className="h-5 w-5 text-emerald-500" />
                                            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Selesai</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 leading-tight">
                                            {kegiatan.namaAcara}
                                        </h3>
                                        <div className="text-xs text-slate-500 space-y-1">
                                            <p>{format(new Date(kegiatan.tanggalMulai), "dd MMMM yyyy", { locale: localeId })}</p>
                                            <p className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3" /> {kegiatan.lokasi || "-"}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}