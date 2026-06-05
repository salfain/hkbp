import { getAdminChatInbox } from "@/actions/chat";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatStatusToggle } from "@/components/chat/ChatStatusToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Inbox, Mail, MessageCircle, Phone, UserRound } from "lucide-react";
import Link from "next/link";

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
}

export default async function AdminChatPage({
    searchParams,
}: {
    searchParams: Promise<{ threadId?: string }>;
}) {
    const resolvedParams = await searchParams;
    const { threads, selectedThread } = await getAdminChatInbox(resolvedParams.threadId);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="flex items-center gap-2 text-3xl font-extrabold text-slate-900">
                    <MessageCircle className="h-8 w-8 text-blue-600" />
                    Chat Jemaat
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Kelola percakapan masuk dari jemaat dan berikan balasan dari panel admin.
                </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
                <Card className="gap-0 overflow-hidden rounded-2xl border-none bg-white shadow-md">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/70 pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
                            <Inbox className="h-5 w-5 text-blue-600" />
                            Inbox
                        </CardTitle>
                        <p className="text-sm text-slate-500">
                            {threads.length} percakapan jemaat.
                        </p>
                    </CardHeader>
                    <CardContent className="p-0">
                        {threads.length === 0 ? (
                            <div className="flex min-h-360px flex-col items-center justify-center p-8 text-center text-slate-500">
                                <div className="mb-3 rounded-full bg-slate-100 p-3 text-slate-400">
                                    <Inbox className="h-7 w-7" />
                                </div>
                                <p className="text-sm font-medium text-slate-600">
                                    Belum ada percakapan.
                                </p>
                            </div>
                        ) : (
                            <div className="max-h-640px overflow-y-auto">
                                {threads.map((thread) => {
                                    const lastMessage = thread.messages[0];
                                    const isSelected = selectedThread?.id === thread.id;

                                    return (
                                        <Link
                                            key={thread.id}
                                            href={`/admin/chat?threadId=${thread.id}`}
                                            className={cn(
                                                "block border-b border-slate-100 px-4 py-4 transition-colors hover:bg-blue-50/60",
                                                isSelected && "bg-blue-50"
                                            )}
                                        >
                                            <div className="flex gap-3">
                                                <Avatar className="mt-0.5 bg-blue-100">
                                                    <AvatarFallback className="bg-blue-100 text-xs font-bold text-blue-700">
                                                        {getInitials(thread.jemaat.namaLengkap)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 flex-1 space-y-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h2 className="truncate text-sm font-bold text-slate-900">
                                                            {thread.jemaat.namaLengkap}
                                                        </h2>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "shrink-0 text-[10px]",
                                                                thread.status === "OPEN"
                                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                                    : "border-slate-200 bg-slate-50 text-slate-500"
                                                            )}
                                                        >
                                                            {thread.status === "OPEN" ? "Aktif" : "Tutup"}
                                                        </Badge>
                                                    </div>
                                                    <p className="line-clamp-2 text-xs text-slate-500">
                                                        {lastMessage
                                                            ? `${lastMessage.sender.role === "ADMIN" ? "Admin" : "Jemaat"}: ${lastMessage.body}`
                                                            : "Belum ada pesan."}
                                                    </p>
                                                    <div className="flex items-center justify-between gap-3 text-[11px] text-slate-400">
                                                        <span>{thread._count.messages} pesan</span>
                                                        <span>
                                                            {format(new Date(thread.lastMessageAt), "dd MMM, HH:mm", {
                                                                locale: localeId,
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="gap-0 overflow-hidden rounded-2xl border-none bg-white shadow-md">
                    {selectedThread ? (
                        <>
                            <CardHeader className="border-b border-slate-100 bg-slate-50/70 pb-4">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex gap-3">
                                        <Avatar className="mt-1 bg-blue-100" size="lg">
                                            <AvatarFallback className="bg-blue-100 text-sm font-bold text-blue-700">
                                                {getInitials(selectedThread.jemaat.namaLengkap)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg font-bold text-slate-900">
                                                {selectedThread.jemaat.namaLengkap}
                                            </CardTitle>
                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                                <span className="inline-flex items-center gap-1">
                                                    <Mail className="h-3.5 w-3.5" />
                                                    {selectedThread.jemaat.email}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <Phone className="h-3.5 w-3.5" />
                                                    {selectedThread.jemaat.nomorTelepon || "-"}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <UserRound className="h-3.5 w-3.5" />
                                                    {selectedThread.jemaat.sektor || "Sektor belum diisi"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                selectedThread.status === "OPEN"
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    : "border-slate-200 bg-slate-50 text-slate-500"
                                            )}
                                        >
                                            {selectedThread.status === "OPEN" ? "Aktif" : "Ditutup"}
                                        </Badge>
                                        <ChatStatusToggle
                                            threadId={selectedThread.id}
                                            status={selectedThread.status}
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="min-h-420px space-y-4 overflow-y-auto bg-slate-50/60 px-4 py-6 sm:px-6">
                                    {selectedThread.messages.length === 0 ? (
                                        <div className="flex min-h-340px flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center">
                                            <div className="mb-3 rounded-full bg-blue-50 p-3 text-blue-600">
                                                <MessageCircle className="h-7 w-7" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-600">
                                                Percakapan belum memiliki pesan.
                                            </p>
                                        </div>
                                    ) : (
                                        selectedThread.messages.map((message) => {
                                            const isAdmin = message.sender.role === "ADMIN";

                                            return (
                                                <div
                                                    key={message.id}
                                                    className={`flex gap-3 ${isAdmin ? "justify-end" : "justify-start"}`}
                                                >
                                                    {!isAdmin && (
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                                            {getInitials(message.sender.namaLengkap)}
                                                        </div>
                                                    )}
                                                    <div
                                                        className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[70%] ${
                                                            isAdmin
                                                                ? "bg-blue-600 text-white"
                                                                : "border border-slate-200 bg-white text-slate-800"
                                                        }`}
                                                    >
                                                        <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                                                            <span className="font-semibold">
                                                                {isAdmin ? "Admin" : message.sender.namaLengkap}
                                                            </span>
                                                            <span className={isAdmin ? "text-blue-100" : "text-slate-400"}>
                                                                {format(new Date(message.createdAt), "dd MMM yyyy, HH:mm", {
                                                                    locale: localeId,
                                                                })}
                                                            </span>
                                                        </div>
                                                        <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
                                                            {message.body}
                                                        </p>
                                                    </div>
                                                    {isAdmin && (
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                                                            AD
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                                <div className="border-t border-slate-100 bg-white p-4 sm:p-6">
                                    <ChatComposer
                                        mode="admin"
                                        threadId={selectedThread.id}
                                        placeholder={`Balas ${selectedThread.jemaat.namaLengkap}...`}
                                    />
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        <CardContent className="flex min-h-560px flex-col items-center justify-center p-8 text-center">
                            <div className="mb-3 rounded-full bg-slate-100 p-3 text-slate-400">
                                <MessageCircle className="h-8 w-8" />
                            </div>
                            <h2 className="text-base font-bold text-slate-900">
                                Pilih percakapan
                            </h2>
                            <p className="mt-1 max-w-sm text-sm text-slate-500">
                                Percakapan dari jemaat akan tampil di sini setelah mereka mengirim pesan.
                            </p>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
}
