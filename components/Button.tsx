"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { daftarKegiatan, batalDaftarKegiatan } from "@/actions/pendaftaran";
import Link from "next/link";
import { ubahStatusPendaftaran } from "@/actions/persetujuan";

export function TombolDaftar({
    userId,
    kegiatanId,
    isRegistered,
    tipe,
    status
}: {
    userId: string;
    kegiatanId: string;
    isRegistered: boolean;
    tipe: "UMUM" | "KHUSUS";
    status?: string;
}) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleDaftar() {
        let catatan = "";
        if (tipe === "KHUSUS") {
            const input = window.prompt("Masukkan catatan tambahan (opsional):\nContoh: Nama Anak untuk Baptis, atau Nama Pasangan untuk Pernikahan");
            if (input === null) return;
            catatan = input;
        }

        setIsLoading(true);
        const res = await daftarKegiatan(userId, kegiatanId, tipe, catatan);
        setIsLoading(false);
        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    }

    async function handleBatal() {
        setIsLoading(true);
        const res = await batalDaftarKegiatan(userId, kegiatanId);
        setIsLoading(false);
        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    }

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

    return (
        <Button
            onClick={handleDaftar}
            disabled={isLoading}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="mr-2 h-4 w-4" /> Daftar Sekarang</>}
        </Button>
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