"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  // Decide whether to enable — fine pointers (mouse) only, never touch.
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const timer = window.setTimeout(() => setEnabled(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Wire up cursor behavior only AFTER the elements are rendered.
  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let visible = false;
    const onMove = (e: MouseEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onLeaveWindow = () => {
      visible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };

    // Interactive hover state — grow ring, optional label
    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        "a, button, [data-cursor], input, .marquee__item, .skill-pill, .tech-pill"
      ) as HTMLElement | null;
      if (target) {
        ring.classList.add("cursor__ring--active");
        const text = target.getAttribute("data-cursor-label");
        if (text) {
          label.textContent = text;
          ring.classList.add("cursor__ring--labeled");
        }
      }
    };
    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        "a, button, [data-cursor], input, .marquee__item, .skill-pill, .tech-pill"
      ) as HTMLElement | null;
      if (target) {
        ring.classList.remove("cursor__ring--active", "cursor__ring--labeled");
        label.textContent = "";
      }
    };

    const onDown = () => ring.classList.add("cursor__ring--down");
    const onUp = () => ring.classList.remove("cursor__ring--down");

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeaveWindow);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeaveWindow);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor__dot" aria-hidden />
      <div ref={ringRef} className="cursor__ring" aria-hidden>
        <span ref={labelRef} className="cursor__label" />
      </div>
    </>
  );
}
