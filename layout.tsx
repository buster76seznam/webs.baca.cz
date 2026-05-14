import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Webs Bača – Hosting & Web | Návrh do 60 minut",
  description: "Profesionální weby pro autoservisy, stavebnictví a B2B. Návrh do 60 minut, spuštění do 24 hodin. Vše za 1 700 Kč/měsíc bez vstupního poplatku.",
  keywords: ["tvorba webů", "webové stránky", "hosting", "web design", "autoservis web", "webs bača"],
  authors: [{ name: "Webs Bača" }],
  creator: "Webs Bača",
  metadataBase: new URL("https://webs.baca.cz"),
  openGraph: {
    title: "Webs Bača – Hosting & Web",
    description: "Návrh do 60 minut. Spuštění do 24 hodin. Vše za 1 700 Kč/měsíc.",
    url: "https://webs.baca.cz",
    siteName: "Webs Bača",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Webs Bača – Hosting & Web",
      },
    ],
    locale: "cs_CZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webs Bača – Hosting & Web",
    description: "Návrh do 60 minut. Spuštění do 24 hodin. Vše za 1 700 Kč/měsíc.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
