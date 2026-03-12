import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arranjo de Caronas",
  description: "Gerenciamento de caronas para o arranjo de domingo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t py-6 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Arranjo de Caronas
          </footer>
        </div>
      </body>
    </html>
  );
}
