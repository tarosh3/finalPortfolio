"use client";

import Image from "next/image";
import { assets, clients, stats } from "@/lib/portfolio-data";
import AppSidebar from "../AppSidebar";

export default function AboutApp() {
  return (
    <div className="os-shell">
      <AppSidebar
        title="About"
        items={[
          { icon: "person", label: "Overview", active: true },
          { icon: "bolt", label: "Highlights" },
          { icon: "school", label: "Education" },
          { icon: "groups", label: "Clients" },
        ]}
        foot={{ initials: "TM", name: "Tarosh Mathuria", role: "Sr. Software Engineer" }}
      />
      <div className="os-main">
        <div className="os-app os-about">
          <div className="os-about__hero">
        <div className="os-about__avatar">
          <Image src={assets.character.final} alt="Tarosh Mathuria" width={420} height={840} priority />
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
      </div>

      <div className="os-about__clients">
        <span className="os-about__clients-label">Trusted by teams at</span>
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
      </div>
        </div>
      </div>
    </div>
  );
}
