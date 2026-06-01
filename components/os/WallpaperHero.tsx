import Logo from "./Logo";

// Branded hero on the wallpaper — visible when no window covers the center,
// so a first-time visitor instantly knows whose desktop this is.
export default function WallpaperHero() {
  return (
    <div className="os-hero" aria-hidden>
      <Logo size={84} className="os-hero__mark" />
      <h1 className="os-hero__name">Tarosh Mathuria</h1>
      <p className="os-hero__role">
        Senior Software Engineer <span>·</span> Go &amp; Distributed Systems
      </p>
      <p className="os-hero__meta">60,000+ merchants on ONDC · 4+ years · Magicpin</p>
      <span className="os-hero__hint">Open an app from the Dock to explore</span>
    </div>
  );
}
