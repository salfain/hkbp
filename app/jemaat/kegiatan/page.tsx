import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getKegiatanTersedia } from "@/actions/pendaftaran";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarDays, MapPin, Clock, Info } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TombolDaftar } from "@/components/Button";

export default async function DaftarKegiatanPage() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id as string;

    const kegiatanUmum = await getKegiatanTersedia(userId, "UMUM");
    const kegiatanKhusus = await getKegiatanTersedia(userId, "KHUSUS");

    // Fungsi helper untuk merender list kegiatan
    const renderList = (list: typeof kegiatanUmum, tipe: "UMUM" | "KHUSUS") => {
        if (list.length === 0) {
            return (
                <div className="py-12 text-center text-slate-500 bg-white border border-dashed rounded-2xl">
                    Belum ada jadwal yang tersedia untuk kategori ini.
                </div>
            );
        }

        return (
            <div className="grid gap-4 sm:grid-cols-2">
                {list.map((kegiatan) => {
                    const pendaftaranInfo = kegiatan.pendaftaran[0]; // Cek pendaftaran user
                    const isRegistered = !!pendaftaranInfo;
                    const status = pendaftaranInfo?.status;

                    return (
                        <Card key={kegiatan.id} className="rounded-2xl border-slate-200 shadow-sm flex flex-col">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${tipe === 'UMUM' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                        {kegiatan.kategori || tipe}
                                    </span>
                                    {/* Badge Status untuk Kegiatan Khusus */}
                                    {isRegistered && status === "MENUNGGU_ACC" && (
                                        <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">MENUNGGU ACC</span>
                                    )}
                                    {isRegistered && status === "DITOLAK" && (
                                        <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full">DITOLAK</span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight">{kegiatan.namaAcara}</h3>
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
                                    {kegiatan.lokasi && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                                            <span className="line-clamp-2">{kegiatan.lokasi}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2 border-t border-slate-100">
                                    <TombolDaftar
                                        userId={userId}
                                        kegiatanId={kegiatan.id}
                                        tipe={tipe}
                                        isRegistered={isRegistered}
                                        status={status}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                    <CalendarDays className="h-6 w-6 text-blue-600" />
                    Pendaftaran Kegiatan
                </h1>
                <p className="text-slate-500 mt-1 text-sm">Pilih jadwal ibadah atau ajukan layanan khusus.</p>
            </div>

            <Tabs defaultValue="umum" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-100 p-1 rounded-xl">
                    <TabsTrigger value="umum" className="rounded-lg">Kegiatan Umum</TabsTrigger>
                    <TabsTrigger value="khusus" className="rounded-lg">Layanan Khusus</TabsTrigger>
                </TabsList>

                <TabsContent value="umum" className="animate-in fade-in duration-300">
                    {renderList(kegiatanUmum, "UMUM")}
                </TabsContent>

                <TabsContent value="khusus" className="animate-in fade-in duration-300">
                    <div className="mb-4 bg-purple-50 p-3 rounded-xl flex gap-3 items-start border border-purple-100">
                        <Info className="h-5 w-5 text-purple-600 shrink-0" />
                        <p className="text-xs text-purple-800">
                            Pendaftaran untuk Sidi, Baptis, Pernikahan, dan Pindah Gereja memerlukan persetujuan (ACC) dari Parhalado/Admin.
                        </p>
                    </div>
                    {renderList(kegiatanKhusus, "KHUSUS")}
                </TabsContent>
            </Tabs>
        </div>
    );
}