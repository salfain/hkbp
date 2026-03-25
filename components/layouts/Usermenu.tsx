"use client";

import { signOut } from "next-auth/react";
import { LogOut, User as UserIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserMenuProps {
    name?: string | null;
    role?: string | null;
}

export function UserMenu({ name, role }: UserMenuProps) {
    // Mengambil inisial nama untuk Avatar
    const initials = name?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-transform hover:scale-105">
                <Avatar className="h-9 w-9 border border-blue-100 shadow-sm">
                    <AvatarImage src="" alt={name || "User"} />
                    <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
                        {initials}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-slate-100">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-slate-900">{name}</p>
                        <p className="text-xs leading-none text-slate-500">{role === "ADMIN" ? "Administrator" : "Jemaat"}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profil Saya</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors focus:text-red-700 focus:bg-red-50"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}