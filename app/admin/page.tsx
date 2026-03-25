import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, TrendingUp } from "lucide-react";
import prisma from "@/lib/prisma"; // Jika Anda ingin memanggil total data secara live

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    // (Opsional) Mengambil data asli dari database
    const totalJemaat = await prisma.user.count({ where: { role: "JEMAAT" } });
    const totalKegiatan = await prisma.kegiatan.count();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Selamat datang kembali, {session?.user?.name}. Berikut adalah ringkasan sistem hari ini.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Card Total Jemaat */}
                <Card className="rounded-2xl border-none shadow-md overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 transition-all group-hover:w-2" />
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Jemaat Terdaftar</CardTitle>
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900">{totalJemaat}</div>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" /> +2 bulan ini
                        </p>
                    </CardContent>
                </Card>

                {/* Card Kegiatan Aktif */}
                <Card className="rounded-2xl border-none shadow-md overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 transition-all group-hover:w-2" />
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-slate-600">Kegiatan Berjalan</CardTitle>
                        <div className="bg-indigo-100 p-2 rounded-lg">
                            <CalendarCheck className="h-5 w-5 text-indigo-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900">{totalKegiatan}</div>
                        <p className="text-xs text-slate-500 mt-2">Jadwal ibadah & persekutuan</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}