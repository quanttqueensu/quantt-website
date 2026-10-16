"use client";

import { useEffect, useRef, useState } from "react";

// One full cycle, ending back where it started so the headline settles on the
// broadest phrase. Stopping (rather than looping forever) satisfies WCAG 2.2.2
// without needing a pause control.
const SEQUENCE = [
  "Quantitative Finance",
  "Algorithmic Trading",
  "Derivatives",
  "Fixed Income",
  "Data Science",
  "Quantitative Finance",
];
const INTERVAL_MS = 2600;

/**
 * The rolling second line of the hero headline. Purely visual: the h1 carries a
 * static screen-reader sentence, so this is aria-hidden.
 */
export default function RotatingPhrase() {
  const ref = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Pause while the pointer or keyboard focus is anywhere in the hero.
    const scope = ref.current?.closest("header") ?? document.body;
    let paused = false;
    const pause = () => (paused = true);
    const resume = () => (paused = false);
    scope.addEventListener("mouseenter", pause);
    scope.addEventListener("mouseleave", resume);
    scope.addEventListener("focusin", pause);
    scope.addEventListener("focusout", resume);

    const timer = window.setInterval(() => {
      if (paused || document.hidden) return;
      setAnimated(true);
      setIndex((i) => {
        const next = i + 1;
        if (next >= SEQUENCE.length - 1) window.clearInterval(timer);
        return Math.min(next, SEQUENCE.length - 1);
      });
    }, INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
      scope.removeEventListener("mouseenter", pause);
      scope.removeEventListener("mouseleave", resume);
      scope.removeEventListener("focusin", pause);
      scope.removeEventListener("focusout", resume);
    };
  }, []);

  const prev = index > 0 ? SEQUENCE[index - 1] : null;

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="cs-h1__roll"
    >
      {animated && prev && (
        <span key={`out-${index}`} className="animate-[phrase-out_380ms_cubic-bezier(.5,0,.75,0)_forwards]">
          {prev}
        </span>
      )}
      <span
        key={`in-${index}`}
        className={animated ? "animate-[phrase-in_520ms_cubic-bezier(.2,.7,.2,1)_120ms_both]" : undefined}
      >
        {SEQUENCE[index]}
      </span>
    </span>
  );
}
