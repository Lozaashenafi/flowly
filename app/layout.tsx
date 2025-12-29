import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { FlowlyProvider } from "../src/presentation/context/FlowlyContext";
import { BottomNav } from "../src/presentation/components/layout/BottomNav";
import { PWARegistrar } from "../src/config/PWARegistrar";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeProvider } from "../src/presentation/components/theme-provider";

import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Flowly - Personal Finance App",
  description:
    "Track your income and expenses easily. Your data stays on your device, and it works as a PWA!",
  manifest: "/manifest.json",
  openGraph: {
    title: "Flowly - Personal Finance App",
    description:
      "Track your income and expenses easily. Your data stays on your device, and it works as a PWA!",
    url: "https://flowly-finance.vercel.app/",
    siteName: "Flowly",
    images: [
      {
        url: "https://flowly-finance.vercel.app/preview.png", // Fix this URL – see below
        width: 1200,
        height: 630,
        alt: "Flowly Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flowly - Personal Finance App",
    description:
      "Track your income and expenses easily. Your data stays on your device, and it works as a PWA!",
    images: ["https://flowly-finance.vercel.app/preview.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#477A71",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FlowlyProvider>
            <PWARegistrar />
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-500">
              <main className="flex-1 pb-20 md:pb-0">{children}</main>
              <BottomNav />
            </div>
          </FlowlyProvider>
        </ThemeProvider>
        <Analytics />
        <GoogleAnalytics gaId="G-7TVTE4BS7T" />
      </body>
    </html>
  );
}
