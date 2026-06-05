"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarDays, FileSpreadsheet, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils"; // Fungsi bawaan shadcn

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Kelola Jemaat", href: "/admin/kelola-jemaat", icon: Users },
    { name: "Kelola Kegiatan", href: "/admin/kelola-kegiatan", icon: CalendarDays },
    { name: "Chat Jemaat", href: "/admin/chat", icon: MessageCircle },
    { name: "Ekspor Laporan", href: "/admin/laporan", icon: FileSpreadsheet },
];

export function SidebarNav() {
    const pathname = usePathname();

    return (
        <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                            isActive
                                ? "bg-blue-50 text-blue-700 shadow-sm"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                    >
                        <Icon className={cn(
                            "h-5 w-5 transition-transform group-hover:scale-110",
                            isActive ? "text-blue-700" : "text-slate-400"
                        )} />
                        {item.name}
                    </Link>
                );
            })}
        </nav>
    );
}
