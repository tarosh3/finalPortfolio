"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { APP_BY_ID, type AppId, type Theme, WALLPAPERS, type WinState } from "@/lib/os";
import MenuBar from "./MenuBar";
import Dock from "./Dock";
import BootScreen from "./BootScreen";
import Window from "./Window";
import Spotlight from "./Spotlight";
import Welcome from "./Welcome";
import ControlCenter from "./ControlCenter";
import ContextMenu, { type CtxItem } from "./ContextMenu";
import Sym from "./Sym";
import WallpaperHero from "./WallpaperHero";
import MobileHome from "./MobileHome";
import AboutApp from "./apps/AboutApp";
import ExperienceApp from "./apps/ExperienceApp";
import SkillsApp from "./apps/SkillsApp";
import ProjectsApp from "./apps/ProjectsApp";
import NotesApp from "./apps/NotesApp";
import GamesApp from "./apps/GamesApp";
import ContactApp from "./apps/ContactApp";
import SafariApp from "./apps/SafariApp";

const CONTENT: Record<AppId, React.ReactNode> = {
  safari: <SafariApp />,
  about: <AboutApp />,
  experience: <ExperienceApp />,
  skills: <SkillsApp />,
  projects: <ProjectsApp />,
  notes: <NotesApp />,
  games: <GamesApp />,
  contact: <ContactApp />,
};

const DESKTOP_ICONS: AppId[] = ["projects", "games", "about"];

export default function MacDesktop() {
  const [booted, setBooted] = useState(false);
  const [windows, setWindows] = useState<WinState[]>([]);
  const [activeId, setActiveId] = useState<AppId | null>(null);
  const [spotlight, setSpotlight] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [wallpaper, setWallpaper] = useState(0);
  const [ccOpen, setCcOpen] = useState(false);
  const [ctx, setCtx] = useState<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileApp, setMobileApp] = useState<AppId | null>(null);
  const [minimizingId, setMinimizingId] = useState<AppId | null>(null);
  const zRef = useRef(10);
  const nextZ = () => (zRef.current += 1);

  // Track viewport so mobile gets a native-style home screen, not draggable windows.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const focus = useCallback((id: AppId) => {
    const z = nextZ();
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, z, min: false } : w)));
    setActiveId(id);
  }, []);

  const openApp = useCallback((id: AppId) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === id);
      const z = nextZ();
      if (existing) return prev.map((w) => (w.id === id ? { ...w, open: true, min: false, z } : w));
      const meta = APP_BY_ID[id];
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = Math.min(meta.w, vw - 40);
      const h = Math.min(meta.h, vh - 130);
      const n = prev.length % 5;
      const x = Math.max(16, Math.round((vw - w) / 2) - 70 + n * 30);
      const y = Math.max(46, 58 + n * 28);
      return [...prev, { id, open: true, min: false, max: false, z, x, y, w, h }];
    });
    setActiveId(id);
  }, []);

  const closeApp = useCallback((id: AppId) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveId((cur) => (cur === id ? null : cur));
  }, []);

  const minApp = useCallback((id: AppId) => {
    // genie: play the suck-into-dock animation, then actually hide the window
    setMinimizingId(id);
    setActiveId((cur) => (cur === id ? null : cur));
    window.setTimeout(() => {
      setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, min: true } : w)));
      setMinimizingId((cur) => (cur === id ? null : cur));
    }, 340);
  }, []);

  const maxApp = useCallback((id: AppId) => {
    focus(id);
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, max: !w.max } : w)));
  }, [focus]);

  const moveApp = useCallback((id: AppId, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const resizeApp = useCallback((id: AppId, w: number, h: number) => {
    setWindows((prev) => prev.map((win) => (win.id === id ? { ...win, w, h } : win)));
  }, []);

  // Restore a minimized window from the Dock.
  const restoreApp = useCallback((id: AppId) => focus(id), [focus]);

  // Load saved appearance + wallpaper.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const t = localStorage.getItem("os:theme");
        if (t === "dark" || t === "light") setTheme(t);
        const w = Number(localStorage.getItem("os:wallpaper"));
        if (Number.isFinite(w) && w >= 0 && w < WALLPAPERS.length) setWallpaper(w);
      } catch {
        /* storage unavailable */
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const applyTheme = useCallback((t: Theme) => {
    setTheme(t);
    try { localStorage.setItem("os:theme", t); } catch { /* ignore */ }
  }, []);

  const applyWallpaper = useCallback((i: number) => {
    setWallpaper(i);
    try { localStorage.setItem("os:wallpaper", String(i)); } catch { /* ignore */ }
  }, []);

  // Open the portfolio site once the desktop boots (desktop only — mobile shows the home screen).
  useEffect(() => {
    if (!booted || isMobile) return;
    const timer = window.setTimeout(() => openApp("safari"), 0);
    return () => window.clearTimeout(timer);
  }, [booted, isMobile, openApp]);

  // First-run welcome hint (once per browser).
  useEffect(() => {
    if (!booted) return;
    const timer = window.setTimeout(() => {
      try {
        if (!localStorage.getItem("os:welcomed")) setWelcome(true);
      } catch {
        /* storage unavailable */
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [booted]);

  const dismissWelcome = useCallback(() => {
    setWelcome(false);
    try {
      localStorage.setItem("os:welcomed", "1");
    } catch {
      /* storage unavailable */
    }
  }, []);

  const startTour = useCallback(() => {
    dismissWelcome();
    openApp("projects");
    openApp("contact");
  }, [dismissWelcome, openApp]);

  // Keyboard: "/" or ⌘K open Spotlight · Esc closes Spotlight, then the focused window.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSpotlight((s) => !s);
        return;
      }
      if (e.key === "/" && !typing && !spotlight) {
        e.preventDefault();
        setSpotlight(true);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "w") {
        if (activeId) { e.preventDefault(); closeApp(activeId); }
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "m") {
        if (activeId) { e.preventDefault(); minApp(activeId); }
        return;
      }
      if (e.key === "Escape") {
        if (ctx) setCtx(null);
        else if (ccOpen) setCcOpen(false);
        else if (spotlight) setSpotlight(false);
        else if (activeId) closeApp(activeId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [spotlight, activeId, closeApp, minApp, ctx, ccOpen]);

  const openIds = new Set(windows.map((w) => w.id));
  const minimized = windows.filter((w) => w.min).map((w) => w.id);
  const activeName = activeId ? APP_BY_ID[activeId].name : "Finder";

  const ctxItems: CtxItem[] = [
    { label: "Search apps…", onClick: () => setSpotlight(true) },
    { label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode", onClick: () => applyTheme(theme === "dark" ? "light" : "dark") },
    { label: "Change Wallpaper", onClick: () => applyWallpaper((wallpaper + 1) % WALLPAPERS.length) },
    { label: "", onClick: () => {}, divider: true },
    { label: "Close All Windows", onClick: () => { setWindows([]); setActiveId(null); }, danger: true },
  ];

  // ── Mobile: native-style home screen + full-screen app sheet ──
  if (isMobile) {
    const app = mobileApp ? APP_BY_ID[mobileApp] : null;
    return (
      <div className={`os-desktop os-mobile ${theme === "dark" ? "is-dark" : ""}`}>
        {!booted && <BootScreen onDone={() => setBooted(true)} />}
        <div className="os-wallpaper" aria-hidden style={{ background: WALLPAPERS[wallpaper][theme] }} />
        {app ? (
          <div className="os-msheet">
            <header className="os-msheet__bar">
              <button className="os-msheet__home" onClick={() => setMobileApp(null)}>
                <Sym name="chevron_left" size={20} /> Home
              </button>
              <span className="os-msheet__title">{app.name}</span>
              <span className="os-msheet__spacer" />
            </header>
            <div className="os-msheet__body">{CONTENT[mobileApp as AppId]}</div>
          </div>
        ) : (
          <MobileHome onOpen={(id) => setMobileApp(id)} />
        )}
      </div>
    );
  }

  return (
    <div className={`os-desktop ${theme === "dark" ? "is-dark" : ""}`}>
      {!booted && <BootScreen onDone={() => setBooted(true)} />}

      <div
        className="os-wallpaper"
        aria-hidden
        style={{ background: WALLPAPERS[wallpaper][theme] }}
        onDoubleClick={() => setSpotlight(true)}
        onContextMenu={(e) => { e.preventDefault(); setCtx({ x: e.clientX, y: e.clientY }); }}
      />

      {windows.length === 0 && <WallpaperHero />}

      <MenuBar
        activeApp={activeName}
        activeId={activeId}
        onOpen={openApp}
        onSpotlight={() => setSpotlight(true)}
        onControlCenter={() => setCcOpen((o) => !o)}
      />

      {/* Desktop shortcuts (top-right) */}
      <div className="os-desktop-icons">
        {DESKTOP_ICONS.map((id) => (
          <button key={id} className="os-desktop-icon" onDoubleClick={() => openApp(id)} onClick={() => openApp(id)}>
            <span
              className="os-desktop-icon__badge"
              style={{ background: `linear-gradient(160deg, ${APP_BY_ID[id].grad[0]}, ${APP_BY_ID[id].grad[1]})` }}
            >
              <Sym name={APP_BY_ID[id].icon} size={24} fill />
            </span>
            <span className="os-desktop-icon__label">{APP_BY_ID[id].name}</span>
          </button>
        ))}
      </div>

      {/* Windows */}
      {windows.map((w) => (
        <Window
          key={w.id}
          win={w}
          meta={APP_BY_ID[w.id]}
          focused={activeId === w.id}
          minimizing={minimizingId === w.id}
          onFocus={() => focus(w.id)}
          onClose={() => closeApp(w.id)}
          onMin={() => minApp(w.id)}
          onMax={() => maxApp(w.id)}
          onMove={(x, y) => moveApp(w.id, x, y)}
          onResize={(nw, nh) => resizeApp(w.id, nw, nh)}
        >
          {CONTENT[w.id]}
        </Window>
      ))}

      {welcome && <Welcome onStart={startTour} onClose={dismissWelcome} />}
      {spotlight && <Spotlight onOpen={openApp} onClose={() => setSpotlight(false)} />}
      {ccOpen && (
        <ControlCenter
          theme={theme}
          wallpaper={wallpaper}
          onTheme={applyTheme}
          onWallpaper={applyWallpaper}
          onClose={() => setCcOpen(false)}
        />
      )}
      {ctx && <ContextMenu x={ctx.x} y={ctx.y} items={ctxItems} onClose={() => setCtx(null)} />}

      <Dock openIds={openIds} minimized={minimized} onOpen={openApp} onRestore={restoreApp} />
    </div>
  );
}
