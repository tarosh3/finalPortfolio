// ── Clients ──────────────────────────────────────────────
export type Client = {
  name: string;
  color: string;
  tooltip: string;
  slug?: string; // Simple Icons slug (cdn.simpleicons.org) when a real logo exists
};

export const clients: Client[] = [
  { name: "Tata Digital", color: "#486AAE", tooltip: "NeuCoins, refunds, coupons — full SaaS suite", slug: "tata" },
  { name: "Paytm", color: "#00BAF2", tooltip: "Bulk user onboarding + ONDC buyer integration", slug: "paytm" },
  { name: "Ola", color: "#1C1C1C", tooltip: "OAuth 2.0 integration for ride-hailing SaaS" },
  { name: "PostPe", color: "#1B3C87", tooltip: "AES-256 encrypted payload authentication" },
  { name: "Shiprocket", color: "#7B2D8E", tooltip: "Logistics API for e-commerce fulfillment" },
  { name: "Porter", color: "#2f6fe4", tooltip: "On-demand delivery provider integration" },
  { name: "KFC", color: "#E4002B", tooltip: "Menu sync & ONDC catalog transformation", slug: "kfc" },
  { name: "UrbanPiper", color: "#FF6B00", tooltip: "Food-tech middleware, real-time inventory via Kafka" },
  { name: "Magicpin", color: "#E91E63", tooltip: "Home base — built ONDC platform powering 60K+ merchants" },
];

// ── Stats ────────────────────────────────────────────────
export type Stat = {
  value: string;
  numericEnd: number;
  suffix: string;
  label: string;
};

export const stats: Stat[] = [
  { value: "60K+", numericEnd: 60, suffix: "K+", label: "Merchants Powered" },
  { value: "4+", numericEnd: 4, suffix: "+", label: "Years of Experience" },
  { value: "3K+", numericEnd: 3, suffix: "K+", label: "Daily Transactions" },
  { value: "40%", numericEnd: 40, suffix: "%", label: "Infra Cost Saved" },
];

// ── Skills ───────────────────────────────────────────────
export type SkillCategory = {
  category: string;
  icon: string;
  skills: string[];
  color: string;
};

export const skillCategories: SkillCategory[] = [
  {
    category: "Languages & Backend",
    icon: "⚡",
    skills: ["Go (Primary)", "Python", "C++", "REST APIs", "Protobuf", "Echo v4"],
    color: "#2f6fe4",
  },
  {
    category: "Distributed Systems",
    icon: "🔗",
    skills: ["Kafka", "Microservices", "Beckn/ONDC Protocol", "Event-Driven Architecture", "MCP"],
    color: "#ff0062",
  },
  {
    category: "Databases & Cache",
    icon: "🗄️",
    skills: ["MongoDB", "PostgreSQL", "Redis", "BigQuery", "Aerospike"],
    color: "#00b8d4",
  },
  {
    category: "AI & LLM",
    icon: "🧠",
    skills: ["MCP Server Dev", "Multi-Turn Agent Workflows", "LLM Integration", "WhatsApp AI Agents"],
    color: "#f59e0b",
  },
  {
    category: "Infrastructure & Cloud",
    icon: "☁️",
    skills: ["Kubernetes (HPA/CronJobs)", "Docker", "GCP (GCS/GKE/BigQuery)", "Prometheus", "Bitbucket CI/CD"],
    color: "#ff6b00",
  },
  {
    category: "Auth & Security",
    icon: "🔐",
    skills: ["Ed25519", "AES-256", "JWT", "OAuth 2.0"],
    color: "#16a34a",
  },
];

// ── Experience ───────────────────────────────────────────
export type Experience = {
  role: string;
  company: string;
  period: string;
  type: "full-time" | "intern";
  highlights: string[];
};

export const experiences: Experience[] = [
  {
    role: "Senior Software Engineer II",
    company: "Magicpin",
    period: "Jul 2022 — Present",
    type: "full-time",
    highlights: [
      "Built ONDC Seller App (BPP) from scratch in Go — exposed catalog of 60,000+ merchants to all ONDC buyer apps with full Beckn protocol lifecycle and Ed25519 signature verification",
      "Architected multi-tenant SaaS backend for Tata Digital, Paytm, Ola, PostPe — isolated DB management, client-specific auth (OAuth 2.0, AES-256), NeuCoins, coupons",
      "Built end-to-end metro transit ticketing on ONDC — Dijkstra's shortest-path optimization across multi-line networks (Delhi/Mumbai/Bangalore), QR tickets, Redis distributed locking — ~3,000 txns/day at launch",
      "Re-architected on_search catalog pipeline from single-goroutine to Kafka-driven event system with bounded worker pools (40 workers, 5 merchants/batch across 60K) — eliminated OOM crashes, reduced infra cost 30-40%",
      "Integrated logistics providers (Porter, LoadShare) and powered Rapido's Ownly food delivery with Magicpin's catalog — search, checkout, Kafka catalog updates, real-time rider status",
      "Built production MCP server connectable via Claude — food ordering through AI with login, search, checkout, confirmation, and status tools",
      "Built WhatsApp AI sales agent for merchant acquisition — merchant lookup, competitor analysis, payment links, dynamic banner generation; plus customer-facing agent with lead classification",
    ],
  },
  {
    role: "Software Engineering Intern",
    company: "Magicpin",
    period: "Jan 2022 — Jun 2022",
    type: "intern",
    highlights: [
      "Integrated Shiprocket logistics APIs for end-to-end shipment and order fulfillment workflows",
      "Developed web scraping and crawling pipelines for merchant and competitor data ingestion",
    ],
  },
];

// ── Projects ─────────────────────────────────────────────
export type Project = {
  title: string;
  tag: string;
  description: string;
  tech: string[];
  highlight: string;
  color: string;
};

export const projects: Project[] = [
  {
    title: "ONDC Seller App (BPP)",
    tag: "Core Platform",
    description: "Built Magicpin's ONDC marketplace from scratch — complete Beckn protocol lifecycle powering 60K+ merchants across e-commerce, food, and logistics.",
    tech: ["Go", "Kafka", "MongoDB", "Ed25519", "ONDC/Beckn"],
    highlight: "60,000+ merchants",
    color: "#ffd600",
  },
  {
    title: "Metro Transit Ticketing",
    tag: "ONDC Buyer App",
    description: "End-to-end metro ticketing across Delhi (DMRC), Mumbai, and Bangalore with Dijkstra's shortest-path routing, QR ticket generation, and Redis distributed locking.",
    tech: ["Go", "Redis", "Dijkstra's Algorithm", "QR Generation"],
    highlight: "~3,000 txns/day",
    color: "#ff0062",
  },
  {
    title: "Multi-Tenant SaaS Platform",
    tag: "Enterprise",
    description: "Architected isolated backend for enterprise clients — Tata Digital (NeuCoins), Paytm (bulk onboarding), Ola (OAuth), PostPe (AES-256 auth).",
    tech: ["Go", "MongoDB", "OAuth 2.0", "AES-256", "JWT"],
    highlight: "4 enterprise clients",
    color: "#2f6fe4",
  },
  {
    title: "Kafka Pipeline Re-architecture",
    tag: "Performance",
    description: "Migrated sequential single-goroutine catalog flow to Kafka-driven event system with bounded worker pools, retry logic, and right-sized K8s workloads.",
    tech: ["Go", "Kafka", "Kubernetes", "Prometheus"],
    highlight: "30-40% cost reduction",
    color: "#00b894",
  },
  {
    title: "MCP Server for Claude",
    tag: "AI/LLM",
    description: "Production MCP server enabling food ordering directly through Claude — login, store/item search, checkout, confirmation, and real-time status.",
    tech: ["Go", "MCP Protocol", "Claude", "REST APIs"],
    highlight: "AI-native ordering",
    color: "#ff6b00",
  },
  {
    title: "WhatsApp AI Sales Agent",
    tag: "AI/LLM",
    description: "Dual AI agents — merchant acquisition rep with competitor analysis and payment verification, plus customer-facing agent with lead classification.",
    tech: ["Python", "LLM", "WhatsApp API", "MongoDB"],
    highlight: "Automated acquisition",
    color: "#00b8d4",
  },
];

// ── Navigation ───────────────────────────────────────────
export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Arcade", href: "/games" },
  { label: "Contact", href: "#contact" },
];

// ── Assets (existing) ────────────────────────────────────
export const assets = {
  generated: {
    wallpaper: "/assets/generated/tarosh-os-wallpaper.png",
    projects: "/assets/generated/projects-command-center.png",
    skills: "/assets/generated/skills-systems-panel.png",
    contact: "/assets/generated/contact-mail-network.png",
  },
  character: {
    photo: "/assets/character/Subject.png", // real headshot (cutout)
    hero: "/assets/character/tarosh-hero-transparent.png",
    training: "/assets/character/tarosh-training-transparent.png",
    debugging: "/assets/character/tarosh-debugging-transparent.png",
    final: "/assets/character/tarosh-final-transparent.png",
  },
  scenes: {
    origin: "/assets/scenes/scene-01-origin.webp",
    training: "/assets/scenes/scene-02-training.webp",
    systems: "/assets/scenes/scene-03-systems.webp",
    projects: "/assets/scenes/scene-04-projects.webp",
    battle: "/assets/scenes/scene-05-production-battle.webp",
    victory: "/assets/scenes/scene-06-victory.webp",
    contact: "/assets/scenes/scene-07-contact.webp",
  },
};
