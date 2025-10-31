import type { Metadata } from "next";
import { Outfit } from "next/font/google";

import { Toaster } from "@/components/ui/sonner"

import "./globals.css";
import { Navbar } from "@/components/navbar";

const outfit = Outfit({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Neptune",
  description: "Music recognition and recommendation system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className} flex flex-col min-h-screen antialiased`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Toaster richColors/>
      </body>
    </html>
  );
}
