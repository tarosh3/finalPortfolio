"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assets } from "@/lib/portfolio-data";
import { ArrowUpRight, Check, Copy, Linkedin, Mail, Sparkles } from "@/components/Icons";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "taroshmathuria@gmail.com";
const LINKEDIN_URL = "https://linkedin.com/in/tarosh";
const LINKEDIN_LABEL = "linkedin.com/in/tarosh";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".contact__heading",
        { y: 80, opacity: 0, clipPath: "inset(100% 0 0 0)" },
        { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" } }
      );
      gsap.fromTo([".contact__status", ".contact__subtitle"],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1,
          scrollTrigger: { trigger: ".contact__subtitle", start: "top 88%" } }
      );
      gsap.fromTo(".contact__card",
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".contact__cards", start: "top 88%" } }
      );
      gsap.fromTo(".contact__cta",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".contact__cta", start: "top 92%" } }
      );

      gsap.fromTo(".contact__character",
        { x: 80, opacity: 0, scale: 0.8, rotate: 5 },
        { x: 0, opacity: 1, scale: 1, rotate: 0, duration: 1.2,
          scrollTrigger: { trigger: ".contact__character", start: "top 80%" } }
      );
      gsap.fromTo(".contact__blob",
        { scale: 0 },
        { scale: 1, duration: 1.4, ease: "elastic.out(1, 0.5)",
          scrollTrigger: { trigger: ".contact__blob", start: "top 85%" } }
      );
      gsap.to(".contact__character", { y: -16, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(".contact__blob", { x: 12, y: -10, rotation: 6, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="contact">
      <div className="section-container">
        <div className="contact__layout">
          <div className="contact__left">
            <span className="section-eyebrow">Get in Touch</span>
            <h2 className="contact__heading">
              Let&apos;s build something<br />
              <span className="text-accent">extraordinary.</span>
            </h2>

            <div className="contact__status">
              <span className="contact__pulse">
                <span className="contact__pulse-dot" />
              </span>
              Available for select projects &amp; full-time roles
            </div>

            <p className="contact__subtitle">
              Got a production fire, a messy idea, or a system that needs shape? Drop a line —
              I reply within a day.
            </p>

            <div className="contact__cards">
              {/* Email — text mails, button copies (div wrapper keeps markup valid) */}
              <div className="contact__card">
                <span className="contact__card-icon"><Mail size={22} /></span>
                <a href={`mailto:${EMAIL}`} className="contact__card-text" data-cursor-label="Mail">
                  <span className="contact__card-label">Email</span>
                  <span className="contact__card-value">{EMAIL}</span>
                </a>
                <button
                  type="button"
                  className={`contact__copy ${copied ? "contact__copy--done" : ""}`}
                  onClick={copyEmail}
                  aria-label={copied ? "Copied" : "Copy email"}
                  data-cursor-label={copied ? "Copied" : "Copy"}
                >
                  {copied ? <Check size={17} /> : <Copy size={17} />}
                  <span className="contact__copy-text">{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* LinkedIn */}
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="contact__card" data-cursor-label="Open">
                <span className="contact__card-icon"><Linkedin size={22} /></span>
                <span className="contact__card-text">
                  <span className="contact__card-label">LinkedIn</span>
                  <span className="contact__card-value">{LINKEDIN_LABEL}</span>
                </span>
                <span className="contact__card-arrow"><ArrowUpRight size={20} /></span>
              </a>
            </div>

            <a href={`mailto:${EMAIL}`} className="btn btn--accent contact__cta" data-cursor-label="Mail">
              <Sparkles size={18} />
              Start a conversation
            </a>
          </div>

          <div className="contact__right">
            <div className="contact__blob" />
            <div className="contact__character">
              <Image src={assets.character.photo} alt="Tarosh Mathuria" width={773} height={1130} className="contact__character-img" />
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="section-container footer__inner">
          <div className="footer__brand">
            <a href="#hero" className="footer__logo" data-cursor-label="Top">
              <span className="logo-bracket">&lt;</span>TM<span className="logo-bracket">/&gt;</span>
            </a>
            <p className="footer__tagline">
              Backend engineer building systems that survive the real world.
            </p>
          </div>

          <nav className="footer__nav" aria-label="Footer">
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="/games">Arcade</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="footer__socials">
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="footer__social" aria-label="LinkedIn" data-cursor-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href={`mailto:${EMAIL}`} className="footer__social" aria-label="Email" data-cursor-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="section-container footer__bottom">
          <p>© {new Date().getFullYear()} Tarosh Mathuria. Crafted with care.</p>
          <a href="#hero" className="footer__top" data-cursor-label="Top">
            Back to top <span aria-hidden>↑</span>
          </a>
        </div>
      </footer>
    </section>
  );
}
