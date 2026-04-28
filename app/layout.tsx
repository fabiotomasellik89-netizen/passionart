import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { OrganizationJsonLd } from "@/components/seo/organization-jsonld";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { WhatsAppButton } from "@/components/marketing/whatsapp-button";
import { DiscountPopup } from "@/components/marketing/discount-popup";
import { siteConfig } from "@/lib/constants";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.claim}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.claim}`,
    description: siteConfig.description,
    images: ["/images/logo.jpeg"],
    siteName: siteConfig.name,
    locale: "it_IT",
    type: "website",
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
        <OrganizationJsonLd />
        <AnalyticsProvider />
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(244,173,197,0.28),transparent_60%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-24 h-[28rem] bg-[radial-gradient(circle_at_top_right,rgba(229,208,184,0.24),transparent_50%)]" />
          <Header />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer />
        </div>
        <WhatsAppButton />
        <DiscountPopup />
      </body>
    </html>
  );
}
