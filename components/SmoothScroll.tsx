"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      lerp: 0.1,
    });

    // Expose for other components (hero parallax, cursor, etc.)
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    // ── Sync Lenis with GSAP ScrollTrigger ──────────────────
    // Drive ScrollTrigger updates off Lenis' scroll loop and run Lenis
    // inside GSAP's ticker so scrub animations stay glued to scroll
    // position (no lag / double-loop jank).
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // ── Scroll-velocity → CSS var (for physics/skew effects) ─
    let raf = 0;
    const root = document.documentElement;
    const onScroll = ({ velocity }: { velocity: number }) => {
      // clamp so a flick doesn't tear the layout
      const clamped = Math.max(-40, Math.min(40, velocity));
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.style.setProperty("--scroll-velocity", clamped.toFixed(2));
        root.style.setProperty("--scroll-skew", (clamped * 0.06).toFixed(3) + "deg");
      });
    };
    lenis.on("scroll", onScroll);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.off("scroll", onScroll);
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  return <>{children}</>;
}
