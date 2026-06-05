import { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserMenu } from "@/components/layouts/Usermenu";
import { Church, Home, CalendarDays, User as UserIcon, MessageCircle } from "lucide-react";

export default async function JemaatLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header Desktop & Mobile */}
            <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 shadow-sm md:px-8">
                <div className="flex items-center gap-2">
                    <Church className="h-6 w-6 text-blue-700" />
                    <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                        HKBP <span className="text-blue-700 hidden sm:inline">Pondok Kopi</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <UserMenu name={session?.user?.name} role={session?.user?.role} />
                </div>
            </header>

            {/* Main Content (diberi padding bottom ekstra untuk mobile nav) */}
            <main className="flex-1 mx-auto w-full max-w-4xl p-4 md:p-8 pb-24 md:pb-8 animate-in fade-in duration-500">
                {children}
            </main>

            {/* Bottom Navigation (Hanya muncul di Mobile/Layar kecil) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around items-center h-16 px-2 pb-safe z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <Link href="/jemaat" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-blue-600 active:text-blue-700 transition-colors">
                    <Home className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Beranda</span>
                </Link>
                <Link href="/jemaat/kegiatan" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-blue-600 active:text-blue-700 transition-colors">
                    <CalendarDays className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Kegiatan</span>
                </Link>
                <Link href="/jemaat/chat" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-blue-600 active:text-blue-700 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Chat</span>
                </Link>
                <Link href="/jemaat/profil" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-blue-600 active:text-blue-700 transition-colors">
                    <UserIcon className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Profil</span>
                </Link>
            </nav>
        </div>
    );
}
