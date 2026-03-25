import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Church, CalendarCheck, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50">
      {/* Ornamen Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] h-400px w-400px rounded-full bg-blue-300/30 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-400px w-400px rounded-full bg-indigo-300/30 blur-[100px] pointer-events-none" />

      <main className="z-10 flex w-full max-w-4xl flex-col items-center px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">

        {/* Ikon Utama Hero */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-blue-600 shadow-xl shadow-blue-900/5 ring-1 ring-slate-900/5 rotate-3 transition-transform hover:rotate-0 duration-300">
          <Church className="h-12 w-12" />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Sistem Informasi <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-indigo-600">
              HKBP Pondok Kopi
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600">
            Portal resmi pendaftaran kegiatan dan komunikasi jemaat. Silakan masuk untuk mengakses jadwal ibadah, mendaftar acara, dan memperbarui profil Anda.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full rounded-full text-md h-14 px-8 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-1">
              Masuk / Login
            </Button>
          </Link>
          <Link href="/jadwal-publik" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full rounded-full text-md h-14 px-8 border-slate-300 bg-white hover:bg-slate-50 transition-all hover:-translate-y-1">
              Lihat Jadwal Terbuka
            </Button>
          </Link>
        </div>

        {/* Fitur Highlights Pendek di bawah hero */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left max-w-2xl w-full border-t border-slate-200 pt-10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Jadwal Terintegrasi</h3>
              <p className="text-sm text-slate-500 mt-1">Lihat dan daftar kegiatan gereja langsung dari perangkat Anda.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-100 text-indigo-700">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Manajemen Data</h3>
              <p className="text-sm text-slate-500 mt-1">Pembaruan data jemaat dan sektor yang lebih tertata dan rapi.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}