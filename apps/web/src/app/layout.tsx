import "@/assets/styles/globals.css";
import { AppLayout } from "@/components/AppLayout";
import { detectLanguage } from "@/i18n/detectLanguage";
import { initServerI18n } from "@/i18n/initServerI18n";
import { defaultNS } from "@liberfi.io/i18n/server";
import { BRAND_CONFIG } from "@liberfi/core";
import "agent-widget/dist/index.css";
import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await detectLanguage();
  const i18n = await initServerI18n(locale);
  const t = i18n.getFixedT(locale, defaultNS);
  
  return {
    applicationName: t("extend.application_name", { brand: BRAND_CONFIG.name }),
    title: t("extend.title", { brand: BRAND_CONFIG.name }),
    description: t("extend.description"),
    openGraph: {
      type: "website",
      url: process.env.NEXT_PUBLIC_SITE_URL,
      siteName: t("extend.application_name", { brand: BRAND_CONFIG.name }),
      title: t("extend.title", { brand: BRAND_CONFIG.name }),
      description: t("extend.description"),
    },
    formatDetection: {
      date: false,
      email: false,
      address: false,
      url: false,
      telephone: false,
    },
    icons: {
      icon: {
        url: "/favicon.ico",
        sizes: "128x128",
        type: "image/x-icon",
      },
    },
  };
}

const inter = Inter({
  subsets: ["latin"],
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await detectLanguage();
  await initServerI18n(locale);
  return (
    <html lang={locale} className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <body className={inter.className}>
        <AppLayout locale={locale}>{children}</AppLayout>
      </body>
    </html>
  );
}
