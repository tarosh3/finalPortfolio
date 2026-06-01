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

const SITE_URL = "https://taroshmathuria.in";
const TITLE = "Tarosh Mathuria — Senior Software Engineer";
const DESCRIPTION =
  "Senior Software Engineer building large-scale distributed backend systems in Go. Built Magicpin's ONDC Seller App from scratch — powering 60,000+ merchants with Kafka, MongoDB & Beckn protocol.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Tarosh Mathuria",
  },
  description: DESCRIPTION,
  applicationName: "Tarosh OS",
  authors: [{ name: "Tarosh Mathuria", url: SITE_URL }],
  creator: "Tarosh Mathuria",
  publisher: "Tarosh Mathuria",
  keywords: [
    "Tarosh Mathuria",
    "Senior Software Engineer",
    "Backend Engineer",
    "Go Developer",
    "Golang",
    "Distributed Systems",
    "ONDC",
    "Beckn Protocol",
    "Kafka",
    "Microservices",
    "Magicpin",
    "MongoDB",
    "Kubernetes",
    "Software Engineer Portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    siteName: "Tarosh Mathuria",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    firstName: "Tarosh",
    lastName: "Mathuria",
    username: "tarosh",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@tarosh",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

// Person schema — helps Google build a knowledge panel / understand who Tarosh is.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tarosh Mathuria",
  url: SITE_URL,
  jobTitle: "Senior Software Engineer II",
  email: "mailto:taroshmathuria@gmail.com",
  worksFor: {
    "@type": "Organization",
    name: "Magicpin",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Delhi Technological University",
  },
  knowsAbout: [
    "Go",
    "Distributed Systems",
    "ONDC",
    "Beckn Protocol",
    "Apache Kafka",
    "Microservices",
    "Kubernetes",
    "MongoDB",
    "Backend Engineering",
  ],
  sameAs: ["https://linkedin.com/in/tarosh", "https://github.com/tarosh3"],
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
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
