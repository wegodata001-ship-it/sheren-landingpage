import type { Metadata, Viewport } from "next";
import { Cairo, Geist } from "next/font/google";

import { siteConfig } from "@/data/siteConfig";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

// Update SEO defaults from src/data/siteConfig.ts after duplicating this template.
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: siteConfig.pageTitle,
  description: siteConfig.pageDescription,
  keywords: siteConfig.keywords,
  openGraph: {
    title: siteConfig.openGraphTitle,
    description: siteConfig.openGraphDescription,
    url: siteConfig.siteUrl,
    siteName: siteConfig.businessName,
    images: [siteConfig.openGraphImage],
    locale: "he_IL",
    type: "website",
  },
  icons: {
    icon: siteConfig.faviconPath,
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.primaryColor,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="he"
      dir="rtl"
      className={`${geistSans.variable} ${cairo.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
