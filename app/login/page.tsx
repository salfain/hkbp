"use client";

import React, { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Church, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Proses autentikasi
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            toast.error(result.error);
            setIsLoading(false);
        } else {
            toast.success("Login berhasil! Mengalihkan...");

            // Ambil session terbaru untuk mengecek role
            const session = await getSession();

            // Arahkan ke panel berdasarkan role
            if (session?.user?.role === "ADMIN") {
                router.push("/admin");
            } else if (session?.user?.role === "JEMAAT") {
                router.push("/jemaat");
            } else {
                router.push("/"); // Fallback jika role tidak terdefinisi
            }

            router.refresh();
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-slate-50 overflow-hidden p-4">
            {/* Floating Back Button (Escape Hatch) */}
            <Link
                href="/"
                className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-500 bg-white/60 hover:bg-white backdrop-blur-md rounded-full shadow-sm border border-slate-200 hover:text-blue-600 hover:shadow-md transition-all duration-300 active:scale-95"
            >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Kembali</span>
            </Link>

            {/* Ornamen Latar Belakang Gradient */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[100px]" />

            <Card className="z-10 w-full max-w-md shadow-2xl border-slate-100 rounded-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                <CardHeader className="space-y-3 text-center pb-3 pt-8">
                    <div className="mx-auto bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-inner">
                        <Church className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-extrabold text-slate-900 tracking-tight">Selamat Datang</CardTitle>
                    <CardDescription className="text-slate-500">
                        Masuk untuk mengakses portal jemaat HKBP Pondok Kopi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                            <Input
                                id="email" name="email" type="email"
                                placeholder="jemaat@example.com" required
                                className="h-11 rounded-xl transition-all border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                            />
                        </div>
                        <div className="space-y-2 relative">
                            <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password" name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="h-11 rounded-xl transition-all border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-11 rounded-xl text-md font-semibold bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <React.Fragment>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...
                                </React.Fragment>
                            ) : "Masuk ke Sistem"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center pb-8">
                    <Link href="/" className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors">
                        &larr; Kembali ke halaman awal
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}