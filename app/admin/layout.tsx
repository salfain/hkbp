import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserMenu } from "@/components/layouts/Usermenu";
import { Church } from "lucide-react";
import { SidebarNav } from "@/components/layouts/Sidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <aside className="hidden w-64 border-r border-slate-200 bg-white md:flex flex-col sticky top-0 h-screen shadow-sm">
                <div className="flex h-16 items-center gap-2 border-b px-6">
                    <Church className="h-6 w-6 text-blue-700" />
                    <h1 className="text-lg font-bold text-slate-900">Admin <span className="text-blue-700">Panel</span></h1>
                </div>
                {/* Memanggil navigasi dinamis */}
                <SidebarNav />
            </aside>

            <main className="flex-1 flex flex-col min-w-0">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800">Sistem Manajemen</h2>
                    <div className="flex items-center">
                        <UserMenu name={session?.user?.name} role={session?.user?.role} />
                    </div>
                </header>

                <div className="flex-1 p-6 lg:p-8 animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}