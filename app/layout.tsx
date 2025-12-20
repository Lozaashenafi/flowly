import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FlowlyProvider } from "../src/presentation/context/FlowlyContext";
import { BottomNav } from "../src/presentation/components/layout/BottomNav";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-gray-50`}
      >
        <FlowlyProvider>
          <div className="flex flex-col min-h-screen">
            {/* Main content area - grows to fill space but respects bottom nav */}
            <main className="flex-1 pb-20 md:pb-0">{children}</main>

            {/* Fixed bottom navigation */}
            <BottomNav />
          </div>
        </FlowlyProvider>
      </body>
    </html>
  );
}
