import PublicNavbar from "@/components/layouts/PublicNav";
import { getKegiatanMendatangPublic } from "@/actions/publik";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin, ArrowRight, HeartHandshake, Church } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default async function HomePage() {
  const kegiatanMendatang = await getKegiatanMendatangPublic();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      <PublicNavbar />
      <main className="grow pt-16">
        {/* HERO SECTION */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 bg-linear-to-br from-blue-900 via-indigo-900 to-slate-900 flex items-center justify-center text-center px-4 overflow-hidden">
          {/* Ornamen Latar */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px]" />

          <div className="relative z-10 max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Gereja HKBP <br className="hidden md:block" /> Pondok Kopi
            </h1>
            <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
              Melayani dengan kasih, bertumbuh dalam iman, dan menjadi berkat bagi sesama. Temukan informasi jadwal ibadah dan kegiatan gereja di sini.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button className="h-12 px-8 rounded-full bg-white text-blue-900 hover:bg-blue-50 text-base font-bold shadow-xl transition-all hover:scale-105">
                  Masuk Portal Jemaat
                </Button>
              </Link>
              <Link href="/profil-gereja">
                <Button variant="outline" className="h-12 px-8 rounded-full border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white backdrop-blur-md text-base font-semibold transition-all">
                  Kenali Kami Lebih Dekat
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* KEGIATAN UMUM MENDATANG */}
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                <CalendarDays className="h-8 w-8 text-blue-600" /> Jadwal Kegiatan
              </h2>
              <p className="text-slate-500">Ibadah dan acara umum yang akan datang dalam waktu dekat.</p>
            </div>
            <Link href="/agenda">
              <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 rounded-xl font-semibold">
                Lihat Semua Agenda <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kegiatanMendatang.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white border border-slate-200 rounded-3xl shadow-sm">
                <p className="text-slate-500">Belum ada jadwal kegiatan baru.</p>
              </div>
            ) : (
              kegiatanMendatang.map((kegiatan, index) => (
                <Card key={kegiatan.id} className={`rounded-3xl border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-8`} style={{ animationDelay: `${index * 150}ms` }}>
                  <CardContent className="py-4 px-6 flex flex-col h-full justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex flex-col items-start gap-4">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md">
                          {kegiatan.kategori || "Umum"}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight line-clamp-2">
                          {kegiatan.namaAcara}
                        </h3>
                      </div>
                      <div className="space-y-2.5 text-sm text-slate-600">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-slate-50 rounded-md"><CalendarDays className="h-4 w-4 text-blue-500" /></div>
                          <span>{format(new Date(kegiatan.tanggalMulai), "EEEE, dd MMM yyyy • HH:mm", { locale: localeId })} WIB</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 bg-slate-50 rounded-md shrink-0"><MapPin className="h-4 w-4 text-blue-500" /></div>
                          <span className="line-clamp-2 mt-0.5">{kegiatan.lokasi || "Gedung Gereja"}</span>
                        </div>
                      </div>
                    </div>
                    {/* Sesuai PDF: Klik Daftar -> Arahkan ke Login */}
                    <Link href="/login" className="w-full">
                      <Button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold">
                        Ikuti Kegiatan Ini
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm flex flex-col items-center justify-center gap-2">
          <Church className="h-6 w-6 text-slate-600 mb-2" />
          <p>&copy; {new Date().getFullYear()} HKBP Pondok Kopi. Hak Cipta Dilindungi.</p>
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-1">
            Dibuat dengan <HeartHandshake className="h-3 w-3 text-red-500" /> untuk pelayanan.
          </p>
        </div>
      </footer>
    </div>
  );
}