import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LucideIcon, ArrowRight } from "lucide-react";
import React from "react";

interface CallToActionAlertProps {
    title: string;
    description: React.ReactNode;
    icon?: LucideIcon;
    actionLink?: string;
    actionText?: string;
    variant?: "info" | "warning" | "success" | "danger";
    className?: string;
}

export default function CallToActionAlert({
    title,
    description,
    icon: Icon,
    actionLink,
    actionText,
    variant = "info",
    className = ""
}: CallToActionAlertProps) {
    const styles = {
        info: {
            container: "bg-blue-50 border-blue-200",
            title: "text-blue-900",
            desc: "text-blue-700",
            icon: "text-blue-600",
            button: "bg-blue-600 hover:bg-blue-700 text-white"
        },
        warning: {
            container: "bg-orange-50 border-orange-200",
            title: "text-orange-900",
            desc: "text-orange-700",
            icon: "text-orange-600",
            button: "bg-orange-600 hover:bg-orange-700 text-white"
        },
        success: {
            container: "bg-emerald-50 border-emerald-200",
            title: "text-emerald-900",
            desc: "text-emerald-700",
            icon: "text-emerald-600",
            button: "bg-emerald-600 hover:bg-emerald-700 text-white"
        },
        danger: {
            container: "bg-red-50 border-red-200",
            title: "text-red-900",
            desc: "text-red-700",
            icon: "text-red-600",
            button: "bg-red-600 hover:bg-red-700 text-white"
        }
    };

    const currentStyle = styles[variant];

    return (
        <div className={`mb-4 border p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm transition-all ${currentStyle.container} ${className}`}>
            <div>
                <h3 className={`font-bold flex items-center gap-2 ${currentStyle.title}`}>
                    {Icon && <Icon className={`h-5 w-5 ${currentStyle.icon}`} />}
                    {title}
                </h3>
                <p className={`text-sm mt-1 ${currentStyle.desc}`}>
                    {description}
                </p>
            </div>
            {actionLink && actionText && (
                <Link href={actionLink} className="shrink-0 w-full sm:w-auto">
                    <Button size="sm" className={`w-full sm:w-auto rounded-lg shadow-sm ${currentStyle.button}`}>
                        {actionText} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            )}
        </div>
    );
}