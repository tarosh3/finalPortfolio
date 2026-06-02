"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, assets } from "@/lib/portfolio-data";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const pin = pinRef.current!;
      const mm = gsap.matchMedia();

      // ── DESKTOP: vertical scroll drives horizontal travel ──
      mm.add("(min-width: 1024px)", () => {
        const getScrollAmount = () =>
          Math.max(0, track.scrollWidth - window.innerWidth);

        const horiz = gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => "+=" + getScrollAmount(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // Intro panel: heading words rise from mask
        const introWords = track.querySelectorAll(".projects__intro .word");
        gsap.set(introWords, { yPercent: 120, opacity: 0 });
        gsap.to(introWords, {
          yPercent: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: pin, start: "top 70%" },
        });

        // Cards reveal as they enter the viewport horizontally
        gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
          gsap.fromTo(
            card,
            { y: 80, opacity: 0, scale: 0.9, rotateY: -8 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotateY: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: horiz,
                start: "left 88%",
              },
            }
          );

          const pills = card.querySelectorAll(".tech-pill");
          gsap.fromTo(
            pills,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              stagger: 0.05,
              duration: 0.45,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: card,
                containerAnimation: horiz,
                start: "left 80%",
              },
            }
          );
        });

        // End panel CTA pops in
        gsap.fromTo(
          ".projects__end-inner",
          { scale: 0.85, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: "back.out(1.6)",
            scrollTrigger: {
              trigger: ".projects__end",
              containerAnimation: horiz,
              start: "left 75%",
            },
          }
        );
      });

      // ── MOBILE / TABLET: normal vertical stack ──
      mm.add("(max-width: 1023px)", () => {
        const introWords = track.querySelectorAll(".projects__intro .word");
        gsap.fromTo(
          introWords,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.9,
            ease: "power4.out",
            scrollTrigger: { trigger: ".projects__intro", start: "top 80%" },
          }
        );

        gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
          gsap.fromTo(
            card,
            { y: 60, opacity: 0, scale: 0.94 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 90%" },
            }
          );

          const pills = card.querySelectorAll(".tech-pill");
          gsap.fromTo(
            pills,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              stagger: 0.04,
              duration: 0.4,
              ease: "back.out(2)",
              scrollTrigger: { trigger: card, start: "top 82%" },
            }
          );
        });
      });

      // Floating character + blob (both layouts)
      gsap.to(".projects__character", {
        y: -18,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(".projects__intro-blob", {
        x: -16,
        y: 12,
        rotation: -6,
        duration: 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Pointer-reactive 3D tilt on cards (fine pointers only)
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cards = gsap.utils.toArray<HTMLElement>(".project-card");
    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      gsap.set(card, { transformPerspective: 900, transformOrigin: "center" });
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });

      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * 11);
        rx(-py * 11);
      };
      const onLeave = () => {
        rx(0);
        ry(0);
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="projects">
      <div ref={pinRef} className="projects__pin">
        <div ref={trackRef} className="projects__track">
          {/* Intro panel */}
          <div className="projects__intro">
            <div className="projects__intro-copy">
              <span className="section-eyebrow">Selected Work</span>
              <h2 className="projects__intro-title">
                <span className="word-wrap"><span className="word">Things</span></span>{" "}
                <span className="word-wrap"><span className="word">I&apos;ve</span></span>{" "}
                <span className="word-wrap"><span className="word">built</span></span>{" "}
                <span className="word-wrap"><span className="word accent-word">&amp;&nbsp;shipped.</span></span>
              </h2>
              <p className="projects__intro-sub">
                Six systems running in production — from a marketplace serving
                60K+ merchants to AI agents that close sales.
              </p>
              <span className="projects__intro-hint" aria-hidden>
                Scroll to explore →
              </span>
            </div>
            <div className="projects__character-container">
              <div className="projects__intro-blob" />
              <div className="projects__character">
                <Image
                  src={assets.character.photo}
                  alt="Tarosh Mathuria"
                  width={773}
                  height={1130}
                  className="projects__character-img"
                />
              </div>
            </div>
          </div>

          {/* Project cards */}
          {projects.map((project, i) => (
            <article
              key={project.title}
              className="project-card"
              style={{ "--card-accent": project.color } as React.CSSProperties}
              data-cursor-label="Project"
            >
              <span className="project-card__index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="project-card__body">
                <div className="project-card__top">
                  <span className="project-card__tag">{project.tag}</span>
                  <span className="project-card__highlight">{project.highlight}</span>
                </div>
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__desc">{project.description}</p>
                <div className="project-card__tech">
                  {project.tech.map((t) => (
                    <span key={t} className="tech-pill">{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}

          {/* End / CTA panel */}
          <div className="projects__end">
            <div className="projects__end-inner">
              <span className="projects__end-kicker">That&apos;s the highlight reel.</span>
              <h3 className="projects__end-title">
                Want to see what I&apos;d build for <span className="text-accent">you</span>?
              </h3>
              <a href="#contact" className="btn btn--accent" data-cursor-label="Let's talk">
                <span className="btn__inner">Let&apos;s talk →</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
