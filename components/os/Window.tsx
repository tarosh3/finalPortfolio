"use client";

import { useRef } from "react";
import type { AppMeta, WinState } from "@/lib/os";

const MENUBAR_H = 30;
const MIN_W = 320;
const MIN_H = 240;

type Props = {
  win: WinState;
  meta: AppMeta;
  focused: boolean;
  minimizing?: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMin: () => void;
  onMax: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (w: number, h: number) => void;
  children: React.ReactNode;
};

export default function Window({ win, meta, focused, minimizing, onFocus, onClose, onMin, onMax, onMove, onResize, children }: Props) {
  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const resizeRef = useRef<{ sx: number; sy: number; ow: number; oh: number } | null>(null);

  // ── Drag (pointer capture: events keep flowing even past the titlebar) ──
  const dragDown = (e: React.PointerEvent) => {
    if (win.max) return;
    if ((e.target as HTMLElement).closest(".os-traffic")) return;
    onFocus();
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: win.x, oy: win.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    document.body.classList.add("os-dragging");
  };
  const dragMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const x = Math.max(-(win.w - 180), Math.min(window.innerWidth - 60, d.ox + (e.clientX - d.sx)));
    const y = Math.max(MENUBAR_H, Math.min(window.innerHeight - 120, d.oy + (e.clientY - d.sy)));
    onMove(x, y);
  };
  const dragUp = (e: React.PointerEvent) => {
    dragRef.current = null;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    document.body.classList.remove("os-dragging");
  };

  // ── Resize (bottom-right handle) ──
  const resizeDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onFocus();
    resizeRef.current = { sx: e.clientX, sy: e.clientY, ow: win.w, oh: win.h };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    document.body.classList.add("os-dragging");
  };
  const resizeMove = (e: React.PointerEvent) => {
    const r = resizeRef.current;
    if (!r) return;
    const w = Math.max(MIN_W, Math.min(window.innerWidth - win.x - 12, r.ow + (e.clientX - r.sx)));
    const h = Math.max(MIN_H, Math.min(window.innerHeight - win.y - 12, r.oh + (e.clientY - r.sy)));
    onResize(w, h);
  };
  const resizeUp = (e: React.PointerEvent) => {
    resizeRef.current = null;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    document.body.classList.remove("os-dragging");
  };

  const style: React.CSSProperties = win.max
    ? { zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  return (
    <section
      className={`os-window ${win.max ? "os-window--max" : ""} ${focused ? "os-window--focused" : ""} ${win.min ? "os-window--min" : ""} ${minimizing ? "os-window--minimizing" : ""}`}
      style={style}
      onPointerDown={onFocus}
      role="dialog"
      aria-label={meta.name}
    >
      <header
        className="os-titlebar"
        onPointerDown={dragDown}
        onPointerMove={dragMove}
        onPointerUp={dragUp}
        onDoubleClick={onMax}
      >
        <div className="os-traffic">
          <button className="os-light os-light--close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 12 12" width="7" height="7"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
          <button className="os-light os-light--min" onClick={onMin} aria-label="Minimize">
            <svg viewBox="0 0 12 12" width="7" height="7"><path d="M3 6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
          <button className="os-light os-light--max" onClick={onMax} aria-label="Maximize">
            <svg viewBox="0 0 12 12" width="7" height="7"><path d="M3.5 3.5h5v5z" fill="currentColor" /></svg>
          </button>
        </div>
        <span className="os-titlebar__title">{meta.name}</span>
        <span className="os-titlebar__spacer" />
      </header>

      <div className="os-window__body">{children}</div>

      {!win.max && (
        <div
          className="os-resize"
          onPointerDown={resizeDown}
          onPointerMove={resizeMove}
          onPointerUp={resizeUp}
          aria-hidden
        />
      )}
    </section>
  );
}
