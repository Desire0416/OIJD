import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.fullName} (${siteConfig.section})`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "OIJD",
    "jeunesse diplomatique",
    "Cote d'Ivoire",
    "diplomatie",
    "appels a projets",
    "candidatures",
    "cooperation internationale",
  ],
  authors: [{ name: siteConfig.digitalAccess.name }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: `${siteConfig.name} - ${siteConfig.fullNameWithSection}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: "/brand/oijd-logo-compact.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-white font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
