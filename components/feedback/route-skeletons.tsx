import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function HeaderSkeleton({ withAction = false }: { withAction?: boolean }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-72 max-w-full" />
            </div>
            {withAction && <Skeleton className="h-10 w-40 rounded-xl" />}
        </div>
    );
}

function MetricCardsSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: count }).map((_, index) => (
                <Card key={index} className="rounded-2xl border-none bg-white shadow-md">
                    <CardContent className="flex items-center gap-4 p-6">
                        <Skeleton className="h-16 w-16 rounded-2xl" />
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <HeaderSkeleton />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-28 rounded-xl" />
                ))}
            </div>
            <MetricCardsSkeleton />
            <div className="grid gap-4 xl:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                    <Card key={index} className="rounded-2xl border-none bg-white shadow-md">
                        <CardHeader className="pb-2">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-40" />
                                    <Skeleton className="h-4 w-72 max-w-full" />
                                </div>
                                <div className="space-y-2 sm:text-right">
                                    <Skeleton className="h-8 w-20" />
                                    <Skeleton className="h-7 w-44 rounded-full" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <Skeleton className="h-72 rounded-xl" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function TablePageSkeleton({
    action = true,
    rows = 6,
}: {
    action?: boolean;
    rows?: number;
}) {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <HeaderSkeleton withAction={action} />
            <Card className="gap-0 overflow-hidden rounded-2xl border-none bg-white shadow-md">
                <CardHeader className="border-b border-slate-100 bg-slate-50/70 pb-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-10 w-full max-w-sm rounded-xl" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-1 p-0">
                    {Array.from({ length: rows }).map((_, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-[minmax(180px,1fr)_1fr_120px_80px] items-center gap-4 border-b border-slate-100 px-6 py-4"
                        >
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <Skeleton className="h-4 w-36" />
                            </div>
                            <Skeleton className="h-4 w-full max-w-56" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="ml-auto h-8 w-8 rounded-lg" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

export function CardListSkeleton({ rows = 4 }: { rows?: number }) {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <HeaderSkeleton />
            <div className="grid gap-4">
                {Array.from({ length: rows }).map((_, index) => (
                    <Card key={index} className="rounded-2xl border-slate-100 bg-white shadow-sm">
                        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-3">
                                <Skeleton className="h-5 w-24 rounded-md" />
                                <Skeleton className="h-6 w-64 max-w-full" />
                                <Skeleton className="h-4 w-80 max-w-full" />
                            </div>
                            <Skeleton className="h-10 w-36 rounded-xl" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function ChatPageSkeleton({ inbox = false }: { inbox?: boolean }) {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <HeaderSkeleton />
            <div className={inbox ? "grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]" : ""}>
                {inbox && (
                    <Card className="gap-0 overflow-hidden rounded-2xl border-none bg-white shadow-md">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/70 pb-4">
                            <Skeleton className="h-6 w-28" />
                            <Skeleton className="h-4 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4 p-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className="flex gap-3 border-b border-slate-100 pb-4">
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
                <Card className="gap-0 overflow-hidden rounded-2xl border-none bg-white shadow-md">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/70 pb-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-44" />
                                    <Skeleton className="h-3 w-60 max-w-full" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-20 rounded-full" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="min-h-380px space-y-4 bg-slate-50/60 px-4 py-6 sm:px-6">
                            <Skeleton className="h-16 w-2/3 rounded-2xl" />
                            <Skeleton className="ml-auto h-20 w-3/4 rounded-2xl" />
                            <Skeleton className="h-14 w-1/2 rounded-2xl" />
                            <Skeleton className="ml-auto h-16 w-2/3 rounded-2xl" />
                        </div>
                        <div className="border-t border-slate-100 bg-white p-4 sm:p-6">
                            <Skeleton className="h-24 rounded-xl" />
                            <div className="mt-3 flex justify-end">
                                <Skeleton className="h-10 w-24 rounded-xl" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export function ProfileSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <HeaderSkeleton />
            <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/70 pb-5">
                    <Skeleton className="h-6 w-44" />
                    <Skeleton className="h-4 w-72 max-w-full" />
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-11 rounded-xl" />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <Skeleton className="h-11 w-44 rounded-xl" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function JemaatDashboardSkeleton() {
    return (
        <div className="space-y-10 pb-10 animate-in fade-in duration-300">
            <Skeleton className="h-48 rounded-3xl" />
            <CardListSkeleton rows={2} />
            <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-44 rounded-2xl" />
                ))}
            </div>
        </div>
    );
}
