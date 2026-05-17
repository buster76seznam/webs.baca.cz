import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteTitle = "Webs Bača – tvorba webů, hosting a SEO";
const siteDescription =
  "Profesionální weby s návrhem do 60 minut a spuštěním do 24 hodin. Hosting, SSL, správa obsahu a servis za 1 700 Kč měsíčně bez vstupního poplatku.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteTitle,
    template: "%s | Webs Bača",
  },
  description: siteDescription,
  applicationName: "Webs Bača",
  authors: [{ name: "Webs Bača", url: SITE_URL }],
  creator: "Webs Bača",
  keywords: [
    "tvorba webů",
    "webové stránky",
    "hosting",
    "Webs Bača",
    "autoservis web",
    "SEO",
    "rychlý web",
    "návrh webu do hodiny",
    "Česko",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: SITE_URL,
    siteName: "Webs Bača",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: "/Logo.png", width: 1200, height: 1200, alt: "Webs Bača – logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/Logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#030303",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Webs Bača",
      description: siteDescription,
      inLanguage: "cs-CZ",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Webs Bača",
      url: SITE_URL,
      logo: `${SITE_URL}/Logo.png`,
      email: "webs.baca@gmail.com",
    },
    {
      "@type": "ProfessionalService",
      name: "Webs Bača – webdesign a hosting",
      url: SITE_URL,
      image: `${SITE_URL}/Logo.png`,
      areaServed: { "@type": "Country", name: "Czech Republic" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" href="/icon.png?v=2" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
