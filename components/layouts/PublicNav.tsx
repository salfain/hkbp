"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Church, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PublicNavbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: "Beranda", path: "/" },
        { name: "Profil HKBP", path: "/profil-gereja" },
        { name: "Informasi Kegiatan", path: "/agenda" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                            <Church className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">
                            HKBP <span className="text-blue-600">Pondok Kopi</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                href={link.path}
                                className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname === link.path ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-600"}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Action Buttons (Desktop) */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/register">
                            <Button variant="ghost" className="text-slate-600 hover:text-blue-600 rounded-xl">Daftar</Button>
                        </Link>
                        <Link href="/login">
                            <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md text-white transition-transform hover:-translate-y-0.5">Masuk</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-slate-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-slate-100 px-4 py-4 space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col gap-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                href={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-base font-medium p-2 rounded-lg ${pathname === link.path ? "bg-blue-50 text-blue-600" : "text-slate-600"}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                        <Link href="/register"><Button variant="outline" className="w-full rounded-xl">Daftar Jemaat</Button></Link>
                        <Link href="/login"><Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white">Masuk (Login)</Button></Link>
                    </div>
                </div>
            )}
        </header>
    );
}