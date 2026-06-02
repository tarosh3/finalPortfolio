"use client";

import { useEffect, useRef } from "react";

/**
 * Brush-reveal: a `base` image with a `reveal` image painted in only where the
 * cursor brushes, fading out as a trail. Both images must share the SAME pose,
 * framing and aspect ratio so the reveal aligns pixel-for-pixel.
 *
 * If `reveal` fails to load (e.g. the anime render hasn't been added yet) it
 * falls back to a stylized, filtered copy of `base` so the effect still works.
 */
type Props = {
  base: string;
  reveal: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

export default function BrushReveal({ base, reveal, alt, width, height, className = "" }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // brush is a mouse interaction
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Load the reveal layer; fall back to a filtered copy of base ──
    let revealReady = false;
    let useFilter = false;
    const revealImg = new Image();
    const baseImg = new Image();
    const ready = () => { revealReady = true; if (points.length && !raf) raf = requestAnimationFrame(loop); };
    revealImg.onload = ready;
    revealImg.onerror = () => { useFilter = true; baseImg.src = base; };
    baseImg.onload = ready;
    revealImg.src = reveal;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      // size the backing store to the canvas's *displayed* size (CSS stretches
      // it to the wrap via inset:0), so brush coords map 1:1.
      const w = canvas.clientWidth || wrap.clientWidth;
      const h = canvas.clientHeight || wrap.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    type Pt = { x: number; y: number; t: number };
    let points: Pt[] = [];
    let raf = 0;
    const LIFE = 800; // ms a brush dab stays before fading out
    const radius = () => Math.max(56, wrap.clientWidth * 0.16);

    // Draw an image with object-fit: contain to match the <img> beneath.
    const drawContain = (im: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const ir = im.width / im.height;
      const cr = cw / ch;
      let w: number, h: number;
      if (ir > cr) { w = cw; h = cw / ir; } else { h = ch; w = ch * ir; }
      ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const loop = () => {
      const now = performance.now();
      points = points.filter((p) => now - p.t < LIFE);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!points.length) { raf = 0; return; }     // nothing to paint → idle
      if (!revealReady) { raf = requestAnimationFrame(loop); return; } // wait for image

      {
        // 1) paint the reveal image
        ctx.globalCompositeOperation = "source-over";
        if (useFilter) {
          ctx.filter = "saturate(1.9) contrast(1.25) brightness(1.05)";
          drawContain(baseImg);
          ctx.filter = "none";
        } else {
          drawContain(revealImg);
        }
        // 2) keep only the brushed area (soft radial dabs, fading by age)
        ctx.globalCompositeOperation = "destination-in";
        for (const p of points) {
          const age = (now - p.t) / LIFE;
          const a = 1 - age;
          const rad = radius() * dpr * (0.65 + 0.35 * a);
          const px = p.x * dpr;
          const py = p.y * dpr;
          const g = ctx.createRadialGradient(px, py, 0, px, py, rad);
          g.addColorStop(0, `rgba(0,0,0,${(0.95 * a).toFixed(3)})`);
          g.addColorStop(0.65, `rgba(0,0,0,${(0.5 * a).toFixed(3)})`);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(px, py, rad, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
      points.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
      if (!raf) raf = requestAnimationFrame(loop);
    };

    // Listen on window + hit-test the wrap — robust against node remounts.
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [base, reveal]);

  return (
    <div ref={wrapRef} className={`brush-reveal ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={base} alt={alt} width={width} height={height} className="brush-reveal__base" draggable={false} />
      <canvas ref={canvasRef} className="brush-reveal__canvas" aria-hidden />
      <span className="brush-reveal__hint" aria-hidden>Brush over me ✦</span>
    </div>
  );
}
