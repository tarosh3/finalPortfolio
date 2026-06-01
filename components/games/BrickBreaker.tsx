"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bumpPlays, getAccent, getHighScore, levelFromPlays, saveHighScore } from "@/lib/arcade";
import { clipRoundedField, lighten, paintFieldBg, Particles } from "@/lib/arcade-fx";

const GAME = "breaker";
const COLS = 9;
const ROWS = 5;
const BRICK_PAD = 5;
const BALL_R = 6;
const PADDLE_H = 12;
const PADDLE_Y = 30; // distance of paddle top from the bottom edge
const PADDLE_SPEED = 460; // px/s for keyboard control

// Brand-cohesive rainbow, one hue per row (top → bottom).
const ROW_COLORS = ["#ff0062", "#ff8a00", "#ffd600", "#00b894", "#2f6fe4"];

type Brick = { x: number; y: number; w: number; h: number; alive: boolean; color: string };

export default function BrickBreaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const loopRef = useRef<(now: number) => void>(() => {});
  const gameRef = useRef<{
    running: boolean;
    launched: boolean;
    ball: { x: number; y: number; dx: number; dy: number };
    paddle: { x: number; w: number };
    bricks: Brick[];
    score: number;
    lives: number;
    width: number;
    height: number;
    start: number;
    last: number;
    ramps: number;
    shake: number;
    keys: { left: boolean; right: boolean };
    fx: Particles;
  } | null>(null);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [state, setState] = useState<"idle" | "playing" | "over" | "won">("idle");
  const [best, setBest] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => setBest(getHighScore(GAME)), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.parentElement!.getBoundingClientRect();
    const w = Math.min(rect.width, 600);
    const h = 420;
    canvas.width = w * 2;
    canvas.height = h * 2;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    // ── Per-play escalation (decays after idle — see lib/arcade) ──────────
    const plays = bumpPlays(GAME);
    const lvl = levelFromPlays(plays);
    setLevel(lvl);
    const baseSpeed = 3 + Math.min(lvl - 1, 8) * 0.42; // faster start each play
    const paddleW = Math.max(58, 98 - (lvl - 1) * 4); // narrower paddle each play

    const brickW = (w - BRICK_PAD * (COLS + 1)) / COLS;
    const brickH = 18;
    const bricks: Brick[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        bricks.push({
          x: BRICK_PAD + c * (brickW + BRICK_PAD),
          y: 44 + r * (brickH + BRICK_PAD),
          w: brickW,
          h: brickH,
          alive: true,
          color: ROW_COLORS[r % ROW_COLORS.length],
        });
      }
    }

    const now = performance.now();
    gameRef.current = {
      running: true,
      launched: false,
      ball: { x: w / 2, y: h - PADDLE_Y - BALL_R - 1, dx: baseSpeed * (Math.random() > 0.5 ? 1 : -1), dy: -baseSpeed },
      paddle: { x: w / 2 - paddleW / 2, w: paddleW },
      bricks,
      score: 0,
      lives: 3,
      width: w,
      height: h,
      start: now,
      last: now,
      ramps: 0,
      shake: 0,
      keys: { left: false, right: false },
      fx: new Particles(),
    };
    setScore(0);
    setLives(3);
    setState("playing");
  }, []);

  const launch = useCallback(() => {
    const g = gameRef.current;
    if (g && g.running && !g.launched) g.launched = true;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const game = gameRef.current;
    if (!canvas || !game) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(2, 2);

    const accent = getAccent();
    const { width: W, height: H } = game;

    clipRoundedField(ctx, W, H, 16);
    paintFieldBg(ctx, W, H);

    // screen shake
    if (game.shake > 0.2) {
      ctx.translate((Math.random() - 0.5) * game.shake, (Math.random() - 0.5) * game.shake);
    }

    // bricks — glossy gel look: drop shadow, vertical gradient, top gloss
    game.bricks.forEach((b) => {
      if (!b.alive) return;
      ctx.fillStyle = "rgba(13,13,13,0.10)";
      ctx.beginPath();
      ctx.roundRect(b.x + 0.5, b.y + 2, b.w, b.h, 5);
      ctx.fill();

      const grad = ctx.createLinearGradient(0, b.y, 0, b.y + b.h);
      grad.addColorStop(0, lighten(b.color, 0.32));
      grad.addColorStop(0.55, b.color);
      grad.addColorStop(1, lighten(b.color, -0.0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, b.w, b.h, 5);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.beginPath();
      ctx.roundRect(b.x + 3, b.y + 2.5, b.w - 6, b.h * 0.34, 3);
      ctx.fill();
    });

    // ball trail
    ctx.fillStyle = accent + "30";
    ctx.beginPath();
    ctx.arc(game.ball.x - game.ball.dx * 1.6, game.ball.y - game.ball.dy * 1.6, BALL_R * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accent + "55";
    ctx.beginPath();
    ctx.arc(game.ball.x - game.ball.dx * 0.8, game.ball.y - game.ball.dy * 0.8, BALL_R * 0.9, 0, Math.PI * 2);
    ctx.fill();

    // ball with glow + specular highlight
    ctx.shadowColor = accent;
    ctx.shadowBlur = 16;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(game.ball.x, game.ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.arc(game.ball.x - 2, game.ball.y - 2.4, BALL_R * 0.34, 0, Math.PI * 2);
    ctx.fill();

    // paddle — gradient capsule with glow
    const py = game.height - PADDLE_Y;
    const grad = ctx.createLinearGradient(game.paddle.x, 0, game.paddle.x + game.paddle.w, 0);
    grad.addColorStop(0, lighten(accent.startsWith("#") ? accent : "#ff0062", 0.15));
    grad.addColorStop(1, accent);
    ctx.fillStyle = grad;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(game.paddle.x, py, game.paddle.w, PADDLE_H, 6);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.roundRect(game.paddle.x + 4, py + 2, game.paddle.w - 8, PADDLE_H * 0.32, 3);
    ctx.fill();

    game.fx.draw(ctx);

    // serve hint
    if (!game.launched && game.running) {
      const pulse = 0.55 + 0.45 * Math.sin(performance.now() / 300);
      ctx.globalAlpha = pulse;
      ctx.fillStyle = "rgba(13,13,13,0.55)";
      ctx.font = "600 13px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Move or tap to serve", W / 2, H - 64);
      ctx.globalAlpha = 1;
      ctx.textAlign = "start";
    }

    ctx.restore();
  }, []);

  const update = useCallback((game: NonNullable<typeof gameRef.current>, dt: number) => {
    if (!game.running) return;
    const b = game.ball;

    if (game.shake > 0) game.shake = Math.max(0, game.shake - dt * 60);

    // keyboard paddle movement
    if (game.keys.left) game.paddle.x -= PADDLE_SPEED * dt;
    if (game.keys.right) game.paddle.x += PADDLE_SPEED * dt;
    game.paddle.x = Math.max(0, Math.min(game.width - game.paddle.w, game.paddle.x));

    // before serve the ball rides the paddle
    if (!game.launched) {
      b.x = game.paddle.x + game.paddle.w / 2;
      b.y = game.height - PADDLE_Y - BALL_R - 1;
      return;
    }

    // ── Over-time escalation: +10% speed every 12s survived ──
    const elapsed = (performance.now() - game.start) / 1000;
    const wantRamps = Math.floor(elapsed / 12);
    while (game.ramps < wantRamps) {
      b.dx *= 1.1;
      b.dy *= 1.1;
      game.ramps++;
    }

    // Sub-stepped integration: prevents tunneling through bricks/walls and
    // makes motion frame-rate independent (velocities are tuned per 60fps frame).
    const dtScale = Math.min(2.4, dt * 60);
    let remaining = Math.hypot(b.dx, b.dy) * dtScale;
    const maxStep = BALL_R * 0.7;
    const pTop = game.height - PADDLE_Y;

    while (remaining > 0.0001 && game.running) {
      const stepLen = Math.min(maxStep, remaining);
      const sp = Math.hypot(b.dx, b.dy) || 1;
      b.x += (b.dx / sp) * stepLen;
      b.y += (b.dy / sp) * stepLen;
      remaining -= stepLen;

      // walls (clamp position so the ball can't vibrate against the edge)
      if (b.x - BALL_R < 0) {
        b.x = BALL_R;
        b.dx = Math.abs(b.dx);
      } else if (b.x + BALL_R > game.width) {
        b.x = game.width - BALL_R;
        b.dx = -Math.abs(b.dx);
      }
      if (b.y - BALL_R < 0) {
        b.y = BALL_R;
        b.dy = Math.abs(b.dy);
      }

      // paddle
      if (
        b.dy > 0 &&
        b.y + BALL_R >= pTop &&
        b.y + BALL_R <= pTop + PADDLE_H + stepLen &&
        b.x >= game.paddle.x - BALL_R &&
        b.x <= game.paddle.x + game.paddle.w + BALL_R
      ) {
        const speed = Math.hypot(b.dx, b.dy);
        const hit = (b.x - game.paddle.x) / game.paddle.w - 0.5; // -0.5..0.5
        const angle = Math.max(-1, Math.min(1, hit)) * 1.05; // steer
        b.dx = speed * Math.sin(angle);
        b.dy = -Math.abs(speed * Math.cos(angle));
        b.y = pTop - BALL_R;
        continue;
      }

      // bottom — lose a life
      if (b.y - BALL_R > game.height) {
        game.lives--;
        setLives(game.lives);
        game.shake = 10;
        if (game.lives <= 0) {
          game.running = false;
          setState("over");
          setBest(saveHighScore(GAME, game.score));
          return;
        }
        // re-serve from the paddle
        game.launched = false;
        const serveSp = Math.hypot(b.dx, b.dy) || 4;
        b.x = game.paddle.x + game.paddle.w / 2;
        b.y = game.height - PADDLE_Y - BALL_R - 1;
        b.dx = serveSp * 0.6 * (Math.random() > 0.5 ? 1 : -1);
        b.dy = -Math.abs(serveSp);
        return;
      }

      // bricks — reflect on the axis of least penetration, one hit per step
      for (const brick of game.bricks) {
        if (!brick.alive) continue;
        if (
          b.x + BALL_R > brick.x &&
          b.x - BALL_R < brick.x + brick.w &&
          b.y + BALL_R > brick.y &&
          b.y - BALL_R < brick.y + brick.h
        ) {
          const overlapX = Math.min(b.x + BALL_R - brick.x, brick.x + brick.w - (b.x - BALL_R));
          const overlapY = Math.min(b.y + BALL_R - brick.y, brick.y + brick.h - (b.y - BALL_R));
          if (overlapX < overlapY) {
            b.dx = -b.dx;
            b.x += b.dx > 0 ? overlapX : -overlapX;
          } else {
            b.dy = -b.dy;
            b.y += b.dy > 0 ? overlapY : -overlapY;
          }
          brick.alive = false;
          game.score += 10;
          setScore(game.score);
          game.shake = Math.max(game.shake, 4);
          game.fx.burst(brick.x + brick.w / 2, brick.y + brick.h / 2, brick.color, {
            count: 9,
            speed: 150,
            size: 3.5,
            life: 0.5,
            square: true,
          });
          break;
        }
      }
    }

    if (game.bricks.every((br) => !br.alive)) {
      game.running = false;
      setState("won");
      setBest(saveHighScore(GAME, game.score));
    }
  }, []);

  const loop = useCallback((now: number) => {
    const game = gameRef.current;
    if (!game) return;
    const dt = Math.min(0.05, (now - game.last) / 1000);
    game.last = now;
    game.fx.update(dt);
    update(game, dt);
    draw();
    if (gameRef.current?.running) animRef.current = requestAnimationFrame((next) => loopRef.current(next));
  }, [update, draw]);

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  // pointer control
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const move = (clientX: number) => {
      const game = gameRef.current;
      if (!game) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      game.paddle.x = Math.max(0, Math.min(game.width - game.paddle.w, x - game.paddle.w / 2));
      launch();
    };
    const onMouse = (e: MouseEvent) => move(e.clientX);
    const onTouch = (e: TouchEvent) => { e.preventDefault(); move(e.touches[0].clientX); };
    const onDown = () => launch();
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("touchstart", onDown, { passive: true });
    canvas.addEventListener("touchmove", onTouch, { passive: false });
    return () => {
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("touchstart", onDown);
      canvas.removeEventListener("touchmove", onTouch);
    };
  }, [launch]);

  // keyboard control (paddle + serve)
  useEffect(() => {
    const set = (e: KeyboardEvent, down: boolean) => {
      const g = gameRef.current;
      if (!g) return;
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") { g.keys.left = down; e.preventDefault(); }
      else if (k === "arrowright" || k === "d") { g.keys.right = down; e.preventDefault(); }
      else if (down && (k === " " || k === "spacebar")) { launch(); e.preventDefault(); }
    };
    const dn = (e: KeyboardEvent) => set(e, true);
    const up = (e: KeyboardEvent) => set(e, false);
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", dn);
      window.removeEventListener("keyup", up);
    };
  }, [launch]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const startGame = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    initGame();
    const g = gameRef.current;
    if (g) g.last = performance.now();
    animRef.current = requestAnimationFrame((next) => loopRef.current(next));
  }, [initGame]);

  return (
    <div className="game__container arcade-game">
      <div className="game__header">
        <div className="game__stat"><span className="game__stat-label">Score</span><span className="game__stat-value">{score}</span></div>
        <div className="game__stat"><span className="game__stat-label">Lives</span><span className="game__stat-value game__stat-value--dots">{lives > 0 ? "●".repeat(lives) : "—"}</span></div>
        <div className="game__stat"><span className="game__stat-label">Level</span><span className="game__stat-value">{level}</span></div>
        <div className="game__stat"><span className="game__stat-label">Best</span><span className="game__stat-value">{best}</span></div>
      </div>
      <div className="game__canvas-wrap">
        <canvas ref={canvasRef} className="game__canvas" />
        {state !== "playing" && (
          <div className="game__overlay">
            <div className="game__overlay-card">
              {state === "idle" && (<>
                <p className="game__overlay-title">Brick Breaker</p>
                <p className="game__overlay-sub">Steer the paddle to clear every brick. The ball speeds up the longer you last — and every replay starts faster.</p>
              </>)}
              {state === "over" && (<>
                <p className="game__overlay-title">Game Over</p>
                <p className="game__overlay-sub">Score {score} · Best {best}</p>
              </>)}
              {state === "won" && (<>
                <p className="game__overlay-title">Board Cleared!</p>
                <p className="game__overlay-sub">Score {score} — next run is harder.</p>
              </>)}
              <button className="btn btn--accent game__btn" onClick={startGame}>
                {state === "idle" ? "Start" : "Play Again"}
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="arcade-game__hint">Mouse · arrow keys / A·D · difficulty climbs with time &amp; replays</p>
    </div>
  );
}
