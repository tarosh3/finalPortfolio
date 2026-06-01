import MacDesktop from "@/components/os/MacDesktop";
import { experiences, projects, skillCategories } from "@/lib/portfolio-data";

export default function Home() {
  return (
    <>
      {/* Server-rendered content layer — gives search engines and non-JS social
          crawlers real, indexable text for the client-rendered desktop UI below. */}
      <main className="sr-only">
        <h1>Tarosh Mathuria — Senior Software Engineer</h1>
        <p>
          Senior Software Engineer II at Magicpin building large-scale distributed backend
          systems in Go. Built Magicpin&apos;s ONDC Seller App (BPP) from scratch — powering
          60,000+ merchants across e-commerce, food, and logistics using the Beckn protocol,
          Apache Kafka, MongoDB, and Ed25519 signature verification. Delhi Technological
          University graduate with 4+ years of experience in distributed systems, microservices,
          and cloud infrastructure.
        </p>

        <h2>Experience</h2>
        {experiences.map((exp) => (
          <section key={`${exp.company}-${exp.role}`}>
            <h3>
              {exp.role} — {exp.company} ({exp.period})
            </h3>
            <ul>
              {exp.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </section>
        ))}

        <h2>Featured Projects</h2>
        {projects.map((p) => (
          <section key={p.title}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <p>Tech: {p.tech.join(", ")}.</p>
          </section>
        ))}

        <h2>Skills</h2>
        {skillCategories.map((cat) => (
          <section key={cat.category}>
            <h3>{cat.category}</h3>
            <p>{cat.skills.join(", ")}.</p>
          </section>
        ))}

        <h2>Contact</h2>
        <p>
          Email: <a href="mailto:taroshmathuria@gmail.com">taroshmathuria@gmail.com</a>. LinkedIn:{" "}
          <a href="https://linkedin.com/in/tarosh">linkedin.com/in/tarosh</a>.
        </p>
      </main>

      <MacDesktop />
    </>
  );
}
