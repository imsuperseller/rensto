import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: env.NEXT_PUBLIC_SITE_NAME,
    template: `%s | ${env.NEXT_PUBLIC_SITE_NAME}`,
  },
  description: "Automations that ship in days — not months. Transform your manual processes into intelligent workflows.",
  keywords: ["automation", "n8n", "workflows", "business process", "SMB", "Amazon sellers"],
  authors: [{ name: "Shai Friedman" }],
  creator: "Shai Friedman",
  publisher: "Rensto LLC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://rensto.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rensto.com',
    title: env.NEXT_PUBLIC_SITE_NAME,
    description: "Automations that ship in days — not months. Transform your manual processes into intelligent workflows.",
    siteName: env.NEXT_PUBLIC_SITE_NAME,
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Rensto - Automations that ship in days',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: env.NEXT_PUBLIC_SITE_NAME,
    description: "Automations that ship in days — not months. Transform your manual processes into intelligent workflows.",
    images: ['/opengraph-image.png'],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0B1318" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-background text-text">
          {children}
        </div>
      </body>
    </html>
  );
}
