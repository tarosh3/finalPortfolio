"use client";

import { useState, useEffect } from "react";

// Action Yellow (--action) stays fixed across themes — only the marker/blob hue shifts.
// Every accent is dark enough for white text on hover-fills (WCAG AA).
const themes = [
  { name: "Magicpin", accent: "#ff0062", accent2: "#2f6fe4", accent3: "#ffd600" },
  { name: "Electric", accent: "#1d4ed8", accent2: "#ff0062", accent3: "#06b6d4" },
  { name: "Forest", accent: "#047857", accent2: "#16a34a", accent3: "#84cc16" },
  { name: "Sunset", accent: "#c2410c", accent2: "#ff0062", accent3: "#f59e0b" },
  { name: "Mono", accent: "#0d0d0d", accent2: "#404040", accent3: "#ffd600" },
];

export default function ThemeSwitcher() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const theme = themes[index];
    document.documentElement.style.setProperty("--accent", theme.accent);
    document.documentElement.style.setProperty("--accent-2", theme.accent2);
    document.documentElement.style.setProperty("--accent-3", theme.accent3);
  }, [index]);

  return (
    <div className={`theme-switcher ${open ? "theme-switcher--open" : ""}`}>
      <button
        className="theme-switcher__toggle"
        onClick={() => setOpen(!open)}
        aria-label="Change theme"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </button>

      {open && (
        <div className="theme-switcher__panel">
          <span className="theme-switcher__label">Theme</span>
          <div className="theme-switcher__options">
            {themes.map((theme, i) => (
              <button
                key={theme.name}
                className={`theme-switcher__dot ${i === index ? "theme-switcher__dot--active" : ""}`}
                style={{ background: theme.accent }}
                onClick={() => { setIndex(i); setOpen(false); }}
                aria-label={theme.name}
                title={theme.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
