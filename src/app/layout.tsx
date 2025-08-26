import type { Metadata, Viewport } from "next";
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
  authors: [{ name: "Ministério Público Estadual" }],
  creator: "DHS via PGS Medicamentos",
  publisher: "Ministério Público",
  robots: "index, follow",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/icon-180x180.png", sizes: "180x180", type: "image/png" }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Med DHS"
  },
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#dc2626",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="application-name" content="Med DHS" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Med DHS" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#dc2626" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icon-180x180.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
