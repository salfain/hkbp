"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { daftarKegiatan, batalDaftarKegiatan } from "@/actions/pendaftaran";

export default function TombolDaftar({
    userId,
    kegiatanId,
    isRegistered
}: {
    userId: string,
    kegiatanId: string,
    isRegistered: boolean
}) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleDaftar() {
        setIsLoading(true);
        const res = await daftarKegiatan(userId, kegiatanId);
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
        return (
            <Button
                variant="outline"
                onClick={handleBatal}
                disabled={isLoading}
                className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Batalkan Pendaftaran"}
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