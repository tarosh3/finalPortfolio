"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getHighScore } from "@/lib/arcade";

const BrickBreaker = dynamic(() => import("@/components/games/BrickBreaker"), { ssr: false });
const SnakeGame = dynamic(() => import("@/components/games/SnakeGame"), { ssr: false });
const PipeDash = dynamic(() => import("@/components/games/PipeDash"), { ssr: false });

type GameId = "breaker" | "snake" | "pipe";

const GAMES: { id: GameId; name: string; tag: string; desc: string; Comp: React.ComponentType }[] = [
  { id: "breaker", name: "Brick Breaker", tag: "Clear the board", desc: "Ball accelerates the longer you last.", Comp: BrickBreaker },
  { id: "snake", name: "Snake", tag: "Eat & grow", desc: "Walls are lethal. Faster every bite.", Comp: SnakeGame },
  { id: "pipe", name: "Pipe Dash", tag: "Don't crash", desc: "Gaps tighten as you score.", Comp: PipeDash },
];

function Best({ id }: { id: GameId }) {
  const [best, setBest] = useState<number | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setBest(getHighScore(id)), 0);
    return () => window.clearTimeout(timer);
  }, [id]);
  return <span className="os-game-card__best">{best ? `Best ${best}` : "New"}</span>;
}

export default function GamesApp() {
  const [active, setActive] = useState<GameId | null>(null);
  const game = GAMES.find((g) => g.id === active);

  if (game) {
    return (
      <div className="os-app os-games os-games--play">
        <button className="os-games__back" onClick={() => setActive(null)}>← All games</button>
        <game.Comp />
      </div>
    );
  }

  return (
    <div className="os-app os-games">
      <span className="os-eyebrow">Arcade</span>
      <h1 className="os-app__title">Three games. Each one fights back.</h1>
      <p className="os-games__lead">Hand-built on raw canvas. Difficulty climbs the longer you survive — and every replay starts tougher.</p>

      <div className="os-games__grid">
        {GAMES.map((g) => (
          <button key={g.id} className="os-game-card" onClick={() => setActive(g.id)}>
            <div className="os-game-card__top">
              <span className="os-game-card__tag">{g.tag}</span>
              <Best id={g.id} />
            </div>
            <h3 className="os-game-card__name">{g.name}</h3>
            <p className="os-game-card__desc">{g.desc}</p>
            <span className="os-game-card__play">Play →</span>
          </button>
        ))}
      </div>
    </div>
  );
}
