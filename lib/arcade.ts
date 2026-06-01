// Shared arcade helpers: persistent high scores + per-play difficulty escalation.
// Difficulty rises two ways:
//   1) PER PLAY  — every game start bumps a stored play counter; games seed a
//      harder starting state from it (faster ball, smaller gaps, quicker snake).
//   2) OVER TIME — each game ramps speed the longer a single run survives.

const KEY = (kind: string, game: string) => `arcade:${kind}:${game}`;

function readNum(key: string, fallback = 0): number {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (raw == null) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function writeNum(key: string, value: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    /* storage may be unavailable (private mode) — degrade silently */
  }
}

export function getHighScore(game: string): number {
  return readNum(KEY("hs", game));
}

/** Persist score if it beats the stored best. Returns the (possibly new) best. */
export function saveHighScore(game: string, score: number): number {
  const best = getHighScore(game);
  if (score > best) {
    writeNum(KEY("hs", game), score);
    return score;
  }
  return best;
}

export function getPlays(game: string): number {
  return readNum(KEY("plays", game));
}

// After this much idle time the difficulty ramp resets, so a visitor who returns
// later (or comes back the next day) isn't permanently stuck at brutal speeds.
// Within a single sitting, replays still escalate as intended.
const SESSION_GAP_MS = 20 * 60 * 1000;

/** Increment and return the new play count — call once per run start. */
export function bumpPlays(game: string): number {
  const now = Date.now();
  const last = readNum(KEY("ts", game), 0);
  const base = last && now - last > SESSION_GAP_MS ? 0 : getPlays(game);
  const next = base + 1;
  writeNum(KEY("plays", game), next);
  writeNum(KEY("ts", game), now);
  return next;
}

/**
 * Map a play count to a 1-based difficulty level, capped so veterans don't hit
 * impossible speeds. Level 1 on the very first play.
 */
export function levelFromPlays(plays: number, cap = 12): number {
  return Math.max(1, Math.min(cap, plays));
}

/** Current theme accent (falls back to brand red) for canvas drawing. */
export function getAccent(fallback = "#ff0062"): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim();
  return v || fallback;
}

export function getInk(fallback = "#0d0d0d"): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue("--text")
    .trim();
  return v || fallback;
}

function parseColor(c: string): [number, number, number] | null {
  const s = c.trim();
  if (s.startsWith("#")) {
    let h = s.slice(1);
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    if (h.length >= 6) {
      const n = parseInt(h.slice(0, 6), 16);
      if (Number.isFinite(n)) return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    return null;
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(",").map((v) => parseFloat(v));
    if (p.length >= 3 && p.every((v) => Number.isFinite(v))) return [p[0], p[1], p[2]];
  }
  return null;
}

function colorDist(a: [number, number, number], b: [number, number, number]): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

/**
 * Accent guaranteed to read against the charcoal ink used for obstacles. In the
 * "Mono" theme the accent IS charcoal, which would make the snake food / bird
 * vanish — so fall back to the brand pink when accent and ink nearly collide.
 */
export function getVividAccent(fallback = "#ff0062"): string {
  const accent = getAccent();
  const a = parseColor(accent);
  const i = parseColor(getInk());
  if (a && i && colorDist(a, i) < 80) return fallback;
  return accent;
}
