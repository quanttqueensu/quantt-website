"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export interface HiringProjectSlide {
  title: string;
  slug: string;
  description: string;
}

const AUTO_MS = 5000;
const FADE_MS = 180;

export default function HiringProjectsPopup({
  projects,
}: {
  projects: HiringProjectSlide[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fade, setFade] = useState(true);
  const fadeTimer = useRef<number | null>(null);
  const indexRef = useRef(0);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useRef(false);

  const clearFadeTimer = () => {
    if (fadeTimer.current !== null) {
      window.clearTimeout(fadeTimer.current);
      fadeTimer.current = null;
    }
  };

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  useEffect(() => {
    if (projects.length === 0 || pathname === "/hiring") return;
    const dismissed = sessionStorage.getItem("hiring-popup-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [projects.length, pathname]);

  useEffect(() => {
    if (pathname === "/hiring" && open) setOpen(false);
  }, [pathname, open]);

  const close = useCallback(() => {
    setOpen(false);
    sessionStorage.setItem("hiring-popup-dismissed", "1");
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (projects.length === 0) return;
      const target =
        ((next % projects.length) + projects.length) % projects.length;
      indexRef.current = target;
      clearFadeTimer();

      if (reduceMotion.current) {
        setIndex(target);
        setFade(true);
        return;
      }

      setFade(false);
      fadeTimer.current = window.setTimeout(() => {
        setIndex(target);
        setFade(true);
        fadeTimer.current = null;
      }, FADE_MS);
    },
    [projects.length]
  );

  const navigate = useCallback(
    (nextOrDelta: number, relative = false) => {
      const next = relative ? indexRef.current + nextOrDelta : nextOrDelta;
      goTo(next);
    },
    [goTo]
  );

  useEffect(() => {
    if (!open || paused || projects.length <= 1 || reduceMotion.current) return;
    const timer = window.setInterval(() => navigate(1, true), AUTO_MS);
    return () => window.clearInterval(timer);
  }, [open, paused, projects.length, navigate]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        navigate(1, true);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigate(-1, true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      clearFadeTimer();
    };
  }, [open, close, navigate]);

  if (!open || projects.length === 0) return null;

  const project = projects[index];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Hiring projects"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-navy p-8 shadow-2xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setPaused(false);
          }
        }}
        onPointerDown={() => setPaused(true)}
      >
        <button
          ref={closeBtnRef}
          onClick={close}
          className="absolute right-4 top-4 text-xl leading-none text-white/40 transition-colors hover:text-white"
          aria-label="Close"
        >
          &times;
        </button>

        <p className="text-[10px] font-semibold uppercase tracking-[3px] text-green-300">
          Now Hiring
        </p>
        <p className="mt-1 text-xs text-white/45">
          Explore open project teams · {index + 1} / {projects.length}
        </p>

        <Link
          href={`/hiring#${project.slug}`}
          onClick={close}
          className={`mt-5 block transition-opacity duration-200 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="font-heading text-2xl font-bold text-white transition-colors hover:text-blue-light">
            {project.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/75">
            {project.description}
          </p>
          <p className="mt-3 text-xs font-medium text-blue-light">
            View project details →
          </p>
        </Link>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1, true)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white"
              aria-label="Previous project"
            >
              ‹
            </button>
            <button
              onClick={() => navigate(1, true)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white"
              aria-label="Next project"
            >
              ›
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                onClick={() => navigate(i)}
                aria-label={`Go to ${p.title}`}
                aria-current={i === index ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-5 bg-blue-light"
                    : "w-1.5 bg-white/25 hover:bg-white/45"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/hiring"
            onClick={close}
            className="group inline-flex items-center gap-2 rounded bg-primary px-5 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary/80"
          >
            Go to Hiring
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <button
            onClick={close}
            className="text-xs text-white/40 transition-colors hover:text-white/70"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
