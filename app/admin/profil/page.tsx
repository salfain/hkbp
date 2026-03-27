import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import FormProfil from "@/components/forms/FormProfile";
import { UserCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    // Tarik data profil langsung dari database agar selalu fresh
    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) return <div>Data tidak ditemukan</div>;

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                    <UserCircle className="h-8 w-8 text-blue-600" />
                    Profil Administrator
                </h1>
                <p className="text-slate-500 mt-1 text-sm">Kelola informasi akun Anda di sini.</p>
            </div>

            <FormProfil user={user} />
        </div>
    );
}