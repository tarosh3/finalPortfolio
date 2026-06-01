// Shared canvas effects for the arcade games: a lightweight particle pool and a
// premium "recessed glass" playfield painter (gradient + vignette + dot grid).
// Everything assumes the caller has already applied the retina scale, so all
// coordinates are in CSS pixels.

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // remaining, seconds
  max: number; // initial life, seconds
  size: number;
  color: string;
  gravity: number;
  spin: number;
  rot: number;
};

type BurstOpts = {
  count?: number;
  speed?: number; // base speed px/s
  spread?: number; // 0..1 random speed jitter
  size?: number;
  life?: number; // seconds
  gravity?: number; // px/s^2
  square?: boolean; // shards vs dots
};

export class Particles {
  private items: Particle[] = [];

  get length() {
    return this.items.length;
  }

  clear() {
    this.items.length = 0;
  }

  /** Spawn a radial burst of particles at (x, y). */
  burst(x: number, y: number, color: string, opts: BurstOpts = {}) {
    const {
      count = 12,
      speed = 160,
      spread = 0.8,
      size = 4,
      life = 0.6,
      gravity = 320,
      square = false,
    } = opts;
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const s = speed * (1 - spread + Math.random() * spread);
      this.items.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life,
        max: life,
        size: size * (0.6 + Math.random() * 0.8),
        color,
        gravity,
        spin: square ? (Math.random() - 0.5) * 12 : 0,
        rot: Math.random() * Math.PI,
      });
    }
  }

  update(dt: number) {
    const items = this.items;
    for (let i = items.length - 1; i >= 0; i--) {
      const p = items[i];
      p.life -= dt;
      if (p.life <= 0) {
        items.splice(i, 1);
        continue;
      }
      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.items) {
      const t = Math.max(0, p.life / p.max);
      ctx.globalAlpha = t;
      ctx.fillStyle = p.color;
      if (p.spin) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        const s = p.size * (0.5 + t * 0.5);
        ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.4 + t * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
}

/** Mix a hex color toward white by `amt` (0..1). Returns an rgb() string. */
export function lighten(hex: string, amt: number): string {
  const raw = hex.replace("#", "");
  const h = raw.length === 3 ? raw.split("").map((x) => x + x).join("") : raw;
  const n = parseInt(h, 16);
  if (!Number.isFinite(n)) return hex;
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  r = Math.round(r + (255 - r) * amt);
  g = Math.round(g + (255 - g) * amt);
  b = Math.round(b + (255 - b) * amt);
  return `rgb(${r}, ${g}, ${b})`;
}

/** Clip subsequent drawing to a rounded rect. Caller must have saved the ctx. */
export function clipRoundedField(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  r = 16,
) {
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, r);
  ctx.clip();
}

type FieldOpts = { grid?: boolean; gridSpacing?: number };

/**
 * Paint a premium recessed playfield: a soft top-down gradient, a faint dot
 * grid, and an inner vignette for depth. Draw inside an active rounded clip.
 */
export function paintFieldBg(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  opts: FieldOpts = {},
) {
  const { grid = false, gridSpacing = 22 } = opts;

  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, "#ffffff");
  base.addColorStop(1, "#eef0f2");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  if (grid) {
    ctx.fillStyle = "rgba(13,13,13,0.045)";
    for (let x = gridSpacing / 2; x < w; x += gridSpacing) {
      for (let y = gridSpacing / 2; y < h; y += gridSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // inner vignette for depth
  const vig = ctx.createRadialGradient(
    w / 2,
    h / 2,
    Math.min(w, h) * 0.35,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.75,
  );
  vig.addColorStop(0, "rgba(13,13,13,0)");
  vig.addColorStop(1, "rgba(13,13,13,0.08)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
}
