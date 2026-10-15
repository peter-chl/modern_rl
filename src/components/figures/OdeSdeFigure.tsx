"use client";

// Probability-flow ODE vs SDE sampling for a 1-D rectified flow.
// Data: a two-component Gaussian mixture, interpolation x_t = (1 - t) x0 + t eps
// (data at t = 0, noise at t = 1). Velocity and score are exact for a mixture,
// so the only approximation is the Euler / Euler–Maruyama discretization.

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

const COMPONENTS = [
  { w: 0.35, m: -1.6, s: 0.3 },
  { w: 0.65, m: 1.3, s: 0.45 },
];
const STEPS = 120;
const N_SHOWN = 22;
const N_HIST = 600;
const X_MIN = -3.2;
const X_MAX = 3.2;

function normalPdf(x: number, mean: number, variance: number) {
  return Math.exp(-((x - mean) ** 2) / (2 * variance)) / Math.sqrt(2 * Math.PI * variance);
}

// Marginal density, velocity E[eps - x0 | x_t = x] and score at time t.
function fields(x: number, t: number) {
  let total = 0;
  let v = 0;
  let score = 0;
  for (const { w, m, s } of COMPONENTS) {
    const mean = (1 - t) * m;
    const variance = (1 - t) ** 2 * s * s + t * t;
    const p = w * normalPdf(x, mean, variance);
    const r = (x - mean) / variance;
    const eEps = t * r;
    const eX0 = m + (1 - t) * s * s * r;
    total += p;
    v += p * (eEps - eX0);
    score += p * -r;
  }
  return { density: total, v: v / total, score: score / total };
}

// Mulberry32: a small seeded PRNG, so both panels share the same noise draws.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number) {
  const u = Math.max(rand(), 1e-12);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

// sigma_t = a sqrt(t / (1 - t)), capped near t = 1 where it diverges.
function sigmaAt(t: number, a: number) {
  const tc = Math.min(t, 0.95);
  return a * Math.sqrt(tc / (1 - tc));
}

function simulate(seed: number, a: number, stochastic: boolean, n: number) {
  const rand = rng(seed);
  const starts = Array.from({ length: n }, () => gaussian(rand));
  const stepNoise = rng(seed * 7919 + 13);
  const dt = 1 / STEPS;
  return starts.map((x0) => {
    const path = [x0];
    let x = x0;
    for (let i = 0; i < STEPS; i++) {
      const t = 1 - i * dt;
      const { v, score } = fields(x, t);
      if (stochastic) {
        const sig = sigmaAt(t, a);
        x = x - (v - 0.5 * sig * sig * score) * dt + sig * Math.sqrt(dt) * gaussian(stepNoise);
      } else {
        x = x - v * dt;
      }
      path.push(x);
    }
    return path;
  });
}

// Geometry of one panel (SVG units).
const W = 300;
const H = 200;
const PAD_L = 8;
const PLOT_W = 230;
const HIST_X = PAD_L + PLOT_W + 6;
const HIST_W = W - HIST_X - 4;
const PAD_T = 22;
const PLOT_H = H - PAD_T - 22;
const px = (t: number) => PAD_L + (1 - t) * PLOT_W; // noise (t = 1) on the left
const py = (x: number) => PAD_T + ((X_MAX - x) / (X_MAX - X_MIN)) * PLOT_H;

function DensityBackground() {
  const cols = 46;
  const rows = 48;
  const rects = useMemo(() => {
    const out: { x: number; y: number; w: number; h: number; o: number }[] = [];
    for (let c = 0; c < cols; c++) {
      const t = 1 - (c + 0.5) / cols;
      const vals = [];
      for (let r = 0; r < rows; r++) {
        const x = X_MAX - ((r + 0.5) / rows) * (X_MAX - X_MIN);
        vals.push(fields(x, t).density);
      }
      const max = Math.max(...vals);
      vals.forEach((d, r) =>
        out.push({
          x: PAD_L + (c / cols) * PLOT_W,
          y: PAD_T + (r / rows) * PLOT_H,
          w: PLOT_W / cols + 0.3,
          h: PLOT_H / rows + 0.3,
          o: 0.32 * (d / max),
        }),
      );
    }
    return out;
  }, []);
  return (
    <g>
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="var(--accent)" fillOpacity={r.o} />
      ))}
    </g>
  );
}

function Histogram({ endpoints }: { endpoints: number[] }) {
  const bins = 32;
  const counts = new Array(bins).fill(0);
  for (const x of endpoints) {
    const b = Math.floor(((X_MAX - x) / (X_MAX - X_MIN)) * bins);
    if (b >= 0 && b < bins) counts[b]++;
  }
  const binH = PLOT_H / bins;
  const binWidthX = (X_MAX - X_MIN) / bins;
  // Scale so that the target density and the histogram share an axis.
  const curve = Array.from({ length: 80 }, (_, i) => {
    const x = X_MAX - ((i + 0.5) / 80) * (X_MAX - X_MIN);
    return { x, d: fields(x, 0).density };
  });
  const dMax = Math.max(...curve.map((c) => c.d));
  const scale = HIST_W / dMax;
  return (
    <g>
      {counts.map((c, i) => (
        <rect
          key={i}
          x={HIST_X}
          y={PAD_T + i * binH}
          width={(c / (endpoints.length * binWidthX)) * scale}
          height={binH - 0.4}
          fill="currentColor"
          fillOpacity={0.28}
        />
      ))}
      <polyline
        points={curve.map((c) => `${HIST_X + c.d * scale},${py(c.x)}`).join(" ")}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1.4}
      />
    </g>
  );
}

function Panel({
  title,
  paths,
  endpoints,
  progress,
  done,
}: {
  title: string;
  paths: number[][];
  endpoints: number[];
  progress: number;
  done: boolean;
}) {
  const upto = Math.max(1, Math.round(progress * STEPS));
  const clipId = useId();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={title}>
      <text x={PAD_L} y={14} fontSize={11} fontWeight={600} fill="currentColor">
        {title}
      </text>
      <defs>
        <clipPath id={clipId}>
          <rect x={PAD_L} y={PAD_T} width={PLOT_W} height={PLOT_H} />
        </clipPath>
      </defs>
      <DensityBackground />
      <rect x={PAD_L} y={PAD_T} width={PLOT_W} height={PLOT_H} fill="none" stroke="var(--border)" />
      <g clipPath={`url(#${clipId})`}>
      {paths.map((p, i) => (
        <polyline
          key={i}
          points={p
            .slice(0, upto + 1)
            .map((x, k) => `${px(1 - k / STEPS)},${py(x)}`)
            .join(" ")}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.75}
          strokeWidth={0.9}
        />
      ))}
      {paths.map((p, i) => (
        <circle key={i} cx={px(1 - upto / STEPS)} cy={py(p[upto])} r={1.8} fill="var(--accent)" />
      ))}
      </g>
      {done && <Histogram endpoints={endpoints} />}
      <text x={PAD_L} y={H - 6} fontSize={9} fill="var(--muted)">
        noise (t = 1)
      </text>
      <text x={PAD_L + PLOT_W} y={H - 6} fontSize={9} fill="var(--muted)" textAnchor="end">
        data (t = 0)
      </text>
      {done && (
        <text x={HIST_X} y={H - 6} fontSize={9} fill="var(--muted)">
          samples
        </text>
      )}
    </svg>
  );
}

export default function OdeSdeFigure() {
  const [seed, setSeed] = useState(7);
  const [a, setA] = useState(0.7);
  const [progress, setProgress] = useState(1);
  const frame = useRef<number | null>(null);

  const ode = useMemo(() => simulate(seed, a, false, N_HIST), [seed, a]);
  const sde = useMemo(() => simulate(seed, a, true, N_HIST), [seed, a]);

  const play = useCallback(() => {
    if (frame.current) cancelAnimationFrame(frame.current);
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(1);
      return;
    }
    const start = performance.now();
    const duration = 3200;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setProgress(p);
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restart the animation when inputs change
    play();
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [seed, a, play]);

  const done = progress >= 1;
  return (
    <div className="w-full max-w-2xl text-foreground">
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel
          title="Probability-flow ODE (σ = 0)"
          paths={ode.slice(0, N_SHOWN)}
          endpoints={ode.map((p) => p[STEPS])}
          progress={progress}
          done={done}
        />
        <Panel
          title={`SDE, noise level a = ${a.toFixed(2)}`}
          paths={sde.slice(0, N_SHOWN)}
          endpoints={sde.map((p) => p[STEPS])}
          progress={progress}
          done={done}
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
        <button
          type="button"
          onClick={play}
          className="rounded border border-border px-2.5 py-1 text-foreground hover:border-accent"
        >
          Replay
        </button>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded border border-border px-2.5 py-1 text-foreground hover:border-accent"
        >
          New noise
        </button>
        <label className="flex items-center gap-2">
          noise level a
          <input
            type="range"
            min={0.1}
            max={1.4}
            step={0.05}
            value={a}
            onChange={(e) => setA(parseFloat(e.target.value))}
            className="accent-[var(--accent)]"
          />
        </label>
      </div>
    </div>
  );
}
