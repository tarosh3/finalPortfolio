"use client";

import Image from "next/image";
import { assets, projects } from "@/lib/portfolio-data";
import AppSidebar from "../AppSidebar";

export default function ProjectsApp() {
  const featured = projects.slice(0, 3);

  return (
    <div className="os-shell">
      <AppSidebar
        title="Projects"
        items={[
          { icon: "grid_view", label: "All Work", active: true },
          { icon: "bolt", label: "Featured" },
          { icon: "hub", label: "Platform" },
          { icon: "smart_toy", label: "AI & LLM" },
        ]}
        foot={{ initials: "TM", name: "6 shipped", role: "Production systems" }}
      />
      <div className="os-main">
        <div className="os-app os-projects">
          <div className="os-projects__hero">
        <div className="os-projects__visual">
          <Image
            src={assets.generated.projects}
            alt="Abstract command center showing production systems, metro routing, event streams, and AI flows"
            width={1672}
            height={941}
            priority
          />
        </div>
        <div className="os-projects__intro">
          <span className="os-eyebrow">Selected Work</span>
          <h1 className="os-app__title">Production systems with measurable bite</h1>
          <p className="os-projects__lead">
            Marketplace infrastructure, enterprise SaaS, transit routing, AI-native ordering, and cost-saving data pipelines.
          </p>
          <div className="os-projects__metrics">
            <span><b>60K+</b> merchants</span>
            <span><b>3K</b> daily txns</span>
            <span><b>40%</b> infra saved</span>
          </div>
        </div>
      </div>

      <div className="os-projects__featured">
        {featured.map((p) => (
          <div key={p.title} className="os-project-feature" style={{ "--c": p.color } as React.CSSProperties}>
            <span className="os-project-feature__dot" />
            <span className="os-project-feature__title">{p.title}</span>
            <span className="os-project-feature__meta">{p.highlight}</span>
          </div>
        ))}
      </div>

      <div className="os-projects__grid">
        {projects.map((p, i) => (
          <article
            key={p.title}
            className="os-project"
            style={{ "--c": p.color } as React.CSSProperties}
          >
            <div className="os-project__top">
              <span className="os-project__index">{String(i + 1).padStart(2, "0")}</span>
              <span className="os-project__highlight">{p.highlight}</span>
            </div>
            <span className="os-project__tag">{p.tag}</span>
            <h3 className="os-project__title">{p.title}</h3>
            <p className="os-project__desc">{p.description}</p>
            <div className="os-project__tech">
              {p.tech.map((t) => (
                <span key={t} className="os-pill">{t}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
        </div>
      </div>
    </div>
  );
}
