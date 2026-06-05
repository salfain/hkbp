"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

type SegmentErrorProps = {
    error: Error & { digest?: string };
    retry: () => void;
    title?: string;
};

export function SegmentError({
    error,
    retry,
    title = "Halaman gagal dimuat",
}: SegmentErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-420px items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                <p className="mt-2 text-sm text-slate-500">
                    Data belum bisa ditampilkan. Periksa koneksi atau coba muat ulang halaman.
                </p>
                <Button
                    type="button"
                    onClick={retry}
                    className="mt-5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Coba Lagi
                </Button>
            </div>
        </div>
    );
}
