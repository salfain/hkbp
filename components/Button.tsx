"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, ArrowLeft, CheckCircle, XCircle, Clock, Printer } from "lucide-react";
import { daftarKegiatan, batalDaftarKegiatan } from "@/actions/pendaftaran";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ubahStatusPendaftaran } from "@/actions/persetujuan";

export function TombolDaftar({
    userId, kegiatanId, isRegistered, tipe, status
}: {
    userId: string; kegiatanId: string; isRegistered: boolean; tipe: "UMUM" | "KHUSUS"; status?: string;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [catatan, setCatatan] = useState("");

    // Fungsi untuk pendaftaran UMUM (Tanpa catatan)
    async function handleDaftarUmum() {
        setIsLoading(true);
        const res = await daftarKegiatan(userId, kegiatanId, "UMUM");
        setIsLoading(false);
        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    }

    // Fungsi untuk pendaftaran KHUSUS (Dengan catatan dari Modal)
    async function handleDaftarKhusus() {
        setIsLoading(true);
        const res = await daftarKegiatan(userId, kegiatanId, "KHUSUS", catatan);
        setIsLoading(false);

        if (res.success) {
            toast.success(res.message);
            setIsDialogOpen(false); // Tutup modal
        } else {
            toast.error(res.message);
        }
    }

    async function handleBatal() {
        if (!confirm("Yakin ingin membatalkan pendaftaran ini?")) return;
        setIsLoading(true);
        const res = await batalDaftarKegiatan(userId, kegiatanId);
        setIsLoading(false);
        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    }

    // --- RENDER JIKA SUDAH TERDAFTAR ---
    if (isRegistered) {
        if (status === "DITOLAK") {
            return <Button disabled className="w-full rounded-xl bg-slate-100 text-slate-400">Pengajuan Ditolak</Button>;
        }
        return (
            <Button
                variant="outline" onClick={handleBatal} disabled={isLoading}
                className={`w-full rounded-xl ${status === 'MENUNGGU_ACC' ? 'border-yellow-200 text-yellow-600 hover:bg-yellow-50' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (status === "MENUNGGU_ACC" ? "Batalkan Pengajuan" : "Batalkan Pendaftaran")}
            </Button>
        );
    }

    // --- RENDER JIKA BELUM TERDAFTAR ---
    if (tipe === "UMUM") {
        return (
            <Button onClick={handleDaftarUmum} disabled={isLoading} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="mr-2 h-4 w-4" /> Daftar Sekarang</>}
            </Button>
        );
    }

    // JIKA TIPE KHUSUS, RENDER TOMBOL YANG MEMBUKA DIALOG (MODAL)
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm">
                    <Clock className="mr-2 h-4 w-4" /> Ajukan Pendaftaran
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Ajukan Layanan Khusus</DialogTitle>
                    <DialogDescription>
                        Mohon sertakan catatan terkait pengajuan layanan Anda untuk direview oleh Parhalado (Admin).
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="catatan" className="text-slate-700 font-medium">Catatan Tambahan</Label>
                        <Textarea
                            id="catatan"
                            placeholder="Contoh: Nama Anak (untuk Baptis) atau Nama Pasangan (untuk Pernikahan)"
                            className="resize-none h-24 rounded-xl focus-visible:ring-purple-500"
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter className="flex sm:justify-end gap-2">
                    <Button variant="outline" className="rounded-xl" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                    <Button onClick={handleDaftarKhusus} disabled={isLoading} className="rounded-xl bg-purple-600 hover:bg-purple-700">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Kirim Pengajuan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export function TombolPersetujuan({ pendaftaranId }: { pendaftaranId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleAction(status: "TERDAFTAR" | "DITOLAK") {
        if (status === "DITOLAK") {
            if (!confirm("Yakin ingin menolak pengajuan ini? Jemaat harus mengajukan ulang jika ditolak.")) return;
        }

        setIsLoading(true);
        const res = await ubahStatusPendaftaran(pendaftaranId, status);
        setIsLoading(false);

        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    }

    return (
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
                onClick={() => handleAction("TERDAFTAR")}
                disabled={isLoading}
                className="flex-1 sm:flex-none rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-sm"
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="mr-2 h-4 w-4" /> ACC</>}
            </Button>

            <Button
                variant="outline"
                onClick={() => handleAction("DITOLAK")}
                disabled={isLoading}
                className="flex-1 sm:flex-none rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><XCircle className="mr-2 h-4 w-4" /> Tolak</>}
            </Button>
        </div>
    );
}

export function FloatingBackButton({ href }: { href: string }) {
    return (
        <Link
            href={href}
            className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-500 bg-white/60 hover:bg-white backdrop-blur-md rounded-full shadow-sm border border-slate-200 hover:text-blue-600 hover:shadow-md transition-all duration-300 active:scale-95"
        >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali</span>
        </Link>
    )
}

export function PrintButton() {
    return (
        <Button
            onClick={() => window.print()}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md transition-all hover:scale-105"
        >
            <Printer className="mr-2 h-4 w-4" /> Cetak Daftar Hadir
        </Button>
    );
}