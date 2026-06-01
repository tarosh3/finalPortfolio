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
    name: "Tarosh OS",
    light: "linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.18)), url('/assets/generated/tarosh-os-wallpaper.png')",
    dark: "linear-gradient(180deg, rgba(5,8,16,.18), rgba(5,8,16,.42)), url('/assets/generated/tarosh-os-wallpaper.png')",
  },
  {
    name: "Sunrise",
    light: "radial-gradient(1000px 700px at 18% 12%, rgba(255,214,0,.28), transparent 60%), radial-gradient(900px 700px at 85% 25%, rgba(255,0,98,.20), transparent 58%), linear-gradient(165deg,#fff7ef,#ffeef6 60%,#fef3ff)",
    dark: "radial-gradient(1000px 700px at 18% 12%, rgba(255,214,0,.16), transparent 60%), radial-gradient(900px 700px at 85% 25%, rgba(255,0,98,.16), transparent 58%), linear-gradient(165deg,#17151b,#1b1320 60%,#1a1622)",
  },
  {
    name: "Blossom",
    light: "radial-gradient(900px 700px at 80% 15%, rgba(255,0,98,.22), transparent 60%), radial-gradient(900px 800px at 20% 90%, rgba(47,111,228,.20), transparent 60%), linear-gradient(160deg,#fdf0f6,#eef0ff)",
    dark: "radial-gradient(900px 700px at 80% 15%, rgba(255,0,98,.18), transparent 60%), radial-gradient(900px 800px at 20% 90%, rgba(47,111,228,.18), transparent 60%), linear-gradient(160deg,#181318,#11131f)",
  },
  {
    name: "Ocean",
    light: "radial-gradient(1000px 700px at 15% 20%, rgba(47,111,228,.22), transparent 60%), radial-gradient(900px 700px at 88% 80%, rgba(0,184,148,.20), transparent 60%), linear-gradient(165deg,#eef4ff,#eafaf4)",
    dark: "radial-gradient(1000px 700px at 15% 20%, rgba(47,111,228,.20), transparent 60%), radial-gradient(900px 700px at 88% 80%, rgba(0,184,148,.16), transparent 60%), linear-gradient(165deg,#101521,#0f1a18)",
  },
  {
    name: "Graphite",
    light: "linear-gradient(165deg,#f6f6f8,#eceef3)",
    dark: "linear-gradient(165deg,#1a1a1d,#1e1e23)",
  },
];
