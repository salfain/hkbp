import { getDashboardMetrics } from "@/actions/admin-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, ClipboardList, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
    const metrics = await getDashboardMetrics();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard Parhalado</h1>
                <p className="text-slate-500 mt-1 text-sm">Ringkasan data dan notifikasi sistem manajemen HKBP.</p>
            </div>

            {/* NOTIFIKASI PENTING (MUNCUL JIKA ADA PENDING) */}
            {(metrics.jemaatPending > 0 || metrics.pengajuanPending > 0) && (
                <div className="grid gap-4 md:grid-cols-2">
                    {metrics.jemaatPending > 0 && (
                        <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-full text-orange-600"><UserPlus className="h-5 w-5" /></div>
                                <div>
                                    <h3 className="font-bold text-orange-900">Pendaftaran Baru!</h3>
                                    <p className="text-sm text-orange-700">{metrics.jemaatPending} jemaat menunggu di-ACC.</p>
                                </div>
                            </div>
                            <Link href="/admin/kelola-jemaat">
                                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl">Review</Button>
                            </Link>
                        </div>
                    )}
                    {metrics.pengajuanPending > 0 && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-full text-blue-600"><ClipboardList className="h-5 w-5" /></div>
                                <div>
                                    <h3 className="font-bold text-blue-900">Pengajuan Layanan Khusus!</h3>
                                    <p className="text-sm text-blue-700">{metrics.pengajuanPending} layanan menunggu persetujuan.</p>
                                </div>
                            </div>
                            <Link href="/admin/persetujuan">
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">Review</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* METRIK STATISTIK */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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