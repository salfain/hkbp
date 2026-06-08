import { getDashboardMetrics } from "@/actions/admin-dashboard";
import { AdminMembershipCharts } from "@/components/charts/AdminMembershipCharts";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, ClipboardList, CalendarDays, MessageCircle, UserCheck } from "lucide-react";
import CallToActionAlert from "@/components/CallToActionAlert";

export default async function AdminDashboardPage() {
    const metrics = await getDashboardMetrics();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard Parhalado</h1>
                <p className="text-slate-500 mt-1 text-sm">Ringkasan data dan notifikasi sistem manajemen HKBP.</p>
            </div>

            {(metrics.jemaatPending > 0 || metrics.pengajuanPending > 0 || metrics.percakapanAktif > 0) && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                    {metrics.percakapanAktif > 0 && (
                        <CallToActionAlert
                            variant="success"
                            icon={MessageCircle}
                            title="Percakapan Jemaat"
                            description={`${metrics.percakapanAktif} percakapan chat aktif.`}
                            actionText="Buka Chat"
                            actionLink="/admin/chat"
                            className="mb-0 h-full"
                        />
                    )}
                </div>
            )}

            {/* METRIK STATISTIK */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card className="rounded-2xl border-none shadow-md bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl"><Users className="h-8 w-8" /></div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Jumlah Jemaat</p>
                            <h2 className="text-3xl font-extrabold text-slate-900">{metrics.totalJemaat}</h2>
                            <p className="mt-1 text-xs text-slate-400">Semua status akun jemaat</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-none shadow-md bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl"><UserCheck className="h-8 w-8" /></div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Jemaat Aktif</p>
                            <h2 className="text-3xl font-extrabold text-slate-900">{metrics.totalJemaatAktif}</h2>
                            <p className="mt-1 text-xs text-slate-400">Akun yang sudah disetujui</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-none shadow-md bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl"><UserPlus className="h-8 w-8" /></div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Menunggu ACC</p>
                            <h2 className="text-3xl font-extrabold text-slate-900">{metrics.jemaatPending}</h2>
                            <p className="mt-1 text-xs text-slate-400">{metrics.jemaatDitolak} akun ditolak</p>
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

            <AdminMembershipCharts
                data={metrics.monthlyJemaatStats}
                totalJemaat={metrics.totalJemaat}
                totalJemaatAktif={metrics.totalJemaatAktif}
            />
        </div>
    );
}
