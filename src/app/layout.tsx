import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DHS via PGS Medicamentos | Guia de Acesso a Medicamentos",
  description: "Guia de como ter acesso a medicamentos e fomentar o Desenvolvimento Harmônico Sustentável (DHS) via atuações resolutivas de Planejamento de Gestão Sistêmicos (PGS), Negociação, Mediação e Conciliação (NMC).",
  keywords: "medicamentos, DHS, PGS, NMC, ANVISA, Ministério Público, Defensoria Pública, saúde, Brasil, governo, mediação, conciliação",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
