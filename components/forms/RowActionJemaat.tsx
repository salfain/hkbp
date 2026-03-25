"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react";
import { updateJemaat, hapusJemaat } from "@/actions/jemaat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Jemaat {
    id: string;
    namaLengkap: string;
    email: string;
    nomorTelepon: string | null;
    tanggalLahir: Date | null;
    sektor: string | null;
}

export default function RowActionJemaat({ jemaat }: { jemaat: Jemaat }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    // Format tanggal untuk value input type="date" (YYYY-MM-DD)
    const formattedDate = jemaat.tanggalLahir ? new Date(jemaat.tanggalLahir).toISOString().split('T')[0] : "";

    async function handleEdit(formData: FormData) {
        setIsLoading(true);
        const result = await updateJemaat(jemaat.id, formData);
        setIsLoading(false);

        if (result.success) {
            toast.success(result.message);
            setIsEditOpen(false);
        } else {
            toast.error(result.message);
        }
    }

    async function handleDelete() {
        setIsLoading(true);
        const result = await hapusJemaat(jemaat.id);
        setIsLoading(false);

        if (result.success) {
            toast.success(result.message);
            setIsDeleteOpen(false);
        } else {
            toast.error(result.message);
        }
    }

    return (
        <React.Fragment >
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg">
                        <span className="sr-only">Buka menu</span>
                        <MoreHorizontal className="h-4 w-4 text-slate-500" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-xl">
                    <DropdownMenuLabel className="text-xs text-slate-500">Aksi Data</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4 text-blue-600" /> Edit Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus Data
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* SHEET EDIT JEMAAT */}
            <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                <SheetContent side="right" className="flex flex-col h-full w-full sm:max-w-md p-0 bg-white border-l-slate-200">
                    <div className="px-6 py-5 border-b border-slate-100 bg-white z-10">
                        <SheetHeader className="space-y-1 text-left">
                            <SheetTitle className="text-xl font-bold text-slate-800">Edit Data Jemaat</SheetTitle>
                            <SheetDescription className="text-sm text-slate-500">
                                Perbarui informasi profil jemaat di bawah ini.
                            </SheetDescription>
                        </SheetHeader>
                    </div>
                    <form action={handleEdit} ref={formRef} className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium">Nama Lengkap</Label>
                                <Input name="namaLengkap" defaultValue={jemaat.namaLengkap} required className="h-11 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium">Email</Label>
                                <Input name="email" type="email" defaultValue={jemaat.email} required className="h-11 rounded-xl" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-medium">No. WhatsApp</Label>
                                    <Input name="nomorTelepon" type="tel" defaultValue={jemaat.nomorTelepon || ""} required className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-medium">Tanggal Lahir</Label>
                                    <Input name="tanggalLahir" type="date" defaultValue={formattedDate} required className="h-11 rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-2 pb-2">
                                <Label className="text-slate-700 font-medium">Wijk / Sektor</Label>
                                <Input name="sektor" defaultValue={jemaat.sektor || ""} className="h-11 rounded-xl" />
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0">
                            <Button type="button" variant="outline" className="w-full h-11 rounded-xl" onClick={() => setIsEditOpen(false)}>Batal</Button>
                            <Button type="submit" className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan Perubahan"}
                            </Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>

            {/* ALERT DIALOG HAPUS */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Data Jemaat?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data <strong>{jemaat.namaLengkap}</strong> beserta seluruh riwayat pendaftarannya akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
                        <Button variant="destructive" className="rounded-xl bg-red-600 hover:bg-red-700" onClick={handleDelete} disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, Hapus"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </React.Fragment>
    );
}