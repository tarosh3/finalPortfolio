"use client";

import Logo from "./Logo";

// Branded hero on the wallpaper — visible when no window covers the center,
// so a first-time visitor instantly knows whose desktop this is.
export default function WallpaperHero() {
  const openSafari = () => window.dispatchEvent(new CustomEvent("os:open", { detail: "safari" }));
  const openAbout = () => window.dispatchEvent(new CustomEvent("os:open", { detail: "about" }));

  return (
    <div className="os-hero">
      <button className="os-hero__mark" onClick={openAbout} aria-label="Open About Me" type="button">
        <Logo size={84} />
      </button>
      <h1 className="os-hero__name">Tarosh Mathuria</h1>
      <p className="os-hero__role">
        Senior Software Engineer <span>·</span> Go &amp; Distributed Systems
      </p>
      <p className="os-hero__meta">60,000+ merchants on ONDC · 4+ years · Magicpin</p>
      <button className="os-hero__cta" onClick={openSafari} type="button">
        <span>Open the portfolio</span>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
          <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
