import Link from "next/link";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarDays, MapPin, Clock, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Fungsi fetch data (Server Component)
async function getPublicKegiatan() {
    return await prisma.kegiatan.findMany({
        where: {
            tanggalMulai: {
                gte: new Date(), // Hanya tampilkan acara hari ini dan ke depannya
            },
        },
        orderBy: {
            tanggalMulai: 'asc',
        },
    });
}

export default async function JadwalPublikPage() {
    const jadwalList = await getPublicKegiatan();

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Header / Hero Section dengan Animasi Gradasi */}
            <div className="relative overflow-hidden bg-white border-b">
                <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-indigo-50 opacity-50" />
                <div className="relative mx-auto max-w-5xl px-6 py-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Badge variant="outline" className="mb-4 bg-white/50 text-blue-700 border-blue-200">
                        Terbuka untuk Umum
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl mb-4">
                        Jadwal Kegiatan <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-indigo-600">
                            HKBP Pondok Kopi
                        </span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-slate-600">
                        Temukan informasi lengkap mengenai jadwal ibadah, persekutuan, dan kegiatan gereja lainnya. Mari bertumbuh bersama dalam iman.
                    </p>
                    <div className="mt-8">
                        <Link href="/">
                            <Button variant="outline" className="rounded-full px-6 transition-transform hover:scale-105">
                                Kembali ke Beranda
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Grid Cards Section */}
            <div className="mx-auto max-w-6xl px-6 mt-12">
                {jadwalList.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                        <CalendarDays className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">Belum ada jadwal</h3>
                        <p className="text-slate-500">Saat ini belum ada jadwal kegiatan yang akan datang.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {jadwalList.map((kegiatan, index) => {
                            // Menambahkan delay staggered animation pada render
                            const animationDelay = `animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards delay-[${index * 150}ms]`;

                            return (
                                <Card
                                    key={kegiatan.id}
                                    className={`group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${animationDelay}`}
                                >
                                    {/* Ornamen Garis Gradasi di Atas Card */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 to-indigo-500 transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                                                {kegiatan.kategori || "Umum"}
                                            </Badge>
                                            <span className="text-xs font-medium text-slate-400">
                                                {format(new Date(kegiatan.createdAt), "dd MMM yyyy", { locale: localeId })}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold leading-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                                            {kegiatan.namaAcara}
                                        </h3>
                                    </CardHeader>

                                    <CardContent className="space-y-4 pb-6">
                                        <p className="text-sm text-slate-600 line-clamp-2">
                                            {kegiatan.deskripsi || "Tidak ada deskripsi tersedia."}
                                        </p>

                                        <div className="space-y-2 text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="h-4 w-4 text-blue-500" />
                                                <span className="font-medium text-slate-900">
                                                    {format(new Date(kegiatan.tanggalMulai), "EEEE, dd MMMM yyyy", { locale: localeId })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-blue-500" />
                                                <span>
                                                    {format(new Date(kegiatan.tanggalMulai), "HH:mm", { locale: localeId })} WIB
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                                <span className="line-clamp-1">{kegiatan.lokasi || "Lokasi belum ditentukan"}</span>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pt-0">
                                        <Link href="/login" className="w-full">
                                            <Button
                                                variant="secondary"
                                                className="w-full group/btn overflow-hidden relative bg-slate-100 hover:bg-blue-600 hover:text-white transition-all duration-300"
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    Daftar Sekarang
                                                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                                </span>
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}