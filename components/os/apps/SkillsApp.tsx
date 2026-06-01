"use client";

import Image from "next/image";
import { assets, skillCategories } from "@/lib/portfolio-data";
import AppSidebar from "../AppSidebar";

export default function SkillsApp() {
  const core = skillCategories.slice(0, 3);

  return (
    <div className="os-shell">
      <AppSidebar
        title="Settings"
        items={[
          { icon: "code", label: "Languages", active: true },
          { icon: "hub", label: "Distributed" },
          { icon: "database", label: "Data & Cache" },
          { icon: "smart_toy", label: "AI & LLM" },
          { icon: "cloud", label: "Infra & Cloud" },
          { icon: "shield", label: "Security" },
        ]}
      />
      <div className="os-main">
        <div className="os-app os-skills">
          <div className="os-skills__hero">
        <div>
          <span className="os-eyebrow">Skills</span>
          <h1 className="os-app__title">System settings for how I build</h1>
          <p className="os-skills__lead">
            Go-first backend engineering across distributed systems, data stores, cloud workloads, security, and AI agents.
          </p>
        </div>
        <div className="os-skills__visual">
          <Image
            src={assets.generated.skills}
            alt="Abstract systems settings panel showing backend modules and infrastructure"
            width={1672}
            height={941}
          />
        </div>
      </div>

      <div className="os-skills__core">
        {core.map((cat) => (
          <div key={cat.category} className="os-skill-core" style={{ "--c": cat.color } as React.CSSProperties}>
            <span className="os-skill-core__icon">{cat.icon}</span>
            <span>{cat.category}</span>
          </div>
        ))}
      </div>

      <div className="os-skills__grid">
        {skillCategories.map((cat) => (
          <div key={cat.category} className="os-skill-group" style={{ "--c": cat.color } as React.CSSProperties}>
            <div className="os-skill-group__head">
              <span className="os-skill-group__dot" />
              <h3>{cat.category}</h3>
            </div>
            <div className="os-skill-group__pills">
              {cat.skills.map((s) => (
                <span key={s} className="os-pill">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
        </div>
      </div>
    </div>
  );
}
