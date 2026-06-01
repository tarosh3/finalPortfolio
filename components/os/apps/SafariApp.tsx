"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Sym from "../Sym";
import { assets, clients, experiences, projects, skillCategories, stats } from "@/lib/portfolio-data";

const EMAIL = "taroshmathuria@gmail.com";
const LINKEDIN = "https://linkedin.com/in/tarosh";

const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
];
const SPY = ["about", "skills", "experience", "projects", "contact"];

const TITLE_WORDS = ["Building", "systems", "that", "survive"];

export default function SafariApp() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>("");

  // ── Scroll: progress bar · parallax · scrollspy (rAF-throttled) ──
  useEffect(() => {
    const root = viewportRef.current;
    if (!root) return;
    const bar = progressRef.current;
    const visual = root.querySelector<HTMLElement>(".psite-hero__visual");
    const blobs = Array.from(root.querySelectorAll<HTMLElement>(".psite-blob"));
    const spy = SPY.map((id) => root.querySelector<HTMLElement>(`#psite-${id}`)).filter(Boolean) as HTMLElement[];
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const st = root.scrollTop;
        const max = root.scrollHeight - root.clientHeight;
        if (bar) bar.style.transform = `scaleX(${max > 0 ? st / max : 0})`;
        // parallax via the individual `translate` prop so it composes with CSS transforms
        if (visual) visual.style.translate = `0 ${st * 0.08}px`;
        blobs.forEach((b, i) => { b.style.translate = `0 ${st * (0.05 + i * 0.03)}px`; });
        // scrollspy
        const rootTop = root.getBoundingClientRect().top;
        let cur = "";
        for (const s of spy) {
          if (s.getBoundingClientRect().top - rootTop <= 150) cur = s.id.replace("psite-", "");
        }
        setActive((p) => (p === cur ? p : cur));
      });
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { root.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // ── Count-up stats when they scroll into view ──
  useEffect(() => {
    const root = viewportRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          const end = Number(el.dataset.count) || 0;
          const suffix = el.dataset.suffix || "";
          const dur = 1300;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / dur);
            el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * end) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { root, threshold: 0.6 },
    );
    root.querySelectorAll("[data-count]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ── Reveal-on-scroll for sections ──
  useEffect(() => {
    const root = viewportRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { root, threshold: 0.12 },
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ── 3D tilt on cards (pointer-fine only) ──
  useEffect(() => {
    const root = viewportRef.current;
    if (!root || window.matchMedia("(pointer: coarse)").matches) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-tilt]"));
    const cleanups = cards.map((el) => {
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(820px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg)`;
      };
      const onLeave = () => { el.style.transform = ""; };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); };
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  // ── Hero cursor spotlight ──
  useEffect(() => {
    const hero = viewportRef.current?.querySelector<HTMLElement>(".psite-hero");
    if (!hero || window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      hero.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    hero.addEventListener("pointermove", onMove);
    return () => hero.removeEventListener("pointermove", onMove);
  }, []);

  const go = (id: string) => viewportRef.current?.querySelector(`#psite-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const top = () => viewportRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="os-safari">
      {/* Browser toolbar */}
      <div className="os-safari__bar">
        <div className="os-safari__group">
          <button className="os-safari__btn" onClick={top} aria-label="Back"><Sym name="chevron_left" size={20} /></button>
          <button className="os-safari__btn is-dim" aria-label="Forward" disabled><Sym name="chevron_right" size={20} /></button>
        </div>
        <div className="os-safari__address">
          <Sym name="lock" size={12} className="os-safari__lock" />
          <span className="os-safari__url">tarosh-mathuria.dev</span>
          <button className="os-safari__reload" onClick={top} aria-label="Reload"><Sym name="refresh" size={15} /></button>
        </div>
        <div className="os-safari__group">
          <a className="os-safari__btn" href={`mailto:${EMAIL}`} aria-label="Share"><Sym name="ios_share" size={18} /></a>
          <button className="os-safari__btn" aria-label="New tab"><Sym name="add" size={20} /></button>
        </div>
        <div className="os-safari__progress"><div ref={progressRef} className="os-safari__progress-bar" /></div>
      </div>

      {/* Scrollable site */}
      <div className="os-safari__viewport" ref={viewportRef}>
        <div className="psite">
          <nav className="psite-nav">
            <button className="psite-nav__brand" onClick={top}>
              Tarosh Mathuria<span className="psite-nav__dot">.</span>
            </button>
            <div className="psite-nav__links">
              {NAV.map((n) => (
                <button key={n.id} className={active === n.id ? "is-active" : ""} onClick={() => go(n.id)}>{n.label}</button>
              ))}
            </div>
            <button className="psite-nav__cta" onClick={() => go("contact")}>Get in touch</button>
          </nav>

          {/* ── Hero ── */}
          <header id="psite-home" className="psite-hero">
            <div className="psite-hero__spot" aria-hidden />
            <div className="psite-hero__bg" aria-hidden>
              <span className="psite-blob psite-blob--1" />
              <span className="psite-blob psite-blob--2" />
              <span className="psite-blob psite-blob--3" />
            </div>
            <div className="psite-hero__grid">
              <div className="psite-hero__copy">
                <span className="psite-eyebrow psite-anim" style={{ "--d": "0.05s" } as React.CSSProperties}>Senior Software Engineer</span>
                <h1 className="psite-hero__title">
                  {TITLE_WORDS.map((w, i) => (
                    <span key={i} className="pword" style={{ "--i": i } as React.CSSProperties}>{w}</span>
                  ))}
                  <span className="pword psite-mark" style={{ "--i": TITLE_WORDS.length } as React.CSSProperties}>the real world.</span>
                </h1>
                <p className="psite-hero__sub psite-anim" style={{ "--d": "0.5s" } as React.CSSProperties}>
                  I power <strong>60,000+ merchants</strong> on ONDC with large-scale distributed
                  systems in Go at Magicpin — marketplaces, metro ticketing, and AI-native ordering.
                </p>
                <div className="psite-hero__cta psite-anim" style={{ "--d": "0.62s" } as React.CSSProperties}>
                  <button className="psite-btn psite-btn--accent" onClick={() => go("projects")}>View My Work →</button>
                  <button className="psite-btn psite-btn--ghost" onClick={() => go("contact")}>Get in Touch</button>
                </div>
                <div className="psite-hero__chips psite-anim" style={{ "--d": "0.72s" } as React.CSSProperties}>
                  {["Go", "Kafka", "Kubernetes", "Redis", "ONDC", "MCP", "LLM"].map((t, i) => (
                    <span key={t} className="psite-chip" style={{ "--ci": i } as React.CSSProperties}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="psite-hero__visual">
                <div className="psite-hero__imgwrap">
                  <Image src={assets.character.photo} alt="Tarosh Mathuria" width={773} height={1130} className="psite-hero__img" priority />
                </div>
              </div>
            </div>

            <div className="psite-stats">
              {stats.map((s) => (
                <div key={s.label} className="psite-stat" data-reveal>
                  <span className="psite-stat__v" data-count={s.numericEnd} data-suffix={s.suffix}>0{s.suffix}</span>
                  <span className="psite-stat__l">{s.label}</span>
                </div>
              ))}
            </div>
          </header>

          {/* ── About ── */}
          <section id="psite-about" className="psite-section">
            <span className="psite-eyebrow" data-reveal>About</span>
            <h2 className="psite-h2" data-reveal>I own problems end-to-end.</h2>
            <div className="psite-about">
              <p className="psite-lead" data-reveal>
                4+ years building production backends in Go at Magicpin — from ONDC marketplace
                infrastructure powering 60,000+ merchants to AI-native ordering agents. I take full
                verticals from design to build to keeping them alive under real production load.
              </p>
              <div className="psite-about__panel" data-reveal>
                <div className="psite-about__row"><span className="psite-about__k">Distributed</span><span className="psite-about__v">Kafka pipelines, event-driven services, K8s autoscaling</span></div>
                <div className="psite-about__row"><span className="psite-about__k">Platform</span><span className="psite-about__v">ONDC / Beckn protocol, multi-tenant SaaS, payments &amp; auth</span></div>
                <div className="psite-about__row"><span className="psite-about__k">AI / LLM</span><span className="psite-about__v">MCP servers, multi-turn agent workflows, LLM integration</span></div>
              </div>
            </div>
          </section>

          {/* ── Skills ── */}
          <section id="psite-skills" className="psite-section">
            <span className="psite-eyebrow" data-reveal>Skills</span>
            <h2 className="psite-h2" data-reveal>The stack I reach for.</h2>
            <div className="psite-skills">
              {skillCategories.map((c) => (
                <div key={c.category} className="psite-skill" data-tilt data-reveal style={{ "--c": c.color } as React.CSSProperties}>
                  <div className="psite-skill__head">
                    <span className="psite-skill__dot" />
                    <span className="psite-skill__name">{c.category}</span>
                  </div>
                  <div className="psite-skill__tags">
                    {c.skills.map((s) => <span key={s} className="psite-tag">{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Experience ── */}
          <section id="psite-experience" className="psite-section">
            <span className="psite-eyebrow" data-reveal>Experience</span>
            <h2 className="psite-h2" data-reveal>Where I&apos;ve shipped.</h2>
            <div className="psite-timeline">
              {experiences.map((x) => (
                <div key={x.role + x.company} className="psite-exp" data-reveal>
                  <span className="psite-exp__node" />
                  <div className="psite-exp__top">
                    <span className="psite-exp__role">{x.role}</span>
                    <span className="psite-exp__period">{x.period}</span>
                  </div>
                  <span className="psite-exp__co">
                    {x.company}
                    {x.type === "intern" && <span className="psite-exp__badge">Internship</span>}
                  </span>
                  <ul className="psite-exp__list">
                    {x.highlights.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── Projects ── */}
          <section id="psite-projects" className="psite-section">
            <span className="psite-eyebrow" data-reveal>Projects</span>
            <h2 className="psite-h2" data-reveal>Production systems with measurable bite.</h2>
            <div className="psite-projects">
              {projects.map((p, i) => (
                <article key={p.title} className="psite-project" data-tilt data-reveal style={{ "--c": p.color } as React.CSSProperties}>
                  <div className="psite-project__top">
                    <span className="psite-project__idx">{String(i + 1).padStart(2, "0")}</span>
                    <span className="psite-project__metric">{p.highlight}</span>
                  </div>
                  <span className="psite-tag psite-project__tag">{p.tag}</span>
                  <h3 className="psite-project__title">{p.title}</h3>
                  <p className="psite-project__desc">{p.description}</p>
                  <div className="psite-project__tech">
                    {p.tech.map((t) => <span key={t} className="psite-tag">{t}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── Clients (marquee) ── */}
          <section className="psite-section psite-section--tight">
            <span className="psite-eyebrow" data-reveal>Trusted by teams at</span>
            <div className="psite-marquee" data-reveal>
              <div className="psite-marquee__track">
                {[...clients, ...clients].map((c, i) => (
                  <span key={i} className="psite-client" style={{ "--c": c.color } as React.CSSProperties}>
                    <span className="psite-client__dot" />{c.name}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* ── Contact ── */}
          <section id="psite-contact" className="psite-contact">
            <span className="psite-eyebrow" data-reveal>Contact</span>
            <h2 className="psite-contact__title" data-reveal>Let&apos;s build something that lasts.</h2>
            <p className="psite-contact__sub" data-reveal>
              Open to senior backend &amp; distributed-systems roles — and genuinely interesting problems.
            </p>
            <div className="psite-contact__cta" data-reveal>
              <a className="psite-btn psite-btn--accent" href={`mailto:${EMAIL}`}>{EMAIL} →</a>
              <a className="psite-btn psite-btn--ghost" href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            </div>
            <footer className="psite-foot">
              <span className="psite-foot__brand">Tarosh Mathuria<span className="psite-nav__dot">.</span></span>
              <span>© 2026 · Built in a browser, inside an OS, inside a browser.</span>
            </footer>
          </section>
        </div>
      </div>
    </div>
  );
}
