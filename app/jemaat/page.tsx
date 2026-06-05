import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getKegiatanTersedia, getJadwalSaya } from "@/actions/pendaftaran";
import { Card } from "@/components/ui/card";
import { CalendarDays, MapPin, Clock, History, Send, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import MenuLayananKhusus from "@/components/layouts/MenuLayanan";
import { TombolDaftar } from "@/components/Button";
import Link from "next/link";

export default async function JemaatDashboard() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id as string;
    const firstName = session?.user?.name?.split(" ")[0] || "Jemaat";

    // 1. Tarik Kegiatan UMUM (dari Admin) yang bisa diikuti
    const kegiatanUmum = await getKegiatanTersedia(userId, "UMUM");

    // 2. Tarik History Kegiatan yang diikuti/diajukan user ini
    const historyKegiatan = await getJadwalSaya(userId);

    return (
        <div className="space-y-10 pb-10 animate-in fade-in duration-500">

            {/* HERO WELCOME */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-700 to-indigo-800 p-8 shadow-lg text-white">
                <div className="relative z-10 space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight">Horas, {firstName}!</h1>
                    <p className="text-blue-100 max-w-xl">
                        Selamat datang di portal pelayanan jemaat. Anda dapat melihat jadwal ibadah, mengajukan layanan khusus, dan memantau status pengajuan Anda.
                    </p>
                    <div className="pt-4">
                        <Link
                            href="/jemaat/chat"
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm transition-all hover:bg-blue-50 active:scale-[0.98]"
                        >
                            <MessageCircle className="h-4 w-4" />
                            Chat Admin
                        </Link>
                    </div>
                </div>
                {/* Ornamen */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            </div>

            {/* SEKSI 1: PENGAJUAN LAYANAN KHUSUS (SESUAI PDF) */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Send className="h-6 w-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-slate-900">Ajukan Layanan Khusus</h2>
                </div>
                {/* Memanggil Komponen 5 Menu yang kita buat di atas */}
                <MenuLayananKhusus userId={userId} />
            </section>

            {/* SEKSI 2: JADWAL KEGIATAN UMUM */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">Jadwal Ibadah & Kegiatan Umum</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {kegiatanUmum.length === 0 ? (
                        <div className="col-span-full py-8 text-center text-slate-500 bg-white border border-dashed rounded-2xl">
                            Belum ada jadwal ibadah umum terbaru.
                        </div>
                    ) : (
                        kegiatanUmum.map((kegiatan) => {
                            const isRegistered = kegiatan.pendaftaran.length > 0;
                            return (
                                <Card key={kegiatan.id} className="rounded-2xl border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                                    <div className="p-5 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                                {kegiatan.kategori || "Umum"}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 leading-tight">{kegiatan.namaAcara}</h3>
                                        <div className="text-sm text-slate-600 space-y-1.5">
                                            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400" /> {format(new Date(kegiatan.tanggalMulai), "dd MMM yyyy, HH:mm", { locale: localeId })} WIB</div>
                                            <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" /> <span className="line-clamp-2">{kegiatan.lokasi}</span></div>
                                        </div>
                                    </div>
                                    <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                                        {/* Gunakan TombolDaftar yang tipe UMUM saja */}
                                        <TombolDaftar userId={userId} kegiatanId={kegiatan.id} tipe="UMUM" isRegistered={isRegistered} />
                                    </div>
                                </Card>
                            )
                        })
                    )}
                </div>
            </section>

            {/* SEKSI 3: HISTORY / RIWAYAT KEGIATAN (SESUAI PDF POIN 5) */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <History className="h-6 w-6 text-emerald-600" />
                    <h2 className="text-xl font-bold text-slate-900">Riwayat & Status Pengajuan Anda</h2>
                </div>

                {historyKegiatan.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 bg-white border border-dashed border-slate-300 rounded-2xl">
                        Anda belum mengikuti kegiatan atau mengajukan layanan apapun.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {historyKegiatan.map((item) => (
                            <Card key={item.id} className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
                                <div className="flex items-center p-4 gap-4">
                                    <div className={`p-3 rounded-full shrink-0 ${item.kegiatan.tipeKegiatan === 'KHUSUS' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {item.kegiatan.tipeKegiatan === 'KHUSUS' ? <Send className="h-5 w-5" /> : <CalendarDays className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1 space-y-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 truncate">{item.kegiatan.namaAcara}</h3>
                                        <p className="text-xs text-slate-500">
                                            {format(new Date(item.kegiatan.tanggalMulai), "dd MMM yyyy", { locale: localeId })}
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        {/* Status Badge */}
                                        {item.status === "MENUNGGU_ACC" && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">MENUNGGU ACC</span>}
                                        {item.status === "TERDAFTAR" && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">TERDAFTAR {item.kegiatan.tipeKegiatan === 'KHUSUS' && "(DISETUJUI)"}</span>}
                                        {item.status === "DITOLAK" && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">DITOLAK</span>}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
