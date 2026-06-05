"use client";

import { useTransition } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchComp() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);

        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }

        // Memperbarui URL tanpa me-refresh halaman secara penuh
        startTransition(() => {
            replace(`${pathname}?${params.toString()}`);
        });
    }, 300);

    return (
        <div className="relative w-full max-w-sm">
            {isPending ? (
                <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-blue-500" />
            ) : (
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            )}
            <Input
                placeholder="Cari nama, email, atau sektor..."
                className="pl-9 bg-white rounded-xl border-slate-200 focus-visible:ring-blue-500"
                defaultValue={searchParams.get("query")?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
                aria-busy={isPending}
            />
        </div>
    );
}
