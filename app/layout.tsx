import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import "./macos.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tarosh Mathuria — Senior Software Engineer",
  description:
    "Senior Software Engineer building large-scale distributed backend systems in Go. 60,000+ merchants powered on ONDC at Magicpin.",
  keywords: ["Tarosh Mathuria", "Software Engineer", "Go", "Distributed Systems", "ONDC", "Magicpin", "Backend"],
  openGraph: {
    title: "Tarosh Mathuria — Senior Software Engineer",
    description: "Building systems that survive the real world. 4+ years, 60K+ merchants, Go & distributed systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400..700,0..1,0"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
