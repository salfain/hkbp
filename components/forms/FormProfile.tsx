"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateProfilUser } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface UserProfile {
    id: string;
    namaLengkap: string;
    email: string;
    nomorTelepon: string | null;
    tanggalLahir: Date | null;
    sektor: string | null;
}

export default function FormProfil({ user }: { user: UserProfile }) {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Format tanggal untuk default value input date
    const formattedDate = user.tanggalLahir
        ? new Date(user.tanggalLahir).toISOString().split('T')[0]
        : "";

    async function handleAction(formData: FormData) {
        setIsLoading(true);
        const result = await updateProfilUser(user.id, formData);
        setIsLoading(false);

        if (result.success) {
            toast.success(result.message);
            // Reset input password setelah sukses agar tidak membingungkan
            const passwordInput = document.getElementById('password') as HTMLInputElement;
            if (passwordInput) passwordInput.value = '';
        } else {
            toast.error(result.message);
        }
    }

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-5">
                <CardTitle className="text-xl font-bold text-slate-800">Informasi Pribadi</CardTitle>
                <CardDescription>
                    Perbarui biodata dan kata sandi Anda di sini. Email tidak dapat diubah.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <form action={handleAction} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Kolom 1 */}
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 font-medium">Alamat Email</Label>
                                <Input
                                    id="email" value={user.email} disabled
                                    className="h-11 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="namaLengkap" className="text-slate-700 font-medium">Nama Lengkap</Label>
                                <Input
                                    id="namaLengkap" name="namaLengkap" defaultValue={user.namaLengkap} required
                                    className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-2 relative">
                                <Label htmlFor="password" className="text-slate-700 font-medium">Ganti Kata Sandi</Label>
                                <div className="relative">
                                    <Input
                                        id="password" name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Biarkan kosong jika tidak ingin ganti"
                                        className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-500 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Kolom 2 */}
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="nomorTelepon" className="text-slate-700 font-medium">Nomor WhatsApp</Label>
                                <Input
                                    id="nomorTelepon" name="nomorTelepon" type="tel" defaultValue={user.nomorTelepon || ""} required
                                    className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tanggalLahir" className="text-slate-700 font-medium">Tanggal Lahir</Label>
                                <Input
                                    id="tanggalLahir" name="tanggalLahir" type="date" defaultValue={formattedDate} required
                                    className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sektor" className="text-slate-700 font-medium">Wijk / Sektor</Label>
                                <Input
                                    id="sektor" name="sektor" defaultValue={user.sektor || ""}
                                    placeholder="Contoh: Sektor 1"
                                    className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            type="submit"
                            className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all hover:-translate-y-0.5"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
                            ) : (
                                <><Save className="mr-2 h-4 w-4" /> Simpan Perubahan</>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}