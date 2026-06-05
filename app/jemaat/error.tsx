"use client";

import { SegmentError } from "@/components/feedback/SegmentError";

export default function Error({
    error,
    unstable_retry,
}: {
    error: Error & { digest?: string };
    unstable_retry: () => void;
}) {
    return <SegmentError error={error} retry={unstable_retry} title="Portal jemaat gagal dimuat" />;
}
