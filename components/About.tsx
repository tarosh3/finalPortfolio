"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stats, assets } from "@/lib/portfolio-data";

gsap.registerPlugin(ScrollTrigger);

function AnimatedCounter({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: end,
        duration: 2.5,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
        onUpdate: () => { if (el) el.textContent = Math.round(obj.val) + suffix; },
      });
    });
    return () => ctx.revert();
  }, [end, suffix]);

  return (
    <div className="stat-card">
      <span ref={numRef} className="stat-card__value">0{suffix}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Character slides in from left with rotation
      gsap.fromTo(".about__character-wrap",
        { x: -100, opacity: 0, rotate: -5 },
        {
          x: 0, opacity: 1, rotate: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: ".about__character-container", start: "top 80%" },
        }
      );

      // Blob scales in with bounce
      gsap.fromTo(".about__blob",
        { scale: 0 },
        {
          scale: 1, duration: 1.4, ease: "elastic.out(1, 0.5)",
          scrollTrigger: { trigger: ".about__character-container", start: "top 80%" },
        }
      );

      // Heading lines reveal with clip-path
      gsap.fromTo(".about__heading h2",
        { y: 60, opacity: 0, clipPath: "inset(100% 0 0 0)" },
        {
          y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)",
          stagger: 0.15, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".about__heading", start: "top 80%" },
        }
      );

      // Description fades in
      gsap.fromTo(".about__desc",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          scrollTrigger: { trigger: ".about__desc", start: "top 85%" },
        }
      );

      // Stats pop in with scale + stagger
      gsap.fromTo(".stat-card",
        { y: 50, opacity: 0, scale: 0.85 },
        {
          y: 0, opacity: 1, scale: 1,
          stagger: 0.1, duration: 0.7, ease: "back.out(1.5)",
          scrollTrigger: { trigger: ".about__stats", start: "top 88%" },
        }
      );

      // Float character
      gsap.to(".about__character-wrap", {
        y: -16, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1,
      });

      // Blob drift
      gsap.to(".about__blob", {
        x: 12, y: -10, rotation: 5, duration: 4.5, ease: "sine.inOut", yoyo: true, repeat: -1,
      });

      // Parallax — whole section subtle shift
      gsap.to(".about__left", {
        y: -40,
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about">
      <div className="section-container">
        <div className="about__layout">
          <div className="about__left">
            <div className="about__character-container">
              <div className="about__blob" />
              <div className="about__character-wrap">
                <Image
                  src={assets.character.training}
                  alt="Tarosh at work"
                  width={941}
                  height={1672}
                  className="about__character"
                />
              </div>
            </div>
          </div>

          <div className="about__right">
            <span className="section-eyebrow">About Me</span>
            <div className="about__heading">
              <h2>I turn messy problems into</h2>
              <h2><span className="text-accent">reliable systems</span> at scale.</h2>
            </div>
            <p className="about__desc">
              4+ years building production platforms in Go at Magicpin. From ONDC marketplace
              infrastructure to AI-powered sales agents — I own full product verticals end-to-end.
              B.Tech from Delhi Technological University. Published researcher in computer vision.
            </p>
            <div className="about__stats">
              {stats.map((stat) => (
                <AnimatedCounter key={stat.label} end={stat.numericEnd} suffix={stat.suffix} label={stat.label} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
