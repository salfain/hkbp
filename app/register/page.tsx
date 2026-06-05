"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerJemaat } from "@/actions/auth";
import { runActionWithToast } from "@/components/feedback/action-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Church, Loader2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const result = await runActionWithToast(
            () => registerJemaat(formData),
            "Mengirim pendaftaran..."
        );

        setIsLoading(false);

        if (result.success) {
            router.push("/login");
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-slate-50 overflow-hidden p-4">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[100px]" />

            <Card className="z-10 w-full max-w-lg shadow-xl border-slate-100 rounded-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                        <Church className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Pendaftaran Jemaat</CardTitle>
                    <CardDescription>Isi data diri Anda. Akun akan ditinjau oleh Parhalado sebelum diaktifkan.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nama Lengkap</Label>
                            <Input name="namaLengkap" required className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input name="email" type="email" required className="h-11 rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>No. WhatsApp</Label>
                                <Input name="nomorTelepon" type="tel" required className="h-11 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label>Tanggal Lahir</Label>
                                <Input name="tanggalLahir" type="date" required className="h-11 rounded-xl" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input name="password" type="password" required className="h-11 rounded-xl" />
                        </div>
                        <Button type="submit" className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700" disabled={isLoading} aria-busy={isLoading}>
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...</> : "Kirim Pendaftaran"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <div className="text-center text-sm text-slate-500">
                        Sudah punya akun? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Login di sini</Link>
                    </div>
                    <Link href="/" className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors">
                        &larr; Kembali ke halaman awal
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
