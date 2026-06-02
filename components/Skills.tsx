"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillCategories } from "@/lib/portfolio-data";

gsap.registerPlugin(ScrollTrigger);

// Monoline icons keyed by category — no emoji (inline SVG, inherits color).
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function CategoryIcon({ category }: { category: string }) {
  switch (category) {
    case "Languages & Backend":
      return (
        <svg {...iconProps} aria-hidden>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case "Distributed Systems":
      return (
        <svg {...iconProps} aria-hidden>
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
          <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
        </svg>
      );
    case "Databases & Cache":
      return (
        <svg {...iconProps} aria-hidden>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      );
    case "AI & LLM":
      return (
        <svg {...iconProps} aria-hidden>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
        </svg>
      );
    case "Infrastructure & Cloud":
      return (
        <svg {...iconProps} aria-hidden>
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        </svg>
      );
    case "Auth & Security":
      return (
        <svg {...iconProps} aria-hidden>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps} aria-hidden>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title
      gsap.fromTo(".skills .section-title",
        { y: 60, opacity: 0, clipPath: "inset(100% 0 0 0)" },
        {
          y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1,
          scrollTrigger: { trigger: ".skills .section-title", start: "top 85%" },
        }
      );

      // Skill groups cascade in with 3D rotation
      gsap.utils.toArray<HTMLElement>(".skill-group").forEach((group, i) => {
        gsap.fromTo(group,
          { y: 60, opacity: 0, scale: 0.88, rotateY: i % 2 === 0 ? -10 : 10 },
          {
            y: 0, opacity: 1, scale: 1, rotateY: 0,
            duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 90%" },
          }
        );
      });

      // Skill pills pop in with elastic bounce per group
      gsap.utils.toArray<HTMLElement>(".skill-group").forEach((group) => {
        const pills = group.querySelectorAll(".skill-pill");
        gsap.fromTo(pills,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1,
            stagger: 0.04, duration: 0.5, ease: "back.out(3)",
            scrollTrigger: { trigger: group, start: "top 85%" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="skills">
      <div className="section-container">
        <span className="section-num" aria-hidden>03</span>
        <span className="section-eyebrow">Skills</span>
        <h2 className="section-title">
          My <span className="text-accent">tech arsenal</span>
        </h2>

        <div className="skills__grid">
          {skillCategories.map((cat) => (
            <div
              key={cat.category}
              className="skill-group"
              style={{ "--skill-color": cat.color } as React.CSSProperties}
            >
              <div className="skill-group__header">
                <span className="skill-group__icon">
                  <CategoryIcon category={cat.category} />
                </span>
                <h3>{cat.category}</h3>
              </div>
              <div className="skill-group__pills">
                {cat.skills.map((skill) => (
                  <span key={skill} className="skill-pill">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
