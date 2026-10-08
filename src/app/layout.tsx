import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

export const metadata: Metadata = {
  title: "DnD 5.5e Interactive Character Sheet",
  description: "Interactive Dungeons & Dragons 5.5e (2024) character sheet — fully editable, with dice roller and cloud save.",
  keywords: ["DnD", "Dungeons and Dragons", "5.5e", "character sheet", "interactive", "Next.js"],
  authors: [{ name: "Z.ai" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "DnD 5.5e Interactive Character Sheet",
    description: "Editable, dice-rolling, cloud-saving DnD 5.5e character sheet.",
    url: "https://chat.z.ai",
    siteName: "Z.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DnD 5.5e Interactive Character Sheet",
    description: "Editable, dice-rolling, cloud-saving DnD 5.5e character sheet.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <SonnerToaster position="top-center" />
      </body>
    </html>
  );
}
