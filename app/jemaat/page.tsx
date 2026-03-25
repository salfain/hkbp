import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getJadwalSaya } from "@/actions/pendaftaran";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck2, Clock, MapPin, BellRing } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function JemaatDashboard() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id as string;
    const firstName = session?.user?.name?.split(" ")[0] || "Jemaat";

    // Tarik data jadwal kegiatan yang sudah DIDAFTARKAN oleh user ini
    const jadwalSaya = await getJadwalSaya(userId);

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 to-indigo-800 p-6 md:p-8 shadow-lg text-white">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10 space-y-2">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Horas, {firstName}!</h1>
                    <p className="text-blue-100 text-sm md:text-base max-w-sm">
                        Damai sejahtera menyertai kita semua. Berikut adalah ringkasan jadwal pelayanan Anda.
                    </p>
                </div>
            </div>

            {/* Card Pengumuman / Notifikasi */}
            <Card className="rounded-2xl border-none shadow-sm bg-blue-50 border border-blue-100">
                <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-900">
                        <BellRing className="h-4 w-4 text-blue-600" /> Papan Pengumuman
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs md:text-sm text-blue-800 leading-relaxed">
                        Bagi jemaat yang belum melengkapi data profil seperti Tanggal Lahir dan Sektor, dimohon untuk segera memperbaruinya di menu Profil agar sistem notifikasi ulang tahun dapat berjalan dengan baik.
                    </p>
                </CardContent>
            </Card>

            <div className="grid gap-6">
                {/* Section Jadwal Saya */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <CalendarCheck2 className="h-5 w-5 text-blue-600" /> Jadwal Terdaftar
                        </h2>
                    </div>

                    {jadwalSaya.length === 0 ? (
                        <Card className="rounded-2xl border border-dashed border-slate-300 shadow-none bg-transparent">
                            <CardContent className="flex flex-col items-center justify-center text-center py-10">
                                <div className="bg-slate-100 p-4 rounded-full mb-3">
                                    <CalendarCheck2 className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="text-sm font-medium text-slate-900">Belum ada acara</p>
                                <p className="text-xs text-slate-500 mb-4 max-w-250px">
                                    Anda belum mendaftar kegiatan apapun. Silakan cek menu kegiatan untuk mendaftar.
                                </p>
                                <Link href="/jemaat/kegiatan">
                                    <Button variant="outline" className="rounded-xl text-blue-600 border-blue-200 bg-white hover:bg-blue-50">
                                        Cari Kegiatan
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {jadwalSaya.map((item) => (
                                <Card key={item.id} className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
                                    <div className="flex border-l-4 border-blue-500 p-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-slate-900 leading-tight">
                                                    {item.kegiatan.namaAcara}
                                                </h3>
                                                <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">
                                                    TERDAFTAR
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-600 space-y-1.5">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5 text-blue-500" />
                                                    <span>{format(new Date(item.kegiatan.tanggalMulai), "EEEE, dd MMM yyyy - HH:mm", { locale: localeId })} WIB</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5 text-blue-500" />
                                                    <span className="truncate">{item.kegiatan.lokasi}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
}