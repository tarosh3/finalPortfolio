"use client";

import { useState } from "react";
import Image from "next/image";
import { assets, clients, stats } from "@/lib/portfolio-data";
import AppSidebar from "../AppSidebar";
import Sym from "../Sym";

type Tab = "overview" | "highlights" | "education" | "clients";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "person" },
  { id: "highlights", label: "Highlights", icon: "bolt" },
  { id: "education", label: "Education", icon: "school" },
  { id: "clients", label: "Clients", icon: "groups" },
];

const HIGHLIGHTS: { icon: string; title: string; desc: string }[] = [
  { icon: "hub", title: "ONDC Seller App (BPP)", desc: "Built Magicpin's ONDC marketplace from scratch in Go — full Beckn lifecycle with Ed25519 signing, exposing 60,000+ merchants to every buyer app." },
  { icon: "train", title: "Metro Transit Ticketing", desc: "End-to-end metro ticketing across Delhi, Mumbai & Bangalore — Dijkstra shortest-path routing, QR tickets, Redis locking. ~3,000 txns/day at launch." },
  { icon: "bolt", title: "Kafka Re-architecture", desc: "Migrated the catalog pipeline from a single goroutine to a Kafka-driven worker-pool system — killed OOM crashes and cut infra cost 30–40%." },
  { icon: "apartment", title: "Multi-tenant SaaS", desc: "Architected isolated backends for Tata Digital, Paytm, Ola & PostPe — client-specific auth (OAuth 2.0, AES-256), NeuCoins, coupons." },
  { icon: "smart_toy", title: "MCP Server for Claude", desc: "Production MCP server enabling food ordering directly through Claude — login, search, checkout, confirmation and live status as tools." },
  { icon: "chat", title: "WhatsApp AI Sales Agent", desc: "Dual AI agents for merchant acquisition and customer support — competitor analysis, payment links, lead classification." },
];

const EDUCATION: { icon: string; title: string; org: string; meta: string; desc: string }[] = [
  { icon: "school", title: "B.Tech, Computer Engineering", org: "Delhi Technological University (DTU)", meta: "Delhi, India", desc: "One of India's top engineering schools. Built the systems foundation — algorithms, networks, and distributed computing — I ship on daily." },
  { icon: "science", title: "Published Researcher", org: "Computer Vision", meta: "Peer-reviewed", desc: "Authored published research in computer vision, applying deep-learning models to real-world image understanding problems." },
];

export default function AboutApp() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="os-shell">
      <AppSidebar
        title="About"
        items={TABS.map((t) => ({
          icon: t.icon,
          label: t.label,
          active: tab === t.id,
          onClick: () => setTab(t.id),
        }))}
        foot={{ initials: "TM", name: "Tarosh Mathuria", role: "Sr. Software Engineer" }}
      />

      <div className="os-main">
        <div className="os-app os-about">
          {/* ── Overview ── */}
          {tab === "overview" && (
            <section className="os-about__hero">
              <div className="os-about__avatar">
                <Image src={assets.character.photo} alt="Tarosh Mathuria" width={773} height={1130} priority />
              </div>
              <div className="os-about__intro">
                <span className="os-eyebrow">About Me</span>
                <h1 className="os-about__name">Tarosh Mathuria</h1>
                <p className="os-about__role">Senior Software Engineer · Go &amp; Distributed Systems</p>
                <p className="os-about__bio">
                  4+ years building production platforms in Go at Magicpin — from ONDC marketplace
                  infrastructure powering 60,000+ merchants to AI-native sales agents. I own full
                  product verticals end-to-end. B.Tech, Delhi Technological University. Published
                  researcher in computer vision.
                </p>
                <div className="os-about__stats">
                  {stats.map((s) => (
                    <div key={s.label} className="os-stat">
                      <b className="os-stat__value">{s.value}</b>
                      <span className="os-stat__label">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Highlights ── */}
          {tab === "highlights" && (
            <section>
              <span className="os-eyebrow">Highlights</span>
              <h1 className="os-about__name">What I&apos;ve shipped</h1>
              <p className="os-about__bio">Selected production work — the systems behind the numbers.</p>
              <div className="os-about__hlgrid">
                {HIGHLIGHTS.map((h) => (
                  <div key={h.title} className="os-hl">
                    <span className="os-hl__icon"><Sym name={h.icon} size={22} fill /></span>
                    <div className="os-hl__body">
                      <b className="os-hl__title">{h.title}</b>
                      <p className="os-hl__desc">{h.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Education ── */}
          {tab === "education" && (
            <section>
              <span className="os-eyebrow">Education</span>
              <h1 className="os-about__name">Where it started</h1>
              <p className="os-about__bio">Foundations in computer engineering and applied research.</p>
              <div className="os-about__edugrid">
                {EDUCATION.map((e) => (
                  <div key={e.title} className="os-edu">
                    <span className="os-edu__icon"><Sym name={e.icon} size={24} fill /></span>
                    <div className="os-edu__body">
                      <b className="os-edu__title">{e.title}</b>
                      <span className="os-edu__org">{e.org}</span>
                      <span className="os-edu__meta">{e.meta}</span>
                      <p className="os-edu__desc">{e.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Clients ── */}
          {tab === "clients" && (
            <section>
              <span className="os-eyebrow">Clients</span>
              <h1 className="os-about__name">Trusted by teams at</h1>
              <p className="os-about__bio">Platforms and brands I&apos;ve built integrations and infrastructure for.</p>
              <div className="os-about__logos">
                {clients.map((c) => (
                  <span key={c.name} className="os-logo" title={c.tooltip}>
                    {c.slug ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="os-logo__img"
                        src={`https://cdn.simpleicons.org/${c.slug}`}
                        alt={`${c.name} logo`}
                        width={20}
                        height={20}
                        loading="lazy"
                        onError={(e) => {
                          const img = e.currentTarget;
                          img.style.display = "none";
                          const fb = img.nextElementSibling as HTMLElement | null;
                          if (fb) fb.style.display = "grid";
                        }}
                      />
                    ) : null}
                    <span
                      className="os-logo__mono"
                      style={{ background: c.color, display: c.slug ? "none" : "grid" }}
                    >
                      {c.name[0]}
                    </span>
                    {c.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
