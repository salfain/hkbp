import PublicNavbar from "@/components/layouts/PublicNav";
import { BookOpen, Users, Heart } from "lucide-react";

export default function ProfilGerejaPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <PublicNavbar />

            <main className="grow pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-4 md:px-8">

                    {/* Header Page */}
                    <div className="text-center space-y-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Profil HKBP Pondok Kopi</h1>
                        <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full" />
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Mengenal lebih dekat pelayanan, sejarah, dan visi misi gereja kami di tengah masyarakat.
                        </p>
                    </div>

                    <div className="grid gap-12">
                        {/* Sejarah Singkat */}
                        <section className="flex flex-col md:flex-row gap-8 items-start animate-in fade-in duration-700 delay-100">
                            <div className="bg-blue-50 p-4 rounded-2xl shrink-0 text-blue-600">
                                <BookOpen className="h-8 w-8" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-2xl font-bold text-slate-900">Sejarah Singkat</h2>
                                <p className="text-slate-600 leading-relaxed text-justify">
                                    Huria Kristen Batak Protestan (HKBP) Pondok Kopi berdiri sebagai wujud nyata kerinduan jemaat di daerah timur Jakarta untuk memiliki tempat beribadah yang dekat dengan komunitas mereka. Sejak awal berdirinya, gereja ini terus berkembang bukan hanya dalam pembangunan fisik, tetapi juga dalam kuantitas dan kualitas pelayanan iman jemaatnya.
                                </p>
                            </div>
                        </section>

                        {/* Visi & Misi */}
                        <section className="flex flex-col md:flex-row gap-8 items-start animate-in fade-in duration-700 delay-200">
                            <div className="bg-indigo-50 p-4 rounded-2xl shrink-0 text-indigo-600">
                                <Heart className="h-8 w-8" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-2xl font-bold text-slate-900">Visi & Misi</h2>
                                <p className="text-slate-600 leading-relaxed font-medium italic">
                                    {"Menjadi Gereja yang Inklusif, Berakar dalam Firman, dan Berdampak bagi Dunia."}
                                </p>
                                <ul className="list-disc list-inside text-slate-600 leading-relaxed space-y-2 ml-2">
                                    <li>Meningkatkan kualitas ibadah yang khusyuk dan membawa damai sejahtera.</li>
                                    <li>Membina generasi muda (Naposobulon & Remaja) agar memiliki karakter Kristus.</li>
                                    <li>Mempererat tali persaudaraan (Diakonia) baik internal jemaat maupun masyarakat sekitar.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Pelayanan & Sektor */}
                        <section className="flex flex-col md:flex-row gap-8 items-start animate-in fade-in duration-700 delay-300">
                            <div className="bg-emerald-50 p-4 rounded-2xl shrink-0 text-emerald-600">
                                <Users className="h-8 w-8" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-2xl font-bold text-slate-900">Parhalado & Sektor Pelayanan</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Pelayanan di HKBP Pondok Kopi didukung penuh oleh barisan Parhalado (Majelis/Sintua) yang berdedikasi tinggi. Gereja juga membagi wilayah domisili jemaat ke dalam beberapa Wijk / Sektor (Contoh: Sektor 1 hingga Sektor X) guna mempermudah pelayanan kunjungan rumah, ibadah sektor tangga, dan koordinasi jemaat.
                                </p>
                            </div>
                        </section>
                    </div>

                </div>
            </main>
        </div>
    );
}