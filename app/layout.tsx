import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Signalist",
  description: "Track real-time stock prices, get personalized alerts, and explore detailed company insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-linear-to-r bg-black">
        
        {/* FULL WIDTH BACKGROUND */}
        <div className="min-h-screen">
          
          {/* CENTERED CONTENT CONTAINER */}
          <div className="max-w-7xl mx-auto px-6">
            {children}
          </div>

        </div>

        <Toaster />
      </body>
    </html>
  );
}
