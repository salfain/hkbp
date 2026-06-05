"use client";

import { ubahStatusPercakapan } from "@/actions/chat";
import { runActionWithToast } from "@/components/feedback/action-toast";
import { Button } from "@/components/ui/button";
import { Archive, Loader2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ChatStatusToggleProps = {
    threadId: string;
    status: "OPEN" | "CLOSED";
};

export function ChatStatusToggle({ threadId, status }: ChatStatusToggleProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const nextStatus = status === "OPEN" ? "CLOSED" : "OPEN";

    async function handleClick() {
        setIsLoading(true);
        const result = await runActionWithToast(
            () => ubahStatusPercakapan(threadId, nextStatus),
            nextStatus === "OPEN" ? "Membuka percakapan..." : "Menutup percakapan..."
        );
        setIsLoading(false);

        if (result.success) {
            router.refresh();
        }
    }

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={isLoading}
            aria-busy={isLoading}
            className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : status === "OPEN" ? (
                <Archive className="mr-2 h-4 w-4" />
            ) : (
                <RotateCcw className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Memproses..." : status === "OPEN" ? "Tutup" : "Buka"}
        </Button>
    );
}
