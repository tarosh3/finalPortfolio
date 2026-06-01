"use client";

import { useId } from "react";
import type { AppId } from "@/lib/os";

// High-fidelity macOS-Sonoma–style app icons, hand-built as full-bleed SVGs.
// The dock container clips to a squircle and adds the outer shadow/gloss, so
// each icon only supplies its own background fill + artwork (viewBox 0 0 56 56).
type Props = { id: AppId; size?: number; className?: string };

export default function AppIcon({ id, size = 52, className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const g = (k: string) => `${id}-${k}-${uid}`;

  const icons: Record<AppId, React.ReactNode> = {
    // ── Safari — blue compass with red/white needle ──────────────
    safari: (
      <>
        <defs>
          <radialGradient id={g("bg")} cx="50%" cy="32%" r="80%">
            <stop offset="0%" stopColor="#e9f3ff" />
            <stop offset="22%" stopColor="#bfe0ff" />
            <stop offset="100%" stopColor="#1b8bff" />
          </radialGradient>
        </defs>
        <rect width="56" height="56" fill={`url(#${g("bg")})`} />
        <circle cx="28" cy="28" r="20.5" fill="#eef6ff" stroke="#b9d6f2" strokeWidth="1.2" />
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i * 6 * Math.PI) / 180;
          const major = i % 5 === 0;
          const r1 = major ? 15.4 : 17.2;
          const r2 = 19;
          return (
            <line
              key={i}
              x1={28 + r1 * Math.cos(a)}
              y1={28 + r1 * Math.sin(a)}
              x2={28 + r2 * Math.cos(a)}
              y2={28 + r2 * Math.sin(a)}
              stroke={major ? "#5b7a99" : "#aebfd0"}
              strokeWidth={major ? 1.4 : 0.8}
            />
          );
        })}
        {/* needle — bold red NE blade, light SW blade */}
        <path d="M28 28 L42 14 L32 26 Z" fill="#ff3b30" />
        <path d="M28 28 L14 42 L24 30 Z" fill="#d7e2ee" />
        <circle cx="28" cy="28" r="2.4" fill="#fff" stroke="#8aa3bb" strokeWidth="1" />
      </>
    ),

    // ── About Me — Contacts-style person card ────────────────────
    about: (
      <>
        <defs>
          <linearGradient id={g("bg")} x1="0" y1="0" x2="0" y2="56">
            <stop offset="0%" stopColor="#fbeede" />
            <stop offset="100%" stopColor="#e7c9a3" />
          </linearGradient>
        </defs>
        <rect width="56" height="56" fill={`url(#${g("bg")})`} />
        <rect x="13" y="11" width="30" height="34" rx="4" fill="#fffdf9" stroke="#d9b98a" strokeWidth="1.2" />
        <circle cx="28" cy="23" r="6" fill="#caa06a" />
        <path d="M17 41 c2-7 9-9 11-9 s9 2 11 9 Z" fill="#caa06a" />
      </>
    ),

    // ── Experience — briefcase ───────────────────────────────────
    experience: (
      <>
        <defs>
          <linearGradient id={g("bg")} x1="0" y1="0" x2="0" y2="56">
            <stop offset="0%" stopColor="#ffe07a" />
            <stop offset="100%" stopColor="#f0a800" />
          </linearGradient>
        </defs>
        <rect width="56" height="56" fill={`url(#${g("bg")})`} />
        <path d="M22 17 v-2 a3 3 0 0 1 3-3 h6 a3 3 0 0 1 3 3 v2" fill="none" stroke="#7a5200" strokeWidth="2.4" strokeLinecap="round" />
        <rect x="12" y="18" width="32" height="24" rx="4" fill="#fff6df" stroke="#a9760a" strokeWidth="1.4" />
        <rect x="12" y="27" width="32" height="3" fill="#a9760a" opacity="0.5" />
        <rect x="25" y="26" width="6" height="5" rx="1.4" fill="#a9760a" />
      </>
    ),

    // ── Skills — Terminal ────────────────────────────────────────
    skills: (
      <>
        <defs>
          <linearGradient id={g("bg")} x1="0" y1="0" x2="0" y2="56">
            <stop offset="0%" stopColor="#3a3a40" />
            <stop offset="100%" stopColor="#161618" />
          </linearGradient>
        </defs>
        <rect width="56" height="56" fill={`url(#${g("bg")})`} />
        <rect x="9" y="12" width="38" height="32" rx="5" fill="#0e0e10" stroke="#2c2c30" strokeWidth="1" />
        <rect x="9" y="12" width="38" height="7" rx="5" fill="#2a2a2e" />
        <path d="M17 28 l5 4 l-5 4" fill="none" stroke="#48e06a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="25" y1="37" x2="34" y2="37" stroke="#e7e7ea" strokeWidth="2.6" strokeLinecap="round" />
      </>
    ),

    // ── Projects — Finder folder ─────────────────────────────────
    projects: (
      <>
        <defs>
          <linearGradient id={g("bg")} x1="0" y1="0" x2="0" y2="56">
            <stop offset="0%" stopColor="#8fd4ff" />
            <stop offset="100%" stopColor="#36a0f5" />
          </linearGradient>
          <linearGradient id={g("front")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bfe6ff" />
            <stop offset="100%" stopColor="#5cb8fb" />
          </linearGradient>
        </defs>
        <rect width="56" height="56" fill={`url(#${g("bg")})`} />
        <path d="M11 19 h12 l3 3 h19 a3 3 0 0 1 3 3 v14 a3 3 0 0 1 -3 3 H11 a3 3 0 0 1 -3 -3 V22 a3 3 0 0 1 3 -3 Z" fill="#2f8fe0" />
        <path d="M8 26 h40 v13 a3 3 0 0 1 -3 3 H11 a3 3 0 0 1 -3 -3 Z" fill={`url(#${g("front")})`} />
      </>
    ),

    // ── Notes — yellow notepad ───────────────────────────────────
    notes: (
      <>
        <defs>
          <linearGradient id={g("bg")} x1="0" y1="0" x2="0" y2="56">
            <stop offset="0%" stopColor="#fff4c2" />
            <stop offset="100%" stopColor="#ffe27a" />
          </linearGradient>
        </defs>
        <rect width="56" height="56" fill={`url(#${g("bg")})`} />
        <rect x="13" y="11" width="30" height="34" rx="4" fill="#fffdf6" stroke="#e6c95a" strokeWidth="1.1" />
        <rect x="13" y="11" width="30" height="8" rx="4" fill="#ffd84a" />
        <g stroke="#d9b84a" strokeWidth="1.6" strokeLinecap="round">
          <line x1="18" y1="26" x2="38" y2="26" />
          <line x1="18" y1="31" x2="38" y2="31" />
          <line x1="18" y1="36" x2="31" y2="36" />
        </g>
      </>
    ),

    // ── Arcade — game controller ─────────────────────────────────
    games: (
      <>
        <defs>
          <linearGradient id={g("bg")} x1="0" y1="0" x2="56" y2="56">
            <stop offset="0%" stopColor="#ff9a4d" />
            <stop offset="100%" stopColor="#ff5b8a" />
          </linearGradient>
        </defs>
        <rect width="56" height="56" fill={`url(#${g("bg")})`} />
        <path d="M19 20 h18 a11 11 0 0 1 11 11 v1 a6 6 0 0 1 -11 3 l-1.5 -2 h-15 l-1.5 2 a6 6 0 0 1 -11 -3 v-1 a11 11 0 0 1 11 -11 Z" fill="#fffdf9" />
        {/* d-pad */}
        <rect x="14" y="29" width="9" height="3" rx="1.5" fill="#ff5b8a" />
        <rect x="17" y="26" width="3" height="9" rx="1.5" fill="#ff5b8a" />
        {/* buttons */}
        <circle cx="37" cy="28" r="2.4" fill="#ff5b8a" />
        <circle cx="42" cy="33" r="2.4" fill="#ff9a4d" />
      </>
    ),

    // ── Mail — envelope ──────────────────────────────────────────
    contact: (
      <>
        <defs>
          <linearGradient id={g("bg")} x1="0" y1="0" x2="0" y2="56">
            <stop offset="0%" stopColor="#5cc6ff" />
            <stop offset="100%" stopColor="#1f7bf0" />
          </linearGradient>
        </defs>
        <rect width="56" height="56" fill={`url(#${g("bg")})`} />
        <rect x="10" y="16" width="36" height="24" rx="4.5" fill="#fffdf9" />
        <path d="M11 19 L28 31 L45 19" fill="none" stroke="#5aa9ee" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      className={className}
      aria-hidden
      style={{ display: "block" }}
    >
      {icons[id]}
    </svg>
  );
}
