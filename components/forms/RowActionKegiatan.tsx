"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react";
import { updateKegiatan, hapusKegiatan } from "@/actions/kegiatan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { formatDateTimeLocal } from "@/lib/utils";
import { Kegiatan } from "@/types/kegiatan";

export default function RowActionKegiatan({ kegiatan }: { kegiatan: Kegiatan }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const formattedDateTime = formatDateTimeLocal(kegiatan.tanggalMulai);

    async function handleEdit(formData: FormData) {
        setIsLoading(true);
        const result = await updateKegiatan(kegiatan.id, formData);
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
        const result = await hapusKegiatan(kegiatan.id);
        setIsLoading(false);

        if (result.success) {
            toast.success(result.message);
            setIsDeleteOpen(false);
        } else {
            toast.error(result.message);
        }
    }

    return (
        <React.Fragment>
            {/* DROPDOWN MENU */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg">
                        <span className="sr-only">Buka menu</span>
                        <MoreHorizontal className="h-4 w-4 text-slate-500" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-xl">
                    <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4 text-indigo-600" /> Edit Jadwal
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus Jadwal
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* SHEET EDIT KEGIATAN */}
            <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                <SheetContent side="right" className="flex flex-col h-full w-full sm:max-w-md p-0 bg-white border-l-slate-200">
                    <div className="px-6 py-5 border-b border-slate-100 bg-white z-10">
                        <SheetHeader className="space-y-1 text-left">
                            <SheetTitle className="text-xl font-bold text-slate-800">Edit Jadwal Kegiatan</SheetTitle>
                            <SheetDescription className="text-sm text-slate-500">
                                Perbarui informasi acara. Perubahan akan langsung terlihat oleh publik.
                            </SheetDescription>
                        </SheetHeader>
                    </div>
                    <form action={handleEdit} ref={formRef} className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium">Nama Acara</Label>
                                <Input name="namaAcara" defaultValue={kegiatan.namaAcara} required className="h-11 rounded-xl focus-visible:ring-indigo-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-medium">Kategori</Label>
                                    <Input name="kategori" defaultValue={kegiatan.kategori || ""} required className="h-11 rounded-xl focus-visible:ring-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-medium">Waktu Mulai</Label>
                                    <Input name="tanggalMulai" type="datetime-local" defaultValue={formattedDateTime} required className="h-11 rounded-xl focus-visible:ring-indigo-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium">Lokasi</Label>
                                <Input name="lokasi" defaultValue={kegiatan.lokasi || ""} className="h-11 rounded-xl focus-visible:ring-indigo-500" />
                            </div>
                            <div className="space-y-2 pb-2">
                                <Label className="text-slate-700 font-medium">Deskripsi Singkat</Label>
                                <textarea
                                    name="deskripsi"
                                    defaultValue={kegiatan.deskripsi || ""}
                                    className="flex min-h-120px w-full rounded-xl border border-slate-200 bg-transparent px-3 py-3 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 resize-none"
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0 justify-end">
                            <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => setIsEditOpen(false)}>Batal</Button>
                            <Button type="submit" className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
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
                        <AlertDialogTitle>Hapus Kegiatan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini permanen. Jadwal <strong>{kegiatan.namaAcara}</strong> dan seluruh daftar jemaat yang sudah mendaftar pada acara ini akan terhapus dari sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
                        <Button variant="destructive" className="rounded-xl" onClick={handleDelete} disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, Hapus Kegiatan"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </React.Fragment>
    );
}