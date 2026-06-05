"use client";

import { useRef, useState } from "react";
import { tambahJemaat } from "@/actions/jemaat";
import { runActionWithToast } from "@/components/feedback/action-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function FormTambahJemaat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    async function handleAction(formData: FormData) {
        setIsLoading(true);
        const result = await runActionWithToast(
            () => tambahJemaat(formData),
            "Menyimpan data jemaat..."
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
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                    <UserPlus className="mr-2 h-4 w-4" /> Tambah Jemaat Baru
                </Button>
            </SheetTrigger>

            {/* Tambahkan side="right" dan p-0 untuk mengontrol layout penuh */}
            <SheetContent side="right" className="flex flex-col h-full w-full sm:max-w-md p-0 bg-white border-l-slate-200 shadow-2xl">

                {/* 1. FIXED HEADER */}
                <div className="px-3 py-5 border-b border-slate-100 bg-white z-10">
                    <SheetHeader className="space-y-1 text-left">
                        <SheetTitle className="text-xl font-bold text-slate-800">Tambah Data Jemaat</SheetTitle>
                        <SheetDescription className="text-sm text-slate-500">
                            Masukkan detail jemaat. Password akan menggunakan nomor telepon.
                        </SheetDescription>
                    </SheetHeader>
                </div>

                {/* Form membungkus Body dan Footer agar logic submit berjalan */}
                <form action={handleAction} ref={formRef} className="flex flex-col flex-1 overflow-hidden">

                    {/* 2. SCROLLABLE BODY */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="namaLengkap" className="text-slate-700 font-medium">Nama Lengkap</Label>
                            <Input
                                id="namaLengkap" name="namaLengkap"
                                placeholder="Contoh: John Doe" required
                                className="h-11 rounded-xl border-slate-200 transition-all focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                            <Input
                                id="email" name="email" type="email"
                                placeholder="jemaat@example.com" required
                                className="h-11 rounded-xl border-slate-200 transition-all focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nomorTelepon" className="text-slate-700 font-medium">No. WhatsApp</Label>
                                <Input
                                    id="nomorTelepon" name="nomorTelepon" type="tel"
                                    placeholder="0812xxxx" required
                                    className="h-11 rounded-xl border-slate-200 transition-all focus-visible:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tanggalLahir" className="text-slate-700 font-medium">Tanggal Lahir</Label>
                                <Input
                                    id="tanggalLahir" name="tanggalLahir" type="date" required
                                    className="h-11 rounded-xl border-slate-200 transition-all focus-visible:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 pb-2">
                            <Label htmlFor="sektor" className="text-slate-700 font-medium">Wijk / Sektor</Label>
                            <Input
                                id="sektor" name="sektor"
                                placeholder="Contoh: Sektor 1"
                                className="h-11 rounded-xl border-slate-200 transition-all focus-visible:ring-blue-500"
                            />
                            <p className="text-[11px] text-slate-400">Kosongkan jika belum memiliki sektor tetap.</p>
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
                            className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                            disabled={isLoading}
                            aria-busy={isLoading}
                        >
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
                            ) : "Simpan Data"}
                        </Button>
                    </div>
                </form>

            </SheetContent>
        </Sheet>
    );
}
