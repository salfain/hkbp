"use client";

import { useState, useRef } from "react";
import { tambahKegiatan } from "@/actions/kegiatan";
import { runActionWithToast } from "@/components/feedback/action-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarPlus, Loader2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";

export default function FormTambahKegiatan() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    async function handleAction(formData: FormData) {
        setIsLoading(true);
        const result = await runActionWithToast(
            () => tambahKegiatan(formData),
            "Menyimpan jadwal kegiatan..."
        );
        setIsLoading(false);

        if (result.success) {
            formRef.current?.reset();
            setIsOpen(false);
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                    <CalendarPlus className="mr-2 h-4 w-4" /> Tambah Kegiatan
                </Button>
            </SheetTrigger>

            {/* Sheet Content Kanan */}
            <SheetContent side="right" className="flex flex-col h-full w-full sm:max-w-md p-0 bg-white border-l-slate-200 shadow-2xl">

                {/* 1. FIXED HEADER */}
                <div className="px-3 py-5 border-b border-slate-100 bg-white z-10">
                    <SheetHeader className="space-y-1 text-left">
                        <SheetTitle className="text-xl font-bold text-slate-800">Buat Jadwal Kegiatan</SheetTitle>
                        <SheetDescription className="text-sm text-slate-500">
                            Tambahkan acara baru untuk ditampilkan ke publik dan portal jemaat.
                        </SheetDescription>
                    </SheetHeader>
                </div>

                <form action={handleAction} ref={formRef} className="flex flex-col flex-1 overflow-hidden">

                    {/* 2. SCROLLABLE BODY */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Nama Acara</Label>
                            <Input
                                name="namaAcara"
                                placeholder="Contoh: Ibadah Raya Minggu" required
                                className="h-11 rounded-xl border-slate-200 transition-all focus-visible:ring-indigo-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium">Kategori</Label>
                                <Input
                                    name="kategori"
                                    placeholder="Contoh: Umum" required
                                    className="h-11 rounded-xl border-slate-200 transition-all focus-visible:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium">Waktu Mulai</Label>
                                <Input
                                    name="tanggalMulai" type="datetime-local" required
                                    className="h-11 rounded-xl border-slate-200 transition-all focus-visible:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Lokasi</Label>
                            <Input
                                name="lokasi"
                                placeholder="Gedung Utama HKBP"
                                className="h-11 rounded-xl border-slate-200 transition-all focus-visible:ring-indigo-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700 font-medium">Deskripsi Singkat</Label>
                            <textarea
                                name="deskripsi"
                                placeholder="Tuliskan informasi tambahan pada acara ini..."
                                className="flex min-h-120px w-full rounded-xl border border-slate-200 bg-transparent px-3 py-3 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 resize-none"
                            />
                        </div>
                    </div>

                    {/* 3. FIXED FOOTER */}
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0 justify-end">
                        <Button
                            type="button" variant="outline"
                            className="h-11 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                            onClick={() => setIsOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                            disabled={isLoading}
                            aria-busy={isLoading}
                        >
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
                            ) : "Simpan Jadwal"}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
