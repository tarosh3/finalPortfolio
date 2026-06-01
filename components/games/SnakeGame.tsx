"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bumpPlays, getHighScore, getInk, getVividAccent, levelFromPlays, saveHighScore } from "@/lib/arcade";
import { clipRoundedField, paintFieldBg, Particles } from "@/lib/arcade-fx";

const GAME = "snake";
const CELL = 20; // px per grid cell (CSS)

type Pt = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const loopRef = useRef<(now: number) => void>(() => {});
  const gameRef = useRef<{
    cols: number;
    rows: number;
    snake: Pt[];
    dir: Pt;
    queued: Pt[];
    food: Pt;
    eaten: number;
    score: number;
    start: number;
    baseInterval: number;
    acc: number;
    last: number;
    running: boolean;
    shake: number;
    fx: Particles;
  } | null>(null);

  const [score, setScore] = useState(0);
  const [state, setState] = useState<"idle" | "playing" | "over">("idle");
  const [best, setBest] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => setBest(getHighScore(GAME)), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const spawnFood = useCallback((g: NonNullable<typeof gameRef.current>) => {
    let p: Pt;
    do {
      p = { x: Math.floor(Math.random() * g.cols), y: Math.floor(Math.random() * g.rows) };
    } while (g.snake.some((s) => s.x === p.x && s.y === p.y));
    g.food = p;
  }, []);

  const interval = useCallback((g: NonNullable<typeof gameRef.current>) => {
    const elapsed = (performance.now() - g.start) / 1000;
    // faster with each bite AND the longer the run lasts
    return Math.max(55, g.baseInterval - g.eaten * 3 - Math.floor(elapsed / 15) * 5);
  }, []);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.parentElement!.getBoundingClientRect();
    const w = Math.min(Math.floor(rect.width), 560);
    const cols = Math.floor(w / CELL);
    const rows = 18;
    const cw = cols * CELL;
    const ch = rows * CELL;
    canvas.width = cw * 2;
    canvas.height = ch * 2;
    canvas.style.width = cw + "px";
    canvas.style.height = ch + "px";

    const plays = bumpPlays(GAME);
    const lvl = levelFromPlays(plays);
    setLevel(lvl);
    const baseInterval = Math.max(70, 130 - (lvl - 1) * 6); // quicker start each play

    const mid = { x: Math.floor(cols / 2), y: Math.floor(rows / 2) };
    const g = {
      cols, rows,
      snake: [mid, { x: mid.x - 1, y: mid.y }, { x: mid.x - 2, y: mid.y }],
      dir: { x: 1, y: 0 },
      queued: [] as Pt[],
      food: { x: 0, y: 0 },
      eaten: 0,
      score: 0,
      start: performance.now(),
      baseInterval,
      acc: 0,
      last: performance.now(),
      running: true,
      shake: 0,
      fx: new Particles(),
    };
    spawnFood(g);
    gameRef.current = g;
    setScore(0);
    setState("playing");
  }, [spawnFood]);

  const setDir = useCallback((nx: number, ny: number) => {
    const g = gameRef.current;
    if (!g || !g.running) return;
    const last = g.queued.length ? g.queued[g.queued.length - 1] : g.dir;
    if (last.x === -nx && last.y === -ny) return; // no 180° reversal
    if (last.x === nx && last.y === ny) return;
    if (g.queued.length < 2) g.queued.push({ x: nx, y: ny });
  }, []);

  const step = useCallback((g: NonNullable<typeof gameRef.current>) => {
    if (g.queued.length) g.dir = g.queued.shift()!;
    const head = g.snake[0];
    const nx = head.x + g.dir.x;
    const ny = head.y + g.dir.y;

    const die = () => {
      g.running = false;
      g.shake = 9;
      g.fx.burst(head.x * CELL + CELL / 2, head.y * CELL + CELL / 2, getInk(), { count: 14, speed: 170, size: 4 });
      setState("over");
      setBest(saveHighScore(GAME, g.score));
    };

    // walls kill
    if (nx < 0 || ny < 0 || nx >= g.cols || ny >= g.rows) { die(); return; }
    // self kill
    if (g.snake.some((s) => s.x === nx && s.y === ny)) { die(); return; }

    g.snake.unshift({ x: nx, y: ny });
    if (nx === g.food.x && ny === g.food.y) {
      g.eaten++;
      g.score += 10;
      setScore(g.score);
      g.fx.burst(g.food.x * CELL + CELL / 2, g.food.y * CELL + CELL / 2, getVividAccent(), { count: 12, speed: 130, size: 3.5, gravity: 120 });
      spawnFood(g);
    } else {
      g.snake.pop();
    }
  }, [spawnFood]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const g = gameRef.current;
    if (!canvas || !g) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(2, 2);
    const W = g.cols * CELL;
    const H = g.rows * CELL;
    const accent = getVividAccent();
    const ink = getInk();

    clipRoundedField(ctx, W, H, 16);
    paintFieldBg(ctx, W, H, { grid: true, gridSpacing: CELL });

    if (g.shake > 0.2) {
      ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);
    }

    // food — pulsing glow orb with specular
    const pulse = 1 + 0.12 * Math.sin(performance.now() / 180);
    const fx = g.food.x * CELL + CELL / 2;
    const fy = g.food.y * CELL + CELL / 2;
    ctx.fillStyle = accent;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(fx, fy, CELL * 0.34 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.arc(fx - 2, fy - 2.5, CELL * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // snake — rounded segments, gradient body, glossy head with eyes
    const n = g.snake.length;
    g.snake.forEach((s, i) => {
      const t = i / Math.max(1, n);
      const cx = s.x * CELL + CELL / 2;
      const cy = s.y * CELL + CELL / 2;
      if (i === 0) {
        ctx.fillStyle = ink;
        ctx.shadowColor = "rgba(13,13,13,0.35)";
        ctx.shadowBlur = 8;
      } else {
        ctx.fillStyle = `rgba(13,13,13,${0.9 - t * 0.55})`;
        ctx.shadowBlur = 0;
      }
      const pad = i === 0 ? 1 : 1.5;
      ctx.beginPath();
      ctx.roundRect(s.x * CELL + pad, s.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, i === 0 ? 7 : 5);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (i === 0) {
        // eyes oriented along travel direction
        const ex = g.dir.x;
        const ey = g.dir.y;
        const ox = ey !== 0 ? 3.2 : 0;
        const oy = ex !== 0 ? 3.2 : 0;
        const fwdX = ex * 3;
        const fwdY = ey * 3;
        ctx.fillStyle = "#fff";
        for (const sgn of [-1, 1]) {
          ctx.beginPath();
          ctx.arc(cx + fwdX + sgn * ox, cy + fwdY + sgn * oy, 2.1, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = ink;
        for (const sgn of [-1, 1]) {
          ctx.beginPath();
          ctx.arc(cx + fwdX * 1.5 + sgn * ox, cy + fwdY * 1.5 + sgn * oy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    g.fx.draw(ctx);
    ctx.restore();
  }, []);

  const loop = useCallback((now: number) => {
    const g = gameRef.current;
    if (!g) return;
    if (g.running) {
      // Clamp delta so a paused/backgrounded tab can't fast-forward the snake
      // through several cells (and into a wall) on the first frame back.
      const delta = Math.min(120, now - g.last);
      g.acc += delta;
      g.last = now;
      if (g.shake > 0) g.shake = Math.max(0, g.shake - delta / 16);
      g.fx.update(delta / 1000);
      const iv = interval(g);
      let steps = 0;
      while (g.acc >= iv && g.running && steps < 3) {
        g.acc -= iv;
        step(g);
        steps++;
      }
      if (g.acc > iv) g.acc = iv; // drop backlog instead of catching up
      draw();
      animRef.current = requestAnimationFrame((next) => loopRef.current(next));
    } else {
      // keep animating the death particles for a moment
      if (g.fx.length > 0) {
        const delta = Math.min(120, now - g.last);
        g.last = now;
        if (g.shake > 0) g.shake = Math.max(0, g.shake - delta / 16);
        g.fx.update(delta / 1000);
        draw();
        animRef.current = requestAnimationFrame((next) => loopRef.current(next));
      } else {
        draw();
      }
    }
  }, [interval, step, draw]);

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["arrowup", "w"].includes(k)) { setDir(0, -1); e.preventDefault(); }
      else if (["arrowdown", "s"].includes(k)) { setDir(0, 1); e.preventDefault(); }
      else if (["arrowleft", "a"].includes(k)) { setDir(-1, 0); e.preventDefault(); }
      else if (["arrowright", "d"].includes(k)) { setDir(1, 0); e.preventDefault(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDir]);

  // swipe
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let sx = 0, sy = 0;
    const start = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    const end = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
      if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 1 : -1, 0);
      else setDir(0, dy > 0 ? 1 : -1);
    };
    canvas.addEventListener("touchstart", start, { passive: true });
    canvas.addEventListener("touchend", end, { passive: true });
    return () => {
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchend", end);
    };
  }, [setDir]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const startGame = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    initGame();
    const g = gameRef.current;
    if (g) { g.last = performance.now(); g.acc = 0; }
    animRef.current = requestAnimationFrame((next) => loopRef.current(next));
  }, [initGame]);

  return (
    <div className="game__container arcade-game">
      <div className="game__header">
        <div className="game__stat"><span className="game__stat-label">Score</span><span className="game__stat-value">{score}</span></div>
        <div className="game__stat"><span className="game__stat-label">Level</span><span className="game__stat-value">{level}</span></div>
        <div className="game__stat"><span className="game__stat-label">Best</span><span className="game__stat-value">{best}</span></div>
      </div>
      <div className="game__canvas-wrap">
        <canvas ref={canvasRef} className="game__canvas game__canvas--grid" />
        {state !== "playing" && (
          <div className="game__overlay">
            <div className="game__overlay-card">
              {state === "idle" ? (<>
                <p className="game__overlay-title">Snake</p>
                <p className="game__overlay-sub">Eat to grow. Walls and your own tail are fatal. Speeds up with every bite — and every replay.</p>
              </>) : (<>
                <p className="game__overlay-title">Game Over</p>
                <p className="game__overlay-sub">Score {score} · Best {best}</p>
              </>)}
              <button className="btn btn--accent game__btn" onClick={startGame}>
                {state === "idle" ? "Start" : "Play Again"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* on-screen dpad for touch */}
      <div className="dpad" aria-hidden={state !== "playing"}>
        <button className="dpad__btn dpad__up" onClick={() => setDir(0, -1)} aria-label="Up">▲</button>
        <button className="dpad__btn dpad__left" onClick={() => setDir(-1, 0)} aria-label="Left">◀</button>
        <button className="dpad__btn dpad__right" onClick={() => setDir(1, 0)} aria-label="Right">▶</button>
        <button className="dpad__btn dpad__down" onClick={() => setDir(0, 1)} aria-label="Down">▼</button>
      </div>
      <p className="arcade-game__hint">Arrow keys / WASD · swipe or D-pad on mobile</p>
    </div>
  );
}
