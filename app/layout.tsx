import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { FlowlyProvider } from "../src/presentation/context/FlowlyContext";
import { BottomNav } from "../src/presentation/components/layout/BottomNav";
import { PWARegistrar } from "../src/config/PWARegistrar";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Flowly",
  description: "Offline-first personal finance tracker",
  manifest: "/manifest.json",
};

export const viewport = {
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
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7TVTE4BS7T"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7TVTE4BS7T', { page_path: window.location.pathname });
          `}
        </Script>

        {/* Open Graph / Social Preview */}
        <meta property="og:title" content="Flowly - Personal Finance App" />
        <meta
          property="og:description"
          content="Track your income and expenses easily. Your data stays on your device, and it works as a PWA!"
        />
        <meta
          property="og:image"
          content="https://flowly-finance.vercel.app/preview.png"
        />
        <meta property="og:url" content="https://flowly-finance.vercel.app/" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Flowly - Personal Finance App" />
        <meta
          name="twitter:description"
          content="Track your income and expenses easily. Your data stays on your device, and it works as a PWA!"
        />
        <meta
          name="twitter:image"
          content="https://flowly-finance.vercel.app/preview.png"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-gray-50`}
      >
        <FlowlyProvider>
          <PWARegistrar />
          <div className="flex flex-col min-h-screen">
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <BottomNav />
          </div>
        </FlowlyProvider>
      </body>
    </html>
  );
}
