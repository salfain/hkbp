import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getKegiatanTersedia } from "@/actions/pendaftaran";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import TombolDaftar from "@/components/Button";

export default async function DaftarKegiatanPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id as string;

    // Tarik semua kegiatan mendatang
    const kegiatanList = await getKegiatanTersedia(userId);

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                    <CalendarDays className="h-6 w-6 text-blue-600" />
                    Jadwal Terbuka
                </h1>
                <p className="text-slate-500 mt-1 text-sm">
                    Silakan mendaftar pada jadwal ibadah atau kegiatan di bawah ini.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {kegiatanList.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-white border border-dashed rounded-2xl">
                        Belum ada jadwal kegiatan baru yang tersedia.
                    </div>
                ) : (
                    kegiatanList.map((kegiatan) => {
                        // Cek apakah user sudah mendaftar di kegiatan ini (karena kita melakukan 'include pendaftaran' di server action)
                        const isRegistered = kegiatan.pendaftaran.length > 0;

                        return (
                            <Card key={kegiatan.id} className="rounded-2xl border-slate-200 shadow-sm flex flex-col">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                            {kegiatan.kategori || "Umum"}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                        {kegiatan.namaAcara}
                                    </h3>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                                    <div className="text-sm text-slate-600 space-y-2">
                                        <div className="flex items-start gap-2">
                                            <Clock className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                                            <span>
                                                {format(new Date(kegiatan.tanggalMulai), "EEEE, dd MMMM yyyy", { locale: localeId })}<br />
                                                Pukul {format(new Date(kegiatan.tanggalMulai), "HH:mm", { locale: localeId })} WIB
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                                            <span className="line-clamp-2">{kegiatan.lokasi}</span>
                                        </div>
                                        {kegiatan.deskripsi && (
                                            <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg italic">
                                                {`"${kegiatan.deskripsi}"`}
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-2 border-t border-slate-100">
                                        {/* Oper status pendaftaran ke Client Component */}
                                        <TombolDaftar
                                            userId={userId}
                                            kegiatanId={kegiatan.id}
                                            isRegistered={isRegistered}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}