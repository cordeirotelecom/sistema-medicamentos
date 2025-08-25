import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BeforeUnloadHandler from "@/components/BeforeUnloadHandler";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DHS via PGS Medicamentos | Guia de Acesso a Medicamentos",
  description: "Guia de como ter acesso a medicamentos e fomentar o Desenvolvimento Harmônico Sustentável (DHS) via atuações resolutivas de Planejamento de Gestão Sistêmicos (PGS), Negociação, Mediação e Conciliação (NMC).",
  keywords: "medicamentos, DHS, PGS, NMC, ANVISA, Ministério Público, Defensoria Pública, saúde, Brasil, governo, mediação, conciliação",
  authors: [{ name: "Ministério Público Estadual" }],
  creator: "DHS via PGS Medicamentos",
  publisher: "Ministério Público",
  robots: "index, follow",
  openGraph: {
    title: "DHS via PGS Medicamentos",
    description: "Sistema integrado de orientação para acesso a medicamentos com consulta à base legal atualizada",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "DHS via PGS Medicamentos",
    description: "Sistema integrado de orientação para acesso a medicamentos",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#dc2626",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        <BeforeUnloadHandler />
        {children}
      </body>
    </html>
  );
}
