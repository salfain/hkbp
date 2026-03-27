import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import FormProfil from "@/components/forms/FormProfile";
import { UserCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function JemaatProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) return <div>Data tidak ditemukan</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                    <UserCircle className="h-6 w-6 text-blue-600" />
                    Profil Jemaat
                </h1>
                <p className="text-slate-500 mt-1 text-sm">
                    Pastikan nomor telepon dan tanggal lahir Anda sesuai untuk menerima notifikasi.
                </p>
            </div>

            <FormProfil user={user} />
        </div>
    );
}