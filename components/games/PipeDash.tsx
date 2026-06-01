"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bumpPlays, getHighScore, getInk, getVividAccent, levelFromPlays, saveHighScore } from "@/lib/arcade";
import { clipRoundedField, lighten, paintFieldBg, Particles } from "@/lib/arcade-fx";

const GAME = "pipe";
const BIRD_R = 11;
const GRAVITY = 1500; // px/s^2
const FLAP_V = -440; // px/s
const PIPE_W = 64;

type Pipe = { x: number; gapY: number; gap: number; passed: boolean };

export default function PipeDash() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const loopRef = useRef<(now: number) => void>(() => {});
  const gameRef = useRef<{
    w: number; h: number;
    y: number; vy: number;
    pipes: Pipe[];
    spawnTimer: number;
    score: number;
    start: number;
    last: number;
    running: boolean;
    lvl: number;
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

  // difficulty knobs derived from level + current score
  const speed = (g: NonNullable<typeof gameRef.current>) => 150 + (g.lvl - 1) * 14 + g.score * 4;
  const gapSize = (g: NonNullable<typeof gameRef.current>) => Math.max(118, 188 - (g.lvl - 1) * 6 - g.score * 3);
  const spawnGap = (g: NonNullable<typeof gameRef.current>) => Math.max(220, 330 - (g.lvl - 1) * 8 - g.score * 4);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.parentElement!.getBoundingClientRect();
    const w = Math.min(Math.floor(rect.width), 560);
    const h = 420;
    canvas.width = w * 2;
    canvas.height = h * 2;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    const plays = bumpPlays(GAME);
    const lvl = levelFromPlays(plays);
    setLevel(lvl);

    const g = {
      w, h,
      y: h / 2, vy: 0,
      pipes: [] as Pipe[],
      spawnTimer: 0,
      score: 0,
      start: performance.now(),
      last: performance.now(),
      running: true,
      lvl,
      shake: 0,
      fx: new Particles(),
    };
    // first pipe seeded ahead
    g.pipes.push({ x: w + 120, gapY: h / 2, gap: gapSize(g), passed: false });
    gameRef.current = g;
    setScore(0);
    setState("playing");
  }, []);

  const flap = useCallback(() => {
    const g = gameRef.current;
    if (g && g.running) {
      g.vy = FLAP_V;
      const bx = g.w * 0.28;
      g.fx.burst(bx - BIRD_R, g.y + BIRD_R * 0.4, "rgba(13,13,13,0.18)", { count: 5, speed: 70, size: 3, life: 0.4, gravity: 40 });
    }
  }, []);

  const end = useCallback((g: NonNullable<typeof gameRef.current>) => {
    g.running = false;
    g.shake = 12;
    g.fx.burst(g.w * 0.28, g.y, getVividAccent(), { count: 18, speed: 200, size: 4, life: 0.7 });
    setState("over");
    setBest(saveHighScore(GAME, g.score));
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const g = gameRef.current;
    if (!canvas || !g) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(2, 2);
    const accent = getVividAccent();
    const ink = getInk();

    clipRoundedField(ctx, g.w, g.h, 16);
    paintFieldBg(ctx, g.w, g.h);

    if (g.shake > 0.2) {
      ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);
    }

    // pipes — gradient body with shaded cap
    g.pipes.forEach((p) => {
      const topH = p.gapY - p.gap / 2;
      const botY = p.gapY + p.gap / 2;
      const grad = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
      grad.addColorStop(0, lighten(ink.startsWith("#") ? ink : "#0d0d0d", 0.22));
      grad.addColorStop(0.5, ink);
      grad.addColorStop(1, lighten(ink.startsWith("#") ? ink : "#0d0d0d", 0.1));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(p.x, 0, PIPE_W, topH, 6);
      ctx.roundRect(p.x, botY, PIPE_W, g.h - botY, 6);
      ctx.fill();
      // accent lips with glow
      ctx.fillStyle = accent;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(p.x - 3, topH - 12, PIPE_W + 6, 12, 4);
      ctx.roundRect(p.x - 3, botY, PIPE_W + 6, 12, 4);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    g.fx.draw(ctx);

    // bird — rotated body with wing, glow, eye + beak
    const bx = g.w * 0.28;
    const angle = Math.max(-0.5, Math.min(0.9, g.vy / 600));
    ctx.save();
    ctx.translate(bx, g.y);
    ctx.rotate(angle);
    ctx.shadowColor = accent;
    ctx.shadowBlur = 16;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_R * 1.05, BIRD_R, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // wing
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    const flapPhase = Math.sin(performance.now() / 90);
    ctx.beginPath();
    ctx.ellipse(-2, 1, BIRD_R * 0.5, BIRD_R * 0.3 * (0.6 + 0.4 * Math.abs(flapPhase)), -0.4, 0, Math.PI * 2);
    ctx.fill();
    // beak
    ctx.fillStyle = "#ffb000";
    ctx.beginPath();
    ctx.moveTo(BIRD_R * 0.9, -1);
    ctx.lineTo(BIRD_R * 1.5, 1.5);
    ctx.lineTo(BIRD_R * 0.9, 4);
    ctx.closePath();
    ctx.fill();
    // eye
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(BIRD_R * 0.45, -3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.arc(BIRD_R * 0.6, -3, 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }, []);

  const loop = useCallback((now: number) => {
    const g = gameRef.current;
    if (!g) return;
    if (!g.running) {
      // animate crash particles briefly, then settle
      if (g.fx.length > 0) {
        const dt = Math.min(0.05, (now - g.last) / 1000);
        g.last = now;
        if (g.shake > 0) g.shake = Math.max(0, g.shake - dt * 60);
        g.fx.update(dt);
        draw();
        animRef.current = requestAnimationFrame((next) => loopRef.current(next));
      } else {
        draw();
      }
      return;
    }

    const dt = Math.min(0.032, (now - g.last) / 1000);
    g.last = now;

    g.fx.update(dt);

    g.vy += GRAVITY * dt;
    g.y += g.vy * dt;

    const sp = speed(g);
    const bx = g.w * 0.28;

    // move pipes
    g.pipes.forEach((p) => { p.x -= sp * dt; });
    // cull + score
    g.pipes = g.pipes.filter((p) => p.x + PIPE_W > -10);
    g.pipes.forEach((p) => {
      if (!p.passed && p.x + PIPE_W < bx - BIRD_R) {
        p.passed = true;
        g.score++;
        setScore(g.score);
      }
    });

    // spawn
    g.spawnTimer -= sp * dt;
    if (g.spawnTimer <= 0) {
      const margin = 56;
      const gap = gapSize(g);
      const gapY = margin + gap / 2 + Math.random() * (g.h - 2 * margin - gap);
      g.pipes.push({ x: g.w + 8, gapY, gap, passed: false });
      g.spawnTimer = spawnGap(g);
    }

    // collisions: floor / ceiling
    if (g.y + BIRD_R >= g.h || g.y - BIRD_R <= 0) { end(g); draw(); return; }
    // pipes
    for (const p of g.pipes) {
      const inX = bx + BIRD_R > p.x && bx - BIRD_R < p.x + PIPE_W;
      if (inX) {
        const topH = p.gapY - p.gap / 2;
        const botY = p.gapY + p.gap / 2;
        if (g.y - BIRD_R < topH || g.y + BIRD_R > botY) { end(g); draw(); return; }
      }
    }

    draw();
    animRef.current = requestAnimationFrame((next) => loopRef.current(next));
  }, [draw, end]);

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  // input: click / space / touch
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "ArrowUp") { e.preventDefault(); flap(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flap]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const startGame = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    initGame();
    const g = gameRef.current;
    if (g) g.last = performance.now();
    animRef.current = requestAnimationFrame((next) => loopRef.current(next));
  }, [initGame]);

  const onCanvasPointer = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (gameRef.current?.running) flap();
  }, [flap]);

  return (
    <div className="game__container arcade-game">
      <div className="game__header">
        <div className="game__stat"><span className="game__stat-label">Score</span><span className="game__stat-value">{score}</span></div>
        <div className="game__stat"><span className="game__stat-label">Level</span><span className="game__stat-value">{level}</span></div>
        <div className="game__stat"><span className="game__stat-label">Best</span><span className="game__stat-value">{best}</span></div>
      </div>
      <div className="game__canvas-wrap">
        <canvas
          ref={canvasRef}
          className="game__canvas game__canvas--tap"
          onMouseDown={onCanvasPointer}
          onTouchStart={onCanvasPointer}
        />
        {state !== "playing" && (
          <div className="game__overlay">
            <div className="game__overlay-card">
              {state === "idle" ? (<>
                <p className="game__overlay-title">Pipe Dash</p>
                <p className="game__overlay-sub">Tap, click or hit space to fly. Gaps shrink and speed climbs as you score — and every replay starts tougher.</p>
              </>) : (<>
                <p className="game__overlay-title">Crashed!</p>
                <p className="game__overlay-sub">Score {score} · Best {best}</p>
              </>)}
              <button className="btn btn--accent game__btn" onClick={startGame}>
                {state === "idle" ? "Start" : "Play Again"}
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="arcade-game__hint">Tap / click / space to flap · gap tightens with every point</p>
    </div>
  );
}
