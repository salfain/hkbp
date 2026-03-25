import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck2, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function JemaatDashboard() {
    const session = await getServerSession(authOptions);
    const firstName = session?.user?.name?.split(" ")[0] || "Jemaat";

    return (
        <div className="space-y-8 pb-10">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-700 to-indigo-800 p-8 shadow-xl text-white">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10 space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight">Horas, {firstName}!</h1>
                    <p className="text-blue-100 max-w-md">
                        Selamat datang di portal jemaat. Anda dapat melihat jadwal kegiatan dan mendaftar acara gereja melalui halaman ini.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Card Kegiatan Mendatang */}
                <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-slate-100 mb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                            <CalendarCheck2 className="h-5 w-5 text-blue-600" />
                            Jadwal Anda
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center text-center py-8">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                            <CalendarCheck2 className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-900 mb-1">Belum ada acara</p>
                        <p className="text-xs text-slate-500 mb-4">Anda belum terdaftar pada kegiatan apapun dalam waktu dekat.</p>
                        <Button variant="outline" className="rounded-full text-blue-600 border-blue-200 hover:bg-blue-50">
                            Lihat Jadwal Gereja
                        </Button>
                    </CardContent>
                </Card>

                {/* Card Notifikasi */}
                <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-slate-100 mb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                            <BellRing className="h-5 w-5 text-amber-500" />
                            Papan Pengumuman
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
                            <p className="text-sm text-blue-900 font-medium">Pembaruan Profil</p>
                            <p className="text-xs text-blue-700 mt-1">
                                Pastikan nomor WhatsApp dan Sektor Anda sudah sesuai agar tidak ketinggalan informasi.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}