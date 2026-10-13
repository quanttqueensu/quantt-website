"use client";

import { useEffect, useRef } from "react";

/*
 * Background texture for a blue band: simulated price paths (geometric Brownian
 * motion) drifting left to right across the whole band. Purely decorative — no
 * axes, no numbers, nothing presented as data. Finished paths bake into an
 * offscreen layer that decays a little every time a new one lands, so the texture
 * stays a steady density forever instead of filling up or resetting.
 */

const STEPS = 220;
const SIGMA = 0.35;
const MU = 0.06;
const CONCURRENT = 5;
const SEED = 40;
const BAKE_ALPHA = 0.07;
const DECAY = 0.03; // share of the baked layer erased per finished path

// White strokes: the texture sits on the blue band.
const STROKE = "255, 255, 255";

function gaussian() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Log-price path starting at 0, so it can be laid over any baseline. */
function simulateLogPath(): Float32Array {
  const dt = 1 / STEPS;
  const drift = (MU - 0.5 * SIGMA * SIGMA) * dt;
  const vol = SIGMA * Math.sqrt(dt);
  const path = new Float32Array(STEPS + 1);
  for (let i = 1; i <= STEPS; i++) path[i] = path[i - 1] + drift + vol * gaussian();
  return path;
}

interface Live {
  path: Float32Array;
  baseline: number; // 0–1 share of the height
  head: number; // fractional step
  speed: number; // steps per frame
}

export default function PricePaths({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bake = document.createElement("canvas");
    const bctx = bake.getContext("2d")!;

    let width = 0;
    let height = 0;
    let live: Live[] = [];
    let rafId: number | null = null;
    let visible = true;

    const x = (step: number) => (step / STEPS) * width;
    // ±1 in log-price spans roughly half the band.
    const y = (p: Live, step: number) => (p.baseline - p.path[step] * 0.5) * height;

    const trace = (c: CanvasRenderingContext2D, p: Live, upTo: number) => {
      c.beginPath();
      c.moveTo(x(0), y(p, 0));
      for (let i = 1; i <= upTo; i++) c.lineTo(x(i), y(p, i));
      c.stroke();
    };

    const newPath = (): Live => ({
      path: simulateLogPath(),
      baseline: 0.15 + Math.random() * 0.75,
      head: -Math.random() * 120, // staggered starts
      speed: 0.45 + Math.random() * 0.25, // ~6–9s across at 60fps
    });

    const settle = (p: Live) => {
      // Erase a slice of everything already baked, then add the new path on top.
      bctx.globalCompositeOperation = "destination-out";
      bctx.fillStyle = `rgba(0, 0, 0, ${DECAY})`;
      bctx.fillRect(0, 0, width, height);
      bctx.globalCompositeOperation = "source-over";
      bctx.strokeStyle = `rgba(${STROKE}, ${BAKE_ALPHA})`;
      bctx.lineWidth = 1;
      trace(bctx, p, STEPS);
    };

    const seed = (count: number) => {
      for (let i = 0; i < count; i++) settle(newPath());
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(bake, 0, 0, width, height);
      ctx.lineJoin = "round";
      for (const p of live) {
        if (p.head <= 1) continue;
        const upTo = Math.min(Math.floor(p.head), STEPS);
        ctx.strokeStyle = `rgba(${STROKE}, 0.22)`;
        ctx.lineWidth = 1.25;
        trace(ctx, p, upTo);
        ctx.fillStyle = `rgba(${STROKE}, 0.45)`;
        ctx.beginPath();
        ctx.arc(x(upTo), y(p, upTo), 2.25, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      for (const c of [canvas, bake]) {
        c.width = Math.round(width * dpr);
        c.height = Math.round(height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.lineJoin = "round";
      // Baked pixels don't survive a resize; regrow the texture at the new size.
      bctx.clearRect(0, 0, width, height);
      seed(reduceMotion ? SEED * 2 : SEED);
      draw();
    };

    const tick = () => {
      rafId = null;
      while (live.length < CONCURRENT) live.push(newPath());
      for (const p of live) p.head += p.speed;
      for (const p of live) if (p.head >= STEPS) settle(p);
      live = live.filter((p) => p.head < STEPS);
      draw();
      schedule();
    };

    const schedule = () => {
      if (rafId === null && visible && !document.hidden && !reduceMotion) {
        rafId = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    };

    resize();
    schedule();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : schedule());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full ${className}`}
    />
  );
}
