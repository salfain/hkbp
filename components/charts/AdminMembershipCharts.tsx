"use client";

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { TooltipContentProps } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MonthlyJemaatStat = {
    month: string;
    monthKey: string;
    totalJemaat: number;
    jemaatAktif: number;
    newJemaat: number;
    newJemaatAktif: number;
};

type ChartKey = "totalJemaat" | "jemaatAktif";
type NewDataKey = "newJemaat" | "newJemaatAktif";

type ChartConfig = {
    title: string;
    description: string;
    valueLabel: string;
    newValueLabel: string;
    dataKey: ChartKey;
    newDataKey: NewDataKey;
    color: string;
    accentClassName: string;
    fallbackTotal: number;
};

type AdminMembershipChartsProps = {
    data: MonthlyJemaatStat[];
    totalJemaat: number;
    totalJemaatAktif: number;
};

const numberFormatter = new Intl.NumberFormat("id-ID");
const compactNumberFormatter = new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
});

function getTrendCopy(delta: number) {
    if (delta > 0) {
        return `Naik ${numberFormatter.format(delta)} dari bulan lalu`;
    }

    if (delta < 0) {
        return `Turun ${numberFormatter.format(Math.abs(delta))} dari bulan lalu`;
    }

    return "Stabil dari bulan lalu";
}

function TrendIcon({ delta }: { delta: number }) {
    if (delta > 0) return <TrendingUp className="h-4 w-4" aria-hidden="true" />;
    if (delta < 0) return <TrendingDown className="h-4 w-4" aria-hidden="true" />;
    return <Minus className="h-4 w-4" aria-hidden="true" />;
}

function ChartTooltip({
    active,
    payload,
    label,
    valueLabel,
    newValueLabel,
    newDataKey,
}: TooltipContentProps & {
    valueLabel: string;
    newValueLabel: string;
    newDataKey: NewDataKey;
}) {
    const point = payload?.[0]?.payload as MonthlyJemaatStat | undefined;

    if (!active || !point) return null;

    const value = Number(payload?.[0]?.value ?? 0);
    const newValue = Number(point[newDataKey] ?? 0);

    return (
        <div className="min-w-44 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
            <p className="font-semibold text-slate-900">{label}</p>
            <div className="mt-2 space-y-1 text-slate-600">
                <div className="flex items-center justify-between gap-6">
                    <span>{valueLabel}</span>
                    <span className="font-semibold text-slate-900">
                        {numberFormatter.format(value)}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-6">
                    <span>{newValueLabel}</span>
                    <span className="font-semibold text-slate-900">
                        {numberFormatter.format(newValue)}
                    </span>
                </div>
            </div>
        </div>
    );
}

function MembershipLineChart({
    config,
    data,
}: {
    config: ChartConfig;
    data: MonthlyJemaatStat[];
}) {
    const latestPoint = data.at(-1);
    const previousPoint = data.at(-2);
    const currentValue = latestPoint?.[config.dataKey] ?? config.fallbackTotal;
    const previousValue = previousPoint?.[config.dataKey] ?? currentValue;
    const delta = currentValue - previousValue;
    const yMax = Math.max(...data.map((item) => item[config.dataKey]), currentValue, 0);
    const yDomainMax = yMax <= 5 ? 5 : Math.ceil(yMax * 1.15);
    const isEmpty = yMax === 0;

    return (
        <Card className="rounded-2xl border-none bg-white shadow-md">
            <CardHeader className="gap-3 pb-2">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <CardTitle className="text-lg font-bold text-slate-900">
                            {config.title}
                        </CardTitle>
                        <CardDescription className="mt-1 leading-relaxed">
                            {config.description}
                        </CardDescription>
                    </div>
                    <div className="shrink-0 text-left sm:text-right">
                        <p className="text-3xl font-extrabold leading-none text-slate-900">
                            {numberFormatter.format(currentValue)}
                        </p>
                        <div
                            className={cn(
                                "mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                                delta > 0 && config.accentClassName,
                                delta === 0 && "bg-slate-100 text-slate-600",
                                delta < 0 && "bg-rose-50 text-rose-700"
                            )}
                        >
                            <TrendIcon delta={delta} />
                            {getTrendCopy(delta)}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-2">
                <p className="sr-only">
                    {config.title}: nilai terakhir {numberFormatter.format(currentValue)}.
                    {getTrendCopy(delta)}.
                </p>
                <div
                    className="relative h-72 min-w-0"
                    role="img"
                    aria-label={`${config.title} selama 12 bulan terakhir`}
                >
                    {isEmpty && (
                        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                            <div className="rounded-full border border-dashed border-slate-300 bg-white/90 px-4 py-2 text-sm font-medium text-slate-500 shadow-sm">
                                Belum ada data jemaat
                            </div>
                        </div>
                    )}
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 16, right: 12, bottom: 4, left: 0 }}
                        >
                            <CartesianGrid
                                stroke="#e2e8f0"
                                strokeDasharray="4 4"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                minTickGap={18}
                                tickMargin={12}
                                tick={{ fill: "#64748b", fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                width={42}
                                allowDecimals={false}
                                domain={[0, yDomainMax]}
                                tickFormatter={(value) =>
                                    compactNumberFormatter.format(Number(value))
                                }
                                tick={{ fill: "#64748b", fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4 4" }}
                                content={(props) => (
                                    <ChartTooltip
                                        {...props}
                                        valueLabel={config.valueLabel}
                                        newValueLabel={config.newValueLabel}
                                        newDataKey={config.newDataKey}
                                    />
                                )}
                            />
                            <Line
                                type="monotone"
                                dataKey={config.dataKey}
                                name={config.valueLabel}
                                stroke={config.color}
                                strokeWidth={3}
                                dot={{ r: 3, strokeWidth: 2, fill: "#ffffff" }}
                                activeDot={{ r: 5, strokeWidth: 2 }}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function AdminMembershipCharts({
    data,
    totalJemaat,
    totalJemaatAktif,
}: AdminMembershipChartsProps) {
    const chartConfigs: ChartConfig[] = [
        {
            title: "Jumlah Jemaat",
            description: "Akumulasi semua akun jemaat dalam 12 bulan terakhir.",
            valueLabel: "Total jemaat",
            newValueLabel: "Jemaat baru",
            dataKey: "totalJemaat",
            newDataKey: "newJemaat",
            color: "#059669",
            accentClassName: "bg-emerald-50 text-emerald-700",
            fallbackTotal: totalJemaat,
        },
        {
            title: "Jemaat Aktif",
            description: "Akumulasi akun jemaat berstatus aktif dalam 12 bulan terakhir.",
            valueLabel: "Jemaat aktif",
            newValueLabel: "Aktif baru",
            dataKey: "jemaatAktif",
            newDataKey: "newJemaatAktif",
            color: "#2563eb",
            accentClassName: "bg-blue-50 text-blue-700",
            fallbackTotal: totalJemaatAktif,
        },
    ];

    return (
        <section className="grid gap-4 xl:grid-cols-2" aria-label="Grafik statistik jemaat">
            {chartConfigs.map((config) => (
                <MembershipLineChart key={config.dataKey} config={config} data={data} />
            ))}
        </section>
    );
}
