"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/lib/portfolio-data";
import { useMagnetic } from "@/lib/useMagnetic";
import Logo from "@/components/os/Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.45);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      // Find active section
      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActive(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <a href="#hero" className="navbar__logo" aria-label="Tarosh Mathuria — home">
        <Logo size={38} />
      </a>

      <div className="navbar__links">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`navbar__link ${active === link.href.replace("#", "") ? "navbar__link--active" : ""}`}
          >
            {link.label}
          </a>
        ))}
      </div>

      <a
        ref={ctaRef}
        href="mailto:taroshmathuria@gmail.com"
        className="navbar__cta"
        data-cursor-label="Email"
      >
        <span className="navbar__cta-inner">Let&apos;s Talk</span>
      </a>
    </nav>
  );
}
