"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clients } from "@/lib/portfolio-data";

gsap.registerPlugin(ScrollTrigger);

export default function Clients() {
  const sectionRef = useRef<HTMLElement>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  // Split into two rows
  const row1 = clients.slice(0, 5);
  const row2 = clients.slice(5);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".clients__title", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (e: React.MouseEvent, text: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ text, x: rect.left + rect.width / 2, y: rect.top - 12 });
  };

  const handleMouseLeave = () => setTooltip(null);

  const renderItem = (client: typeof clients[0], key: string) => (
    <div
      key={key}
      className="marquee__item"
      onMouseEnter={(e) => handleMouseEnter(e, client.tooltip)}
      onMouseLeave={handleMouseLeave}
    >
      {client.slug ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="marquee__logo"
            src={`https://cdn.simpleicons.org/${client.slug}`}
            alt={`${client.name} logo`}
            width={26}
            height={26}
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              img.style.display = "none";
              const fb = img.nextElementSibling as HTMLElement | null;
              if (fb) fb.style.display = "grid";
            }}
          />
          <span className="marquee__mono" style={{ backgroundColor: client.color, display: "none" }}>
            {client.name[0]}
          </span>
        </>
      ) : (
        <span className="marquee__mono" style={{ backgroundColor: client.color }}>
          {client.name[0]}
        </span>
      )}
      <span className="marquee__name">{client.name}</span>
    </div>
  );

  return (
    <section id="clients" ref={sectionRef} className="clients">
      <div className="section-container">
        <div className="section-label">
          <span className="section-label__line" />
          <span>Trusted By</span>
        </div>

        <h2 className="clients__title section-title">
          Built systems for <span className="text-gradient">industry leaders</span>
        </h2>
      </div>

      {/* Marquee Row 1 → */}
      <div className="marquee-wrap">
        <div className="marquee marquee--forward">
          {[...row1, ...row1, ...row1, ...row1].map((client, i) =>
            renderItem(client, `r1-${i}`)
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="marquee-divider" />

      {/* Marquee Row 2 ← */}
      <div className="marquee-wrap">
        <div className="marquee marquee--reverse">
          {[...row2, ...row2, ...row2, ...row2, ...row2].map((client, i) =>
            renderItem(client, `r2-${i}`)
          )}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="marquee-tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </section>
  );
}
