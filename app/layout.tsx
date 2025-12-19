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
  themeColor: "#111827",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FlowlyProvider>
          <div>
            {children}
            <BottomNav />
          </div>
        </FlowlyProvider>
      </body>
    </html>
  );
}
