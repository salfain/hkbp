"use client";

import { kirimPesanAdmin, kirimPesanJemaat } from "@/actions/chat";
import { runActionWithToast } from "@/components/feedback/action-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

type ChatComposerProps = {
    mode: "admin" | "jemaat";
    threadId?: string;
    disabled?: boolean;
    placeholder?: string;
};

export function ChatComposer({
    mode,
    threadId,
    disabled = false,
    placeholder = "Tulis pesan...",
}: ChatComposerProps) {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [isSending, setIsSending] = useState(false);

    async function handleAction(formData: FormData) {
        if (mode === "admin" && !threadId) {
            toast.error("Pilih percakapan terlebih dahulu.");
            return;
        }

        setIsSending(true);
        const result = await runActionWithToast(
            () =>
                mode === "admin"
                    ? kirimPesanAdmin(threadId as string, formData)
                    : kirimPesanJemaat(formData),
            mode === "admin" ? "Mengirim balasan..." : "Mengirim pesan..."
        );
        setIsSending(false);

        if (result.success) {
            formRef.current?.reset();
            router.refresh();
        }
    }

    return (
        <form ref={formRef} action={handleAction} className="flex flex-col gap-3">
            <Textarea
                name="body"
                placeholder={placeholder}
                required
                maxLength={1000}
                disabled={disabled || isSending}
                aria-busy={isSending}
                className="min-h-24 resize-none rounded-xl border-slate-200 bg-white focus-visible:ring-blue-500"
            />
            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={disabled || isSending}
                    className="rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                >
                    {isSending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="mr-2 h-4 w-4" />
                    )}
                    {isSending ? "Mengirim..." : "Kirim"}
                </Button>
            </div>
        </form>
    );
}
