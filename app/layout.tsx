import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://xtracontext.com"),
  title: {
    default: "XtraContext — Give Your AI Infinite Memory",
    template: "%s | XtraContext"
  },
  description: "The persistent memory layer for AI agents. Capture, search, and recall every architectural decision via the Model Context Protocol.",
  keywords: [
    "AI Memory", 
    "Model Context Protocol", 
    "MCP Server", 
    "AI Engineering", 
    "Context Persistence", 
    "Developer Tools",
    "Architectural Memory",
    "AI Workflow Optimization"
  ],
  authors: [{ name: "Om Salunke" }],
  creator: "Om Salunke",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://xtracontext.com",
    title: "XtraContext — Give Your AI Infinite Memory",
    description: "The persistent memory layer for AI agents. Bridge the gap between ephemeral AI outputs and long-term architectural engineering.",
    siteName: "XtraContext",
    images: [{
      url: "/xtracontext.png",
      width: 1200,
      height: 630,
      alt: "XtraContext Branding",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "XtraContext — Give Your AI Infinite Memory",
    description: "The persistent memory layer for AI agents. Capture and recall architectural decisions.",
    images: ["/xtracontext.png"],
    creator: "@xtrafusion",
  },
  icons: {
    icon: "/xtracontext.png",
    apple: "/xtracontext.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import CommandMenu from "@/components/CommandMenu";
import { Toaster } from "sonner";
import StructuredData from "@/components/StructuredData";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-white/20 selection:text-white">
        <StructuredData />
        <Toaster theme="dark" position="top-right" richColors />
        <CommandMenu />
        {children}
      </body>
    </html>
  );
}

