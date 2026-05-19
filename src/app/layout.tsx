import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs"; // ✅ ADD THIS

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PixelForge AI — Premium AI Image Generation",
  description: "Professional-grade AI image generation platform. Single, bulk, and workflow modes with ultra-fast parallel rendering.",
  keywords: ["PixelForge", "AI", "image generation", "AI art", "bulk generation", "workflow", "API"],
  authors: [{ name: "PixelForge AI" }],
  icons: {
    icon: "https://access.vheer.com/results/oKFmGq7w.jpg",
  },
  openGraph: {
    title: "PixelForge AI — Premium AI Image Generation",
    description: "Professional-grade AI image generation with single, bulk, and workflow modes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelForge AI — Premium AI Image Generation",
    description: "Professional-grade AI image generation with single, bulk, and workflow modes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider> {/* ✅ ADD THIS LINE */}
      <html lang="en" className="dark" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}