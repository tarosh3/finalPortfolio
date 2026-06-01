"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { getHighScore } from "@/lib/arcade";

const BrickBreaker = dynamic(() => import("@/components/games/BrickBreaker"), { ssr: false });
const SnakeGame = dynamic(() => import("@/components/games/SnakeGame"), { ssr: false });
const PipeDash = dynamic(() => import("@/components/games/PipeDash"), { ssr: false });

type GameId = "breaker" | "snake" | "pipe";

const GAMES: {
  id: GameId;
  name: string;
  tag: string;
  desc: string;
  control: string;
  Comp: React.ComponentType;
}[] = [
  { id: "breaker", name: "Brick Breaker", tag: "Clear the board", desc: "Bounce, smash, survive. The ball accelerates the longer you last.", control: "Mouse / touch", Comp: BrickBreaker },
  { id: "snake", name: "Snake", tag: "Eat & grow", desc: "Classic snake — walls are lethal. Faster with every bite.", control: "Arrows / swipe", Comp: SnakeGame },
  { id: "pipe", name: "Pipe Dash", tag: "Don't crash", desc: "One-tap flight. Gaps tighten and speed climbs as you score.", control: "Tap / space", Comp: PipeDash },
];

function Thumb({ id }: { id: GameId }) {
  if (id === "breaker") {
    return (
      <svg className="arcade-card__art" viewBox="0 0 200 120" aria-hidden>
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3, 4, 5].map((c) => (
            <rect key={`${r}-${c}`} x={16 + c * 30} y={16 + r * 16} width="26" height="11" rx="3"
              fill={["#ffd600", "#ff0062", "#2f6fe4"][(r + c) % 3]} opacity={0.9} />
          ))
        )}
        <rect x="78" y="100" width="44" height="8" rx="4" fill="var(--accent)" />
        <circle cx="100" cy="82" r="6" fill="var(--accent)" />
      </svg>
    );
  }
  if (id === "snake") {
    return (
      <svg className="arcade-card__art" viewBox="0 0 200 120" aria-hidden>
        <g fill="var(--text)">
          <rect x="40" y="40" width="14" height="14" rx="4" />
          <rect x="56" y="40" width="14" height="14" rx="4" opacity="0.8" />
          <rect x="72" y="40" width="14" height="14" rx="4" opacity="0.65" />
          <rect x="72" y="56" width="14" height="14" rx="4" opacity="0.5" />
          <rect x="88" y="56" width="14" height="14" rx="4" opacity="0.4" />
        </g>
        <circle cx="150" cy="63" r="8" fill="var(--accent)" />
      </svg>
    );
  }
  return (
    <svg className="arcade-card__art" viewBox="0 0 200 120" aria-hidden>
      <rect x="120" y="0" width="34" height="40" rx="5" fill="var(--text)" />
      <rect x="120" y="78" width="34" height="42" rx="5" fill="var(--text)" />
      <rect x="117" y="34" width="40" height="9" rx="3" fill="var(--accent)" />
      <rect x="117" y="78" width="40" height="9" rx="3" fill="var(--accent)" />
      <circle cx="64" cy="60" r="13" fill="var(--accent)" />
      <circle cx="69" cy="56" r="3" fill="#fff" />
    </svg>
  );
}

function CardScore({ id }: { id: GameId }) {
  const [best, setBest] = useState<number | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setBest(getHighScore(id)), 0);
    return () => window.clearTimeout(timer);
  }, [id]);
  return <span className="arcade-card__best">{best ? `Best ${best}` : "New"}</span>;
}

export default function GamesPage() {
  const [active, setActive] = useState<GameId | null>(null);
  const game = GAMES.find((g) => g.id === active);

  return (
    <main className="arcade">
      <ThemeSwitcher />
      <header className="arcade__bar">
        <Link href="/" className="arcade__back" data-cursor-label="Home">
          <span className="arcade__back-arrow">←</span> Tarosh Mathuria
        </Link>
        <span className="arcade__brand">
          <span className="logo-bracket">&lt;</span>Arcade<span className="logo-bracket">/&gt;</span>
        </span>
      </header>

      {!game ? (
        <section className="arcade__hub">
          <span className="section-eyebrow">Take a break</span>
          <h1 className="arcade__title">
            Enter the <span className="text-accent">arcade</span>
          </h1>
          <p className="arcade__lead">
            Three hand-built games, no libraries. Each one ramps up the longer you survive —
            and starts tougher every time you replay. Think you can top your best?
          </p>

          <div className="arcade__grid">
            {GAMES.map((g) => (
              <button key={g.id} className="arcade-card" onClick={() => setActive(g.id)} data-cursor-label="Play">
                <div className="arcade-card__thumb">
                  <Thumb id={g.id} />
                  <CardScore id={g.id} />
                </div>
                <div className="arcade-card__body">
                  <span className="arcade-card__tag">{g.tag}</span>
                  <h3 className="arcade-card__name">{g.name}</h3>
                  <p className="arcade-card__desc">{g.desc}</p>
                  <div className="arcade-card__meta">
                    <span className="arcade-card__control">{g.control}</span>
                    <span className="arcade-card__play">Play →</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="arcade__play">
          <button className="arcade__exit" onClick={() => setActive(null)} data-cursor-label="Back">
            ← All games
          </button>
          <h2 className="arcade__play-title">{game.name}</h2>
          <game.Comp />
        </section>
      )}
    </main>
  );
}
