// macOS desktop — window manager types + app registry.

export type AppId =
  | "safari"
  | "about"
  | "experience"
  | "skills"
  | "projects"
  | "notes"
  | "games"
  | "contact";

export type AppMeta = {
  id: AppId;
  name: string; // window title + dock tooltip
  label: string; // short label for menubar nav
  desc: string; // one-line description for Spotlight
  icon: string; // Material Symbols glyph name
  grad: [string, string]; // dock icon gradient (top, bottom)
  w: number; // default window width
  h: number; // default window height
};

export type WinState = {
  id: AppId;
  open: boolean;
  min: boolean;
  max: boolean;
  z: number;
  x: number;
  y: number;
  w: number;
  h: number;
};

export const APPS: AppMeta[] = [
  { id: "safari", name: "Safari", label: "Portfolio", desc: "The full scrollable portfolio — one page, everything", icon: "explore", grad: ["#5eb3ff", "#1e7bff"], w: 1120, h: 720 },
  { id: "about", name: "About Me", label: "About", desc: "Who I am, the numbers, and teams I've shipped for", icon: "person", grad: ["#ff7aa8", "#ff0062"], w: 880, h: 560 },
  { id: "experience", name: "Experience", label: "Experience", desc: "Roles, timeline, and what I built", icon: "work", grad: ["#ffd95e", "#f0b400"], w: 900, h: 580 },
  { id: "skills", name: "Skills", label: "Skills", desc: "Languages, distributed systems, and tooling", icon: "code", grad: ["#6aa6ff", "#2f6fe4"], w: 900, h: 560 },
  { id: "projects", name: "Projects", label: "Projects", desc: "Selected production work", icon: "folder", grad: ["#46e0a4", "#00b894"], w: 980, h: 600 },
  { id: "notes", name: "Notes", label: "Blog", desc: "System-design deep dives and engineering notes", icon: "article", grad: ["#b794f6", "#7c5cff"], w: 1000, h: 640 },
  { id: "games", name: "Arcade", label: "Arcade", desc: "Three hand-built arcade games", icon: "sports_esports", grad: ["#ff9a4d", "#ff6b00"], w: 760, h: 660 },
  { id: "contact", name: "Mail", label: "Contact", desc: "Email, LinkedIn, and availability", icon: "mail", grad: ["#4fc8f5", "#2f6fe4"], w: 840, h: 580 },
];

export const APP_BY_ID = Object.fromEntries(APPS.map((a) => [a.id, a])) as Record<AppId, AppMeta>;

export type Theme = "light" | "dark";

export type Wallpaper = { name: string; light: string; dark: string };

export const WALLPAPERS: Wallpaper[] = [
  {
    // Default — a soft multi-bloom "aurora mesh". Pure CSS, crisp at any size.
    name: "Aurora",
    light:
      "radial-gradient(60% 52% at 14% 14%, rgba(255,214,0,.34), transparent 60%), radial-gradient(56% 46% at 86% 8%, rgba(255,122,178,.34), transparent 60%), radial-gradient(62% 56% at 90% 88%, rgba(108,166,255,.36), transparent 60%), radial-gradient(56% 50% at 8% 90%, rgba(160,130,255,.32), transparent 60%), radial-gradient(70% 60% at 48% 48%, rgba(255,255,255,.32), transparent 72%), linear-gradient(135deg,#fdf3ff,#e9f0ff)",
    dark:
      "radial-gradient(58% 48% at 14% 12%, rgba(255,214,0,.20), transparent 56%), radial-gradient(52% 44% at 86% 6%, rgba(255,0,98,.34), transparent 56%), radial-gradient(64% 58% at 90% 84%, rgba(47,111,228,.40), transparent 60%), radial-gradient(58% 50% at 6% 90%, rgba(124,92,255,.34), transparent 56%), linear-gradient(160deg,#06060d,#0b0d18 55%,#100a16)",
  },
  {
    // Vivid saturated flow — bolder, more "wow".
    name: "Nebula",
    light:
      "radial-gradient(50% 60% at 0% 0%, rgba(124,92,255,.40), transparent 55%), radial-gradient(60% 60% at 100% 0%, rgba(255,0,98,.34), transparent 55%), radial-gradient(70% 70% at 100% 100%, rgba(0,184,212,.40), transparent 58%), radial-gradient(60% 60% at 0% 100%, rgba(255,176,0,.36), transparent 58%), linear-gradient(135deg,#f3eaff,#eafcff)",
    dark:
      "radial-gradient(55% 65% at 0% 0%, rgba(124,92,255,.42), transparent 55%), radial-gradient(60% 60% at 100% 4%, rgba(255,0,98,.40), transparent 55%), radial-gradient(72% 72% at 100% 100%, rgba(0,184,212,.40), transparent 58%), radial-gradient(60% 62% at 0% 100%, rgba(255,176,0,.30), transparent 58%), linear-gradient(135deg,#070611,#0a0814 60%,#0c0610)",
  },
  {
    name: "Sunrise",
    light:
      "radial-gradient(70% 60% at 50% 0%, rgba(255,176,0,.42), transparent 62%), radial-gradient(60% 55% at 85% 20%, rgba(255,0,98,.28), transparent 60%), radial-gradient(60% 60% at 12% 30%, rgba(255,214,0,.30), transparent 60%), linear-gradient(165deg,#fff6ec,#ffeef4 55%,#fdf1ff)",
    dark:
      "radial-gradient(70% 60% at 50% 0%, rgba(255,140,0,.26), transparent 60%), radial-gradient(60% 55% at 85% 18%, rgba(255,0,98,.24), transparent 58%), radial-gradient(60% 60% at 12% 28%, rgba(255,214,0,.16), transparent 58%), linear-gradient(165deg,#15110f,#1a1018 60%,#191320)",
  },
  {
    name: "Ocean",
    light:
      "radial-gradient(60% 60% at 12% 16%, rgba(47,111,228,.34), transparent 60%), radial-gradient(64% 60% at 90% 84%, rgba(0,184,148,.32), transparent 60%), radial-gradient(50% 50% at 60% 30%, rgba(0,184,212,.24), transparent 60%), linear-gradient(165deg,#eaf3ff,#e7fbf4)",
    dark:
      "radial-gradient(60% 60% at 12% 16%, rgba(47,111,228,.34), transparent 58%), radial-gradient(66% 62% at 90% 84%, rgba(0,184,148,.26), transparent 58%), radial-gradient(50% 50% at 62% 28%, rgba(0,184,212,.22), transparent 58%), linear-gradient(165deg,#08111e,#0a1a1a)",
  },
  {
    name: "Graphite",
    light: "radial-gradient(80% 60% at 50% 0%, rgba(13,13,13,.05), transparent 60%), linear-gradient(165deg,#f7f7f9,#eceef3)",
    dark: "radial-gradient(80% 60% at 50% 0%, rgba(255,255,255,.05), transparent 60%), linear-gradient(165deg,#191920,#1d1d24)",
  },
];
