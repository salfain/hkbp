import { getJemaatChatThread } from "@/actions/chat";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { MessageCircle, MessagesSquare } from "lucide-react";

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
}

export default async function JemaatChatPage() {
    const thread = await getJemaatChatThread();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                    Chat Admin
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Kirim pertanyaan atau konfirmasi pelayanan kepada admin gereja.
                </p>
            </div>

            <Card className="gap-0 overflow-hidden rounded-2xl border-none bg-white shadow-md">
                <CardHeader className="border-b border-slate-100 bg-slate-50/70 pb-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-900">
                                Percakapan dengan Admin
                            </CardTitle>
                        </div>
                        <Badge
                            variant="outline"
                            className="w-fit border-blue-200 bg-blue-50 text-blue-700"
                        >
                            {thread.status === "OPEN" ? "Aktif" : "Ditutup"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="min-h-[380px] space-y-4 overflow-y-auto bg-slate-50/60 px-4 py-6 sm:px-6">
                        {thread.messages.length === 0 ? (
                            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center">
                                <div className="mb-3 rounded-full bg-blue-50 p-3 text-blue-600">
                                    <MessagesSquare className="h-7 w-7" />
                                </div>
                                <h2 className="text-base font-bold text-slate-900">
                                    Belum ada pesan
                                </h2>
                                <p className="mt-1 max-w-sm text-sm text-slate-500">
                                    Mulai percakapan dengan admin untuk kebutuhan pelayanan atau data jemaat.
                                </p>
                            </div>
                        ) : (
                            thread.messages.map((message) => {
                                const isMine = message.senderId === thread.jemaatId;

                                return (
                                    <div
                                        key={message.id}
                                        className={`flex gap-3 ${isMine ? "justify-end" : "justify-start"}`}
                                    >
                                        {!isMine && (
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                                AD
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[70%] ${
                                                isMine
                                                    ? "bg-blue-600 text-white"
                                                    : "border border-slate-200 bg-white text-slate-800"
                                            }`}
                                        >
                                            <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                                                <span className="font-semibold">
                                                    {isMine ? "Anda" : message.sender.namaLengkap}
                                                </span>
                                                <span className={isMine ? "text-blue-100" : "text-slate-400"}>
                                                    {format(new Date(message.createdAt), "dd MMM yyyy, HH:mm", {
                                                        locale: localeId,
                                                    })}
                                                </span>
                                            </div>
                                            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                                                {message.body}
                                            </p>
                                        </div>
                                        {isMine && (
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                                                {getInitials(thread.jemaat.namaLengkap)}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className="border-t border-slate-100 bg-white p-4 sm:p-6">
                        <ChatComposer
                            mode="jemaat"
                            placeholder="Tulis pesan untuk admin..."
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
