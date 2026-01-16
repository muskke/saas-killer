import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SaaS Killer - Best Open Source Alternatives to SaaS",
    template: "%s | SaaS Killer"
  },
  description: "Curated directory of open-source alternatives to expensive SaaS. Self-host, save money, own your data. Stop paying SaaS rent.",
  keywords: ["open source", "SaaS alternatives", "self-hosted", "free software", "open source directory"],
  authors: [{ name: "The Venture Tyrant" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "SaaS Killer - Stop Paying SaaS Rent",
    description: "Curated directory of open-source alternatives. Self-host, save money, own your data.",
    type: "website",
    locale: "en_US",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Killer - Best Open Source Alternatives",
    description: "Curated directory of open-source alternatives to expensive SaaS.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://saas-killer.chaos-meme.cn"),
  manifest: "/manifest.json",
  other: {
    "msapplication-TileColor": "#6366f1",
  },
};

import Footer from "@/components/Footer";
import GoogleAdSense from "@/components/GoogleAdSense";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect hints for faster external resource loading */}
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pt-16 transition-colors duration-300 flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <GoogleAdSense />
        <ThemeProvider defaultTheme="dark" storageKey="saas-killer-theme">
          <Navbar />
          <div className="flex-grow bg-gray-50 dark:bg-zinc-950">
            {children}
          </div>
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

