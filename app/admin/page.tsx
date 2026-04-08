import { getDashboardMetrics } from "@/actions/admin-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, ClipboardList, CalendarDays } from "lucide-react";
import CallToActionAlert from "@/components/CallToActionAlert";

export default async function AdminDashboardPage() {
    const metrics = await getDashboardMetrics();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard Parhalado</h1>
                <p className="text-slate-500 mt-1 text-sm">Ringkasan data dan notifikasi sistem manajemen HKBP.</p>
            </div>

            {(metrics.jemaatPending > 0 || metrics.pengajuanPending > 0) && (
                <div className="grid gap-4 md:grid-cols-2">
                    {metrics.jemaatPending > 0 && (
                        <CallToActionAlert
                            variant="warning"
                            icon={UserPlus}
                            title="Pendaftaran Baru!"
                            description={`${metrics.jemaatPending} jemaat menunggu di-ACC.`}
                            actionText="Review"
                            actionLink="/admin/kelola-jemaat"
                            className="mb-0 h-full"
                        />
                    )}
                    {metrics.pengajuanPending > 0 && (
                        <CallToActionAlert
                            variant="info"
                            icon={ClipboardList}
                            title="Pengajuan Layanan Khusus!"
                            description={`${metrics.pengajuanPending} layanan menunggu persetujuan.`}
                            actionText="Review"
                            actionLink="/admin/persetujuan"
                            className="mb-0 h-full"
                        />
                    )}
                </div>
            )}

            {/* METRIK STATISTIK */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="rounded-2xl border-none shadow-md bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl"><Users className="h-8 w-8" /></div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Jemaat Aktif</p>
                            <h2 className="text-3xl font-extrabold text-slate-900">{metrics.totalJemaatAktif}</h2>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-none shadow-md bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl"><CalendarDays className="h-8 w-8" /></div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Agenda Mendatang</p>
                            <h2 className="text-3xl font-extrabold text-slate-900">{metrics.kegiatanMendatang}</h2>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}