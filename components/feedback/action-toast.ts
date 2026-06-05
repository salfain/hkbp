"use client";

import { toast } from "sonner";

type ActionResult = {
    success: boolean;
    message: string;
};

export async function runActionWithToast<T extends ActionResult>(
    action: () => Promise<T>,
    loadingMessage: string,
    fallbackError = "Terjadi kesalahan saat memproses permintaan."
) {
    const toastId = toast.loading(loadingMessage);

    try {
        const result = await action();

        if (result.success) {
            toast.success(result.message, { id: toastId });
        } else {
            toast.error(result.message, { id: toastId });
        }

        return result;
    } catch (error) {
        console.error(error);
        toast.error(fallbackError, { id: toastId });
        return { success: false, message: fallbackError } as T;
    }
}
