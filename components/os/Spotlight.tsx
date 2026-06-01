"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { APPS, type AppId } from "@/lib/os";
import Sym from "./Sym";

type Props = {
  onOpen: (id: AppId) => void;
  onClose: () => void;
};

export default function Spotlight({ onOpen, onClose }: Props) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return APPS;
    return APPS.filter(
      (a) => a.name.toLowerCase().includes(t) || a.label.toLowerCase().includes(t) || a.desc.toLowerCase().includes(t)
    );
  }, [q]);
  const selectedIndex = Math.min(sel, Math.max(0, results.length - 1));

  const choose = (id: AppId) => { onOpen(id); onClose(); };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); if (results[selectedIndex]) choose(results[selectedIndex].id); }
    else if (e.key === "Escape") { e.preventDefault(); onClose(); }
  };

  return (
    <div className="os-spotlight" onPointerDown={onClose}>
      <div className="os-spotlight__panel" onPointerDown={(e) => e.stopPropagation()}>
        <div className="os-spotlight__search">
          <Sym name="search" size={22} className="os-spotlight__search-icon" />
          <input
            ref={inputRef}
            className="os-spotlight__input"
            placeholder="Search apps & sections…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={onKeyDown}
          />
          <kbd className="os-spotlight__esc">esc</kbd>
        </div>

        <div className="os-spotlight__list">
          {results.length === 0 && <p className="os-spotlight__empty">No matches.</p>}
          {results.map((app, i) => {
            return (
              <button
                key={app.id}
                className={`os-spotlight__item ${i === selectedIndex ? "is-sel" : ""}`}
                onPointerEnter={() => setSel(i)}
                onClick={() => choose(app.id)}
              >
                <span
                  className="os-spotlight__icon"
                  style={{ background: `linear-gradient(160deg, ${app.grad[0]}, ${app.grad[1]})` }}
                >
                  <Sym name={app.icon} size={18} fill className="os-spotlight__glyph" />
                </span>
                <span className="os-spotlight__text">
                  <span className="os-spotlight__name">{app.name}</span>
                  <span className="os-spotlight__desc">{app.desc}</span>
                </span>
                <span className="os-spotlight__enter">{i === selectedIndex ? "↩" : ""}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
