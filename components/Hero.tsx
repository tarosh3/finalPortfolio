"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assets } from "@/lib/portfolio-data";
import { useMagnetic } from "@/lib/useMagnetic";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const primaryRef = useMagnetic<HTMLAnchorElement>(0.4);
  const secondaryRef = useMagnetic<HTMLAnchorElement>(0.4);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Title — each word rises from behind a mask
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll(".word");
        tl.set(words, { yPercent: 120, opacity: 0, rotateX: -55 });
        tl.to(words, {
          yPercent: 0, opacity: 1, rotateX: 0,
          stagger: 0.08, duration: 1.1,
        }, 0.25);
      }

      tl.fromTo(".hero__subtitle",
        { y: 40, opacity: 0, clipPath: "inset(100% 0 0 0)" },
        { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 0.9 },
        "-=0.55"
      );

      tl.fromTo(".hero__actions .btn",
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.12, duration: 0.7, ease: "back.out(1.5)" },
        "-=0.5"
      );

      tl.fromTo(".hero__tag",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.06, duration: 0.5, ease: "back.out(2.5)" },
        "-=0.4"
      );

      tl.fromTo(imageRef.current,
        { x: 150, opacity: 0, scale: 0.7, rotate: 8 },
        { x: 0, opacity: 1, scale: 1, rotate: 0, duration: 1.4, ease: "power3.out" },
        "-=1.2"
      );

      tl.fromTo(".hero__blob",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.15, duration: 1.2, ease: "elastic.out(1, 0.6)" },
        "-=1"
      );

      // Continuous floating (transform — composes with CSS translate parallax)
      gsap.to(imageRef.current, {
        y: -22, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1,
      });
      gsap.to(".hero__blob--1", {
        x: 20, y: -15, rotation: 10, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1,
      });
      gsap.to(".hero__blob--2", {
        x: -18, y: 20, rotation: -8, duration: 5.5, ease: "sine.inOut", yoyo: true, repeat: -1,
      });

      // PARALLAX on scroll
      gsap.to(".hero__content", {
        y: -120, opacity: 0.3,
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
      });
      gsap.to(".hero__visual", {
        y: -60, scale: 0.9,
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
      });
      gsap.to(".hero__scroll", {
        opacity: 0, y: 20,
        scrollTrigger: { trigger: sectionRef.current, start: "5% top", end: "15% top", scrub: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cursor-reactive parallax — sets --mx/--my (-1..1) on the section.
  // Consumed via CSS `translate` so it layers on top of GSAP transforms.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const mx = (e.clientX - cx) / cx;
      const my = (e.clientY - cy) / cy;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        section.style.setProperty("--mx", mx.toFixed(3));
        section.style.setProperty("--my", my.toFixed(3));
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <h1 ref={titleRef} className="hero__title">
            <span className="word-wrap"><span className="word">Building</span></span>{" "}
            <span className="word-wrap"><span className="word">systems</span></span>{" "}
            <span className="word-wrap"><span className="word">that</span></span>{" "}
            <span className="word-wrap"><span className="word">survive</span></span>{" "}
            <span className="word-wrap"><span className="word accent-word">the&nbsp;real</span></span>{" "}
            <span className="word-wrap"><span className="word accent-word">world.</span></span>
          </h1>

          <p className="hero__subtitle">
            Senior Software Engineer powering <strong>60,000+ merchants</strong> on
            ONDC with large-scale distributed systems in Go at Magicpin.
          </p>

          <div className="hero__actions">
            <a ref={primaryRef} href="#projects" className="btn btn--accent" data-cursor-label="View">
              <span className="btn__inner">View My Work →</span>
            </a>
            <a ref={secondaryRef} href="#contact" className="btn btn--outline" data-cursor-label="Say hi">
              <span className="btn__inner">Get in Touch</span>
            </a>
          </div>

          <div className="hero__tags">
            {["Go", "Kafka", "Kubernetes", "Redis", "ONDC", "MCP", "LLM"].map((tag) => (
              <span key={tag} className="hero__tag">{tag}</span>
            ))}
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__blob hero__blob--1" />
          <div className="hero__blob hero__blob--2" />
          <div ref={imageRef} className="hero__image-wrap">
            <Image
              src={assets.character.hero}
              alt="Tarosh Mathuria"
              width={923}
              height={1704}
              className="hero__image"
              priority
            />
          </div>
        </div>
      </div>

      <div className="hero__scroll">
        <span className="hero__scroll-text">Scroll to explore</span>
        <div className="hero__scroll-line">
          <div className="hero__scroll-dot" />
        </div>
      </div>
    </section>
  );
}
