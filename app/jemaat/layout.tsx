import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserMenu } from "@/components/layouts/Usermenu";
import { Church } from "lucide-react";

export default async function JemaatLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    return (
        <div className="min-h-screen bg-slate-50/50 selection:bg-blue-100">
            <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 shadow-sm md:px-8 transition-all">
                <div className="flex items-center gap-2">
                    <Church className="h-6 w-6 text-blue-700" />
                    <h1 className="text-lg font-bold text-slate-900 tracking-tight hidden sm:block">
                        HKBP <span className="text-blue-700">Pondok Kopi</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* Menggunakan komponen UserMenu yang baru dibuat */}
                    <UserMenu name={session?.user?.name} role={session?.user?.role} />
                </div>
            </header>

            <main className="mx-auto max-w-4xl p-4 md:p-8 animate-in fade-in duration-500">
                {children}
            </main>
        </div>
    );
}