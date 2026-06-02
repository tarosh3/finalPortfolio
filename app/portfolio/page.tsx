import type { Metadata } from "next";
import Link from "next/link";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import ArcadeSection from "@/components/ArcadeSection";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Tarosh Mathuria — Senior Software Engineer. A scrolling portfolio: Go, distributed systems, ONDC, and 60,000+ merchants powered at Magicpin.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <SmoothScroll>
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <ThemeSwitcher />

      {/* Switch back to the macOS-themed experience */}
      <Link href="/" className="os-switch" aria-label="Switch to the macOS desktop view" data-cursor-label="macOS">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
        <span>macOS view</span>
      </Link>

      <main>
        <Hero />
        <Clients />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <ArcadeSection />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
