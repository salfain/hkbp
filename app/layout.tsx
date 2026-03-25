import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/providers/session-provider"; // Import provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistem Informasi HKBP Pondok Kopi",
  description: "Sistem Pendaftaran dan Komunikasi Jemaat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Bungkus seluruh aplikasi dengan AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}