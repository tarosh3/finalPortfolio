"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { APPS, type AppId } from "@/lib/os";
import Sym from "./Sym";
import Logo from "./Logo";

type Props = {
  activeApp: string;
  activeId: AppId | null;
  onOpen: (id: AppId) => void;
  onSpotlight: () => void;
  onControlCenter: () => void;
};

export default function MenuBar({ activeApp, activeId, onOpen, onSpotlight, onControlCenter }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const initial = window.setTimeout(() => setNow(new Date()), 0);
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => {
      window.clearTimeout(initial);
      clearInterval(t);
    };
  }, []);

  const day = now?.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const time = now?.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div className="os-menubar">
      <div className="os-menubar__left">
        <span className="os-menubar__logo">
          <Logo size={19} />
        </span>
        <span className="os-menubar__app">{activeApp}</span>
        <nav className="os-menubar__nav" aria-label="Open app">
          {APPS.map((app) => (
            <button
              key={app.id}
              className={`os-menubar__navitem ${activeId === app.id ? "is-active" : ""}`}
              onClick={() => onOpen(app.id)}
            >
              {app.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="os-menubar__right">
        <Link href="/portfolio" className="os-menubar__portfolio" aria-label="Open the scrolling portfolio" title="Scrolling portfolio">
          <Sym name="view_day" size={17} />
          <span className="os-menubar__portfolio-label">Scroll view</span>
        </Link>
        <button className="os-menubar__search" onClick={onSpotlight} aria-label="Search apps">
          <Sym name="search" size={16} />
          <span className="os-menubar__search-label">Search</span>
          <kbd className="os-menubar__kbd">/</kbd>
        </button>
        <button className="os-menubar__cc" onClick={onControlCenter} aria-label="Control Center">
          <Sym name="tune" size={17} />
        </button>
        <Sym name="battery_full" size={19} className="os-menubar__icon" />
        <Sym name="wifi" size={17} className="os-menubar__icon" />
        <span className="os-menubar__clock">
          {day}
          <span className="os-menubar__time">{time}</span>
        </span>
      </div>
    </div>
  );
}
