"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PREVIEWS = [
  { name: "Brick Breaker", tag: "Smash the board" },
  { name: "Snake", tag: "Eat & grow" },
  { name: "Pipe Dash", tag: "Don't crash" },
];

export default function ArcadeSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".arcade-promo .section-title",
        { y: 60, opacity: 0, clipPath: "inset(100% 0 0 0)" },
        { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1,
          scrollTrigger: { trigger: ".arcade-promo .section-title", start: "top 85%" } }
      );
      gsap.fromTo(".arcade-promo__panel",
        { y: 60, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".arcade-promo__panel", start: "top 88%" } }
      );
      gsap.fromTo(".arcade-promo__chip",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "back.out(2)",
          scrollTrigger: { trigger: ".arcade-promo__chips", start: "top 90%" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="game" ref={sectionRef} className="arcade-promo">
      <div className="section-container">
        <span className="section-eyebrow">Take a break</span>
        <h2 className="section-title">
          I built an <span className="text-accent">arcade</span>, not just a résumé
        </h2>

        <div className="arcade-promo__panel">
          <div className="arcade-promo__copy">
            <p className="arcade-promo__lead">
              Three games, hand-coded on raw canvas — no engines, no libraries. Every one
              gets harder the longer you survive, and starts tougher each time you replay.
            </p>
            <div className="arcade-promo__chips">
              {PREVIEWS.map((p) => (
                <span key={p.name} className="arcade-promo__chip">
                  <strong>{p.name}</strong>
                  <em>{p.tag}</em>
                </span>
              ))}
            </div>
            <Link href="/games" className="btn btn--accent arcade-promo__cta" data-cursor-label="Play">
              Enter the Arcade →
            </Link>
          </div>

          <div className="arcade-promo__visual" aria-hidden>
            <svg viewBox="0 0 220 200" className="arcade-promo__art">
              {[0, 1, 2, 3].map((r) =>
                [0, 1, 2, 3, 4, 5].map((c) => (
                  <rect key={`${r}-${c}`} x={14 + c * 33} y={18 + r * 18} width="28" height="12" rx="3"
                    fill={["#ffd600", "#ff0062", "#2f6fe4", "#00b894"][(r + c) % 4]} opacity={0.92} />
                ))
              )}
              <rect x="86" y="176" width="50" height="9" rx="4" fill="var(--accent)" />
              <circle cx="111" cy="150" r="7" fill="var(--accent)" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
