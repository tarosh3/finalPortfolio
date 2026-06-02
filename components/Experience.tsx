"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "@/lib/portfolio-data";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section title clip-path reveal
      gsap.fromTo(".experience .section-title",
        { y: 60, opacity: 0, clipPath: "inset(100% 0 0 0)" },
        {
          y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1,
          scrollTrigger: { trigger: ".experience .section-title", start: "top 85%" },
        }
      );

      // Timeline line grows with scroll
      gsap.fromTo(".exp__line-fill",
        { scaleY: 0 },
        {
          scaleY: 1, transformOrigin: "top", ease: "none",
          scrollTrigger: { trigger: ".exp__timeline", start: "top 70%", end: "bottom 30%", scrub: 1 },
        }
      );

      // Each card slides in with stagger and scale
      gsap.utils.toArray<HTMLElement>(".exp__card").forEach((card, i) => {
        gsap.fromTo(card,
          { y: 80, opacity: 0, scale: 0.92, rotate: i % 2 === 0 ? -2 : 2 },
          {
            y: 0, opacity: 1, scale: 1, rotate: 0,
            duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );
      });

      // Dots pop with bounce
      gsap.utils.toArray<HTMLElement>(".exp__dot").forEach((dot) => {
        gsap.fromTo(dot,
          { scale: 0 },
          {
            scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)",
            scrollTrigger: { trigger: dot, start: "top 82%" },
          }
        );
      });

      // Highlight items inside cards animate on scroll
      gsap.utils.toArray<HTMLElement>(".exp__list li").forEach((li) => {
        gsap.fromTo(li,
          { x: -20, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.5,
            scrollTrigger: { trigger: li, start: "top 92%" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="experience">
      <div className="section-container">
        <span className="section-num" aria-hidden>02</span>
        <span className="section-eyebrow">Experience</span>
        <h2 className="section-title">
          Where I&apos;ve <span className="text-accent">built & shipped</span>
        </h2>

        <div className="exp__timeline">
          <div className="exp__line">
            <div className="exp__line-fill" />
          </div>

          {experiences.map((exp, i) => (
            <div key={i} className="exp__item">
              <div className="exp__dot">
                <div className="exp__dot-inner" />
              </div>
              <div className="exp__card">
                <div className="exp__card-top">
                  <span className="exp__period">{exp.period}</span>
                  <span className={`exp__badge ${exp.type === "intern" ? "exp__badge--intern" : ""}`}>
                    {exp.type === "intern" ? "Internship" : "Full-time"}
                  </span>
                </div>
                <h3 className="exp__role">{exp.role}</h3>
                <p className="exp__company">@ {exp.company}</p>
                <ul className="exp__list">
                  {exp.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
