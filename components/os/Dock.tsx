"use client";

import { useCallback, useEffect, useRef } from "react";
import { APP_BY_ID, APPS, type AppId } from "@/lib/os";
import AppIcon from "./AppIcon";

type Props = {
  openIds: Set<AppId>;
  minimized: AppId[];
  onOpen: (id: AppId) => void;
  onRestore: (id: AppId) => void;
};

// Magnification tuning
const AMP = 0.6; // peak extra scale (1 → 1.6)
const SPREAD = 62; // px falloff radius — how many neighbours lift
const LIFT = 20; // px the icon rises at full magnification
const EASE = 0.22; // per-frame approach (spring-like smoothing)

export default function Dock({ openIds, minimized, onOpen, onRestore }: Props) {
  const dockRef = useRef<HTMLDivElement>(null);
  const pointerX = useRef<number | null>(null);
  const rafRef = useRef(0);
  const tickRef = useRef<() => void>(() => {});
  const scales = useRef(new WeakMap<HTMLElement, number>());

  // Continuous, cursor-distance magnification with per-frame easing toward the
  // target — gives the smooth macOS "fluid" dock instead of discrete snapping.
  const tick = useCallback(() => {
    const dock = dockRef.current;
    if (!dock) { rafRef.current = 0; return; }
    const items = dock.querySelectorAll<HTMLElement>(".os-dock__item");
    const px = pointerX.current;
    let busy = false;

    items.forEach((it) => {
      const r = it.getBoundingClientRect();
      const center = r.left + r.width / 2; // client-space; stable under center-origin scale
      const target = px == null ? 1 : 1 + AMP * Math.exp(-Math.pow((px - center) / SPREAD, 2));
      let cur = scales.current.get(it) ?? 1;
      cur += (target - cur) * EASE;
      if (Math.abs(target - cur) > 0.0015) busy = true;
      else cur = target;
      scales.current.set(it, cur);
      it.style.transform = `scale(${cur.toFixed(3)}) translateY(${(-(cur - 1) * LIFT).toFixed(2)}px)`;
    });

    if (busy || px != null) rafRef.current = requestAnimationFrame(() => tickRef.current());
    else rafRef.current = 0;
  }, []);

  useEffect(() => { tickRef.current = tick; }, [tick]);

  const wake = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(() => tickRef.current());
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    pointerX.current = e.clientX;
    wake();
  }, [wake]);

  const onLeave = useCallback(() => {
    pointerX.current = null;
    wake();
  }, [wake]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return (
    <div className="os-dock-wrap">
      <div className="os-dock" ref={dockRef} onPointerMove={onMove} onPointerLeave={onLeave}>
        {APPS.map((app) => (
          <button
            key={app.id}
            className="os-dock__item"
            onClick={() => onOpen(app.id)}
            aria-label={app.name}
          >
            <span className="os-dock__tooltip">{app.name}</span>
            <span className="os-dock__icon">
              <AppIcon id={app.id} size={52} />
            </span>
            <span className={`os-dock__dot ${openIds.has(app.id) ? "is-open" : ""}`} />
          </button>
        ))}

        {minimized.length > 0 && <span className="os-dock__divider" />}

        {minimized.map((id) => {
          const app = APP_BY_ID[id];
          return (
            <button
              key={`min-${id}`}
              className="os-dock__item os-dock__min"
              onClick={() => onRestore(id)}
              aria-label={`Restore ${app.name}`}
            >
              <span className="os-dock__tooltip">{app.name} — minimized</span>
              <span className="os-dock__thumb">
                <span className="os-dock__thumb-bar"><i /><i /><i /></span>
                <span className="os-dock__thumb-body">
                  <span className="os-dock__thumb-badge">
                    <AppIcon id={id} size={16} />
                  </span>
                  <span className="os-dock__thumb-lines"><i /><i /></span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
