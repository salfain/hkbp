"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { ajukanLayananKhusus } from "@/actions/layanan-khusus";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, HeartHandshake, BookOpen, Droplets, Music, MapPin } from "lucide-react";

// Daftar 5 Kegiatan sesuai Requirement
const daftarLayanan = [
    { id: "Pemberkatan Pernikahan", icon: HeartHandshake, color: "text-rose-500", bg: "bg-rose-50", border: "hover:border-rose-300" },
    { id: "Sidi", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50", border: "hover:border-blue-300" },
    { id: "Baptisan Kudus", icon: Droplets, color: "text-cyan-500", bg: "bg-cyan-50", border: "hover:border-cyan-300" },
    { id: "Pelatihan Musik", icon: Music, color: "text-violet-500", bg: "bg-violet-50", border: "hover:border-violet-300" },
    { id: "Pindah Gereja", icon: MapPin, color: "text-amber-500", bg: "bg-amber-50", border: "hover:border-amber-300" },
];

export default function MenuLayananKhusus({ userId }: { userId: string }) {
    const [selectedLayanan, setSelectedLayanan] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.currentTarget);

        const res = await ajukanLayananKhusus(formData);
        setIsLoading(false);

        if (res.success) {
            toast.success(res.message);
            setSelectedLayanan(null); // Tutup modal
        } else {
            toast.error(res.message);
        }
    }

    return (
        <React.Fragment >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {daftarLayanan.map((item) => (
                    <Card
                        key={item.id}
                        onClick={() => setSelectedLayanan(item.id)}
                        className={`cursor-pointer rounded-2xl border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${item.border}`}
                    >
                        <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center text-center gap-3 h-full">
                            <div className={`p-3 rounded-2xl ${item.bg}`}>
                                <item.icon className={`h-8 w-8 ${item.color}`} />
                            </div>
                            <span className="font-semibold text-sm text-slate-800 leading-tight">
                                {item.id}
                            </span>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Modal Form Pengajuan */}
            <Dialog open={!!selectedLayanan} onOpenChange={(open) => !open && setSelectedLayanan(null)}>
                <DialogContent className="sm:max-w-lvh  rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Ajukan {selectedLayanan}</DialogTitle>
                        <DialogDescription>
                            Tentukan tanggal pelaksanaan yang diharapkan dan berikan keterangan detail agar Parhalado dapat me-review pengajuan Anda.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input type="hidden" name="userId" value={userId} />
                        <input type="hidden" name="kategori" value={selectedLayanan || ""} />

                        <div className="space-y-2">
                            <Label className="text-slate-700">Pilih Tanggal & Waktu Pelaksanaan</Label>
                            <Input name="tanggalPelaksanaan" type="datetime-local" required className="h-11 rounded-xl" />
                        </div>
                        {selectedLayanan === "Pemberkatan Pernikahan" && (
                            <div className="space-y-4 border-t pt-4">
                                <div className="grid grid-cols-2 gap-4 ">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-slate-800">Data Calon Pengantin Pria</h4>
                                        <Input name="namaPria" placeholder="Nama Lengkap Pria" required />
                                        <Input name="asalGerejaPria" placeholder="Asal Gereja Pria" required />
                                        <Input name="namaAyahPria" placeholder="Nama Ayah Pria" required />
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-slate-800">Data Calon Pengantin Perempuan</h4>
                                        <Input name="namaWanita" placeholder="Nama Lengkap Perempuan" required />
                                        <Input name="asalGerejaWanita" placeholder="Asal Gereja Perempuan" required />
                                        <Input name="namaAyahWanita" placeholder="Nama Ayah Perempuan" required />
                                    </div>
                                </div>

                                <h4 className="font-semibold text-slate-800 mt-4">Rencana Pelaksanaan</h4>
                                <Input name="tanggalPelaksanaan" type="datetime-local" required />
                            </div>
                        )}

                        {selectedLayanan === "Baptisan Kudus" && (
                            <div className="space-y-4 border-t pt-4">
                                <Input name="namaAnak" placeholder="Nama Lengkap Anak" required />
                                <Input name="tempatTanggalLahirAnak" placeholder="Tempat, Tanggal Lahir Anak" required />
                                <Input name="tanggalPelaksanaan" type="date" required />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label className="text-slate-700">Keterangan / Catatan Tambahan</Label>
                            <Textarea
                                name="catatan"
                                required
                                placeholder={`Contoh: Mohon dijadwalkan ${selectedLayanan} untuk anak kami yang bernama...`}
                                className="h-24 resize-none rounded-xl"
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" className="rounded-xl w-full sm:w-auto" onClick={() => setSelectedLayanan(null)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={isLoading} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Kirim Pengajuan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}