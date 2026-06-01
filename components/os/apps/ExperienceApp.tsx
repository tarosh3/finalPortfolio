"use client";

import { experiences } from "@/lib/portfolio-data";

export default function ExperienceApp() {
  return (
    <div className="os-app os-exp">
      <span className="os-eyebrow">Experience</span>
      <h1 className="os-app__title">Where I&apos;ve built &amp; shipped</h1>

      <div className="os-exp__timeline">
        {experiences.map((exp, i) => (
          <div key={i} className="os-exp__item">
            <div className="os-exp__dot" />
            <div className="os-exp__card">
              <div className="os-exp__top">
                <span className="os-exp__period">{exp.period}</span>
                <span className={`os-exp__badge ${exp.type === "intern" ? "is-intern" : ""}`}>
                  {exp.type === "intern" ? "Internship" : "Full-time"}
                </span>
              </div>
              <h3 className="os-exp__role">{exp.role}</h3>
              <p className="os-exp__company">@ {exp.company}</p>
              <ul className="os-exp__list">
                {exp.highlights.map((h, j) => (
                  <li key={j}>{h}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
