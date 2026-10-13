# QUANTT website — design & accessibility fix list

Findings from a full design review of the site at commit `753f892`, evaluated against
three lenses: distinctive visual design, brand consistency, and UI/UX + accessibility.

**How this was produced.** Every page and component was read; the site was run locally and
captured at 1440px desktop and at a true 390px mobile viewport (inside a fixed-width iframe —
raw `--window-size` in headless Chrome does not produce a real mobile layout viewport and will
give you false "overflow" bugs). Contrast ratios were computed against the actual composited
backgrounds, accounting for alpha layering. The no-JS findings were verified with
`--disable-javascript`.

**How to use this.** Fixes are grouped into three tiers and numbered. P0 items are defects with
observable user impact — do those first. P1 is system debt that makes everything after it
cheaper. P2 is design direction and needs a decision, not just a patch.

---

## Index

### P0 — Defects (ship first)

| # | Fix | Impact |
|---|---|---|
| [P0-1](#p0-1--content-is-invisible-without-javascript) | `ScrollReveal` renders content at `opacity-0` | `/contact` is a blank page without JS |
| [P0-2](#p0-2--no-ogimage-on-any-shared-link) | No `og:image` / `summary_large_image` | Every Instagram + LinkedIn share is a bare text stub |
| [P0-3](#p0-3--text-contrast-below-wcag-aa) | 10 text/background pairs below 4.5:1 | Footer copyright sits at 1.47:1 |
| [P0-4](#p0-4--contradictory-and-stale-recruiting-messages) | Two conflicting recruiting messages live | Stale April 15 2026 deadline still rendering |
| [P0-5](#p0-5--no-focus-styles-no-reduced-motion-support) | No focus rings; `prefers-reduced-motion` ignored | Keyboard + vestibular accessibility |
| [P0-6](#p0-6--touch-targets-below-44px-and-missing-cursor-pointer) | Popup controls 6–32px; no `cursor-pointer` | Unusable controls on touch |

### P1 — System

| # | Fix | Impact |
|---|---|---|
| [P1-1](#p1-1--one-container-width) | Five container widths; none match the chrome | Logo never aligns with page content |
| [P1-2](#p1-2--collapse-seven-glass-surfaces-into-one-component) | 7 glass recipes, 4 radii, 5 greens, 2 color systems | Drift is already visible |
| [P1-3](#p1-3--raise-the-type-scale) | 104 instances ≤14px, 27 ≤11px | Body copy below the 16px floor |
| [P1-4](#p1-4--replace-emoji-and-glyph-icons-normalize-partner-logos) | Emoji as icons; unnormalized partner lock-ups | Cross-platform rendering, brand consistency |
| [P1-5](#p1-5--performance-particle-canvas-and-scroll-handler) | Unbounded O(n²) rAF loop; unthrottled scroll | Battery drain, jank |
| [P1-6](#p1-6--navigation-overlap-and-fake-tabs) | Duplicate content under two nav labels; non-semantic tabs | IA + keyboard nav |

### P2 — Design direction

| # | Fix | Impact |
|---|---|---|
| [P2-1](#p2-1--remove-the-interstitial) | Auto-opening full-screen modal on every page | Highest-impact UX decision on the site |
| [P2-2](#p2-2--rebuild-the-hero-around-the-actual-subject-matter) | Particle network + invented chart data | Hero says nothing specific to QUANTT |
| [P2-3](#p2-3--delete-the-template-chrome) | Eyebrows, appended arrows, middle-dot meta | Five named "generated page" tells |
| [P2-4](#p2-4--rewrite-the-copy) | Same sentence 4×; live `Club Photo` placeholder | Copy reads as templated as the design |
| [P2-5](#p2-5--let-hiring-set-the-direction) | Card kit flattens all hierarchy | `/hiring` is already the best page |

---

# P0 — Defects

## P0-1 — Content is invisible without JavaScript

**Files:** `components/ScrollReveal.tsx:15,36-37` (and all 12 usages)

### Problem

`ScrollReveal` renders its children at `opacity-0 translate-y-8` and waits for an
`IntersectionObserver` to flip them visible. There is no fallback. If JS has not run,
fails, or is disabled, the content never appears.

### Evidence

Observed in headless capture, and confirmed deterministically by reading the SSR HTML — every
`ScrollReveal` shipped `opacity-0 translate-y-8` in the server output, so the content was
invisible until hydration ran *and* an observer callback fired:

- **`/contact` renders completely empty.** Every element on the page is inside a `ScrollReveal`.
- **`/hiring` loses its entire header** — "Now Hiring", "Join a Portfolio", the intro paragraph
  and the Instagram CTA. A ~360px void above the first portfolio.
- **`/competition` renders one tab button** and nothing else.
- `/team` loses its `<h1>`.

This also reproduced intermittently *with* JS enabled during headless capture, so it is not
purely a no-JS concern — it is a race that real slow connections can lose.

### Fix

Invert the default: render at final position, and only arm the animation for elements that are
confirmed below the fold at mount. This removes the no-JS failure, removes the above-the-fold
load-in animation (which is the generic default anyway), and adds reduced-motion support in the
same change.

```tsx
// components/ScrollReveal.tsx
"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
}

// "static"  — rendered at final position, no transition. This is the SSR output,
//             the no-JS output, and the prefers-reduced-motion output.
// "hidden"  — armed and waiting; only ever entered by elements that are entirely
//             below the viewport at mount, so the transition into this state is
//             never visible.
// "shown"   — revealed with the transition.
type State = "static" | "hidden" | "shown";

export default function ScrollReveal({
  children,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    // Anything already on screen stays put — no entrance animation above the fold.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${state === "static" ? "" : "transition-all duration-700"} ${
        state === "hidden"
          ? "translate-y-8 opacity-0"
          : "translate-y-0 opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

### Verify

> ⚠️ **`--disable-javascript` does not work.** Chrome silently ignores the flag in both
> `--headless` and `--headless=new` (verified: a page whose script rewrites the DOM still shows
> the rewritten text). Any "no-JS" screenshot taken with it is really a normal render, and an
> apparently blank page is a rendering race, not proof of a no-JS failure. Use one of the two
> methods below instead.

**Method 1 — assert on the SSR HTML (fastest, and the real proof):**

```bash
npm run build && npm start
for p in contact hiring competition team; do
  html=$(curl -s "http://localhost:3000/$p")
  printf '/%-12s opacity-0:%s translate-y-8:%s\n' "$p" \
    "$(printf '%s' "$html" | grep -c 'opacity-0')" \
    "$(printf '%s' "$html" | grep -c 'translate-y-8')"
done
```

Both counts must be **0** on every route, and the page's real content must be present in that
HTML. This is deterministic and needs no browser.

**Method 2 — render genuinely script-free HTML (for a visual):**

```bash
curl -s http://localhost:3000/contact \
  | perl -0777 -pe 's{<script\b.*?</script>}{}gis; s{<script\b[^>]*/?>}{}gi' \
  | perl -0777 -pe 's{<head>}{<head><base href="http://localhost:3000/">}i' > /tmp/nojs.html
# then screenshot file:///tmp/nojs.html
```

The `<base>` tag is required or the stylesheet won't resolve. `/contact`, `/hiring`,
`/competition` and `/team` must all render their full content, and the hiring popup must NOT
appear (it needs JS by design).

### Related

Consider whether `ScrollReveal` earns its place at all — see [P2-3](#p2-3--delete-the-template-chrome).
A fade-and-slide-up on every section is one of the clearest markers of a generated page. Keeping
it on two or three deliberate moments is better than keeping it on twelve.

---

## P0-2 — No `og:image` on any shared link

**File:** `app/layout.tsx:22-34`

### Problem

`metadata.openGraph` sets `title`, `description` and `type` but no `images`. `twitter:card` is
`summary`, not `summary_large_image`. No page sets its own OG image either. There is no
`apple-touch-icon`.

### Impact

QUANTT recruits through Instagram and LinkedIn — the `/hiring` primary CTA is literally
"Follow on Instagram". Every link the club shares on either platform renders as a bare text
stub with no image. This is the largest brand-surface gap on the site and the cheapest to close.

### Fix

1. Produce a 1200×630 OG image (the wordmark on the navy gradient is enough to start) and save
   it to `public/images/og-default.png`. A 180×180 `public/apple-touch-icon.png` as well.

2. Wire it up:

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://quantt.ca"), // ← set to the real production origin
  title: "QUANTT — Queen's University Algorithmic Network & Trading Team",
  description:
    "Bridging academic research and industry practice through collaboration, research, and real-world application in quantitative finance.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "QUANTT — Queen's University Algorithmic Network & Trading Team",
    description:
      "Bridging academic research and industry practice in quantitative finance.",
    type: "website",
    siteName: "QUANTT",
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "QUANTT — Queen's University Algorithmic Network & Trading Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QUANTT — Queen's University Algorithmic Network & Trading Team",
    description:
      "Bridging academic research and industry practice in quantitative finance.",
    images: ["/images/og-default.png"],
  },
};
```

3. `metadataBase` is required for the relative image URLs to resolve to absolute ones. Without
   it Next logs a warning and scrapers get a relative path they cannot fetch.

4. Give `/hiring` its own OG image or at least its own OG title/description, since that is the
   page actually being shared during a recruiting round.

### Verify

```bash
curl -s http://localhost:3000/ | grep -iE 'og:image|twitter:'
```

Then paste the production URL into the LinkedIn Post Inspector and the Facebook Sharing
Debugger and confirm the card renders with an image.

---

## P0-3 — Text contrast below WCAG AA

### Problem

Ten text/background pairs fall below the 4.5:1 minimum. All of them are 10–12px type, so the
3:1 "large text" exemption does not apply to any of them.

Ratios computed against the actual composited background (alpha layers resolved against the
gradient underneath):

| Ratio | Element | File |
|------:|---------|------|
| **1.47** | Footer copyright — `text-blue-mid` `#1e3360` on `bg-navy` `#0a1628` | `components/Footer.tsx:57` |
| **2.34** | Mission "Club Photo" label — `white/30` | `components/Mission.tsx:25` |
| **2.31** | Hiring portfolio index numbers — `blue-light/60` | `app/hiring/page.tsx:52` |
| **2.30** | `.g-muted` `#6b7a8e` on a glass card (2.83 on the bare gradient) | `app/globals.css:25` |
| **4.04** | Hiring tech-tag chips — `text-[10px] text-white/50` on a `white/[0.04]` chip | `app/hiring/page.tsx:77` |
| **3.03** | BlogCard author — `white/40` | `components/BlogCard.tsx:19` |
| **3.14** | Past-partner description — `white/40` | `components/PartnerCard.tsx:44` |
| **3.22** | Footer tagline — `text-text-light/60` | `components/Footer.tsx:21` |
| **3.76** | `.g-body` `#8a9fc4` **when used on a glass card** | `app/globals.css:24` |
| **3.79** | Popup "Maybe later" — `white/40` | `components/HiringPortfoliosPopup.tsx:236` |
| **4.05** | Past-partner name `white/50`; "Coming soon" empty states | `components/PartnerCard.tsx:41`, `app/blog/page.tsx` |
| **4.32** | Three Pillars section label — `white/50` | `components/ThreePillars.tsx:31` |
| **4.49** | Popup counter — `white/45` | `components/HiringPortfoliosPopup.tsx:166` |

### The underlying rule

Solved for the minimum white alpha that reaches AA on each surface in this system:

| Surface | AA (4.5:1) | AAA (7:1) |
|---------|-----------|----------|
| `bg-navy` (footer) | `white/46` | `white/60` |
| Glass card over blue-mid (`white/[0.07]`) | `white/58` | `white/80` |
| Glass card over blue-mid (`white/[0.04]`) | `white/55` | `white/76` |
| Bare gradient midpoint (`blue-mid`) | `white/52` | `white/71` |
| Gradient end (`blue-grey`) | `white/49` | `white/66` |

> **Adopt one rule: no text below `white/60`.** That clears AA on every surface in the system
> including the worst case (glass card over blue-mid at `white/58`), so nobody has to re-derive
> it per component.
>
> Headroom is thin, though: `white/60` on a `white/[0.07]` card over blue-mid is **4.78**, only
> 0.28 above the bar. Any future glass surface above roughly `white/[0.09]` over blue-mid breaks
> the rule's guarantee — the floor is safe for the surfaces that exist today, not universally.

> ⚠️ **Measure against the right gradient stop.** `GradientBackground` has two variants and they
> do not share stops:
> `full` = `from-navy via-blue-mid via-50% to-blue-grey`, `short` = `from-navy via-blue-mid to-blue-grey/80`.
> **Neither passes through `--color-navy-mid` `#0f1d35`** — that color appears only in the *hero's*
> `bg-gradient-to-br from-navy via-navy-mid to-primary`.
> An earlier pass of this audit measured `/hiring` against navy-mid and understated two failures
> as a result: the portfolio index numbers scored 2.72 instead of 2.31, and the tech-tag chips
> scored 4.85 (an apparent pass) instead of 4.04 (a fail). Mid-page content on any inner route
> sits over `--color-blue-mid` `#1e3360`, which is the darkest-contrast case. Always test there.

### Fix

**Token changes** — `app/globals.css:22-25`:

```css
/* General-purpose text colors that work on the gradient.
   Values chosen to clear 4.5:1 on the worst surface in the system
   (a white/[0.07] glass card over --color-blue-mid). */
.g-heading { color: #ffffff; }   /* unchanged */
.g-body    { color: #b3c2da; }   /* was #8a9fc4 — 3.75 on cards, now 5.57 */
.g-muted   { color: #9fb2d0; }   /* was #6b7a8e — 2.30 on cards, now 4.67 */
```

Also bump the shared token, which is used at 10–12px in many places:

```css
--color-text-light: #9fb2d0;  /* was #8a9fc4 */
```

**Per-component changes:**

```diff
  // components/Footer.tsx:57
- <p className="text-[10px] text-blue-mid">
+ <p className="text-[11px] text-text-light">          {/* 1.47 → 6.77 */}

  // components/Footer.tsx:21
- <p className="mt-1 text-[10px] text-text-light/60">
+ <p className="mt-1 text-[11px] text-text-light">     {/* 3.22 → 6.77 */}

  // app/hiring/page.tsx:52
- <span className="font-heading text-sm text-blue-light/60">
+ <span className="font-heading text-sm text-blue-accent">  {/* 2.31 → 8.40 */}

  // app/hiring/page.tsx:77  — tech-tag chips
- className="… bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase … text-white/50"
+ className="… bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase … text-white/60"

  // components/BlogCard.tsx:19
- <p className="mt-3 text-[10px] text-white/40">By {post.author}</p>
+ <p className="mt-3 text-xs text-white/60">By {post.author}</p>

  // components/HiringPortfoliosPopup.tsx:166
- <p className="mt-1 text-xs text-white/45">
+ <p className="mt-1 text-xs text-white/60">

  // components/HiringPortfoliosPopup.tsx:236
- className="text-xs text-white/40 transition-colors hover:text-white/70"
+ className="text-xs text-white/60 transition-colors hover:text-white"

  // components/ThreePillars.tsx:31
- <span className="text-white/50">What We Do</span>
+ <span className="text-white/60">What We Do</span>
```

**`components/PartnerCard.tsx:34,41,44`** — do not signal "past partner" by dimming the text
below legibility. Keep the text at full contrast and dim only the logo:

```diff
- <h3 className={`text-sm font-semibold ${muted ? "text-white/50" : "text-white"}`}>
+ <h3 className="text-sm font-semibold text-white">
    {partner.name}
  </h3>
- <p className={`mt-1 text-xs leading-relaxed ${muted ? "text-white/40" : "text-white/60"}`}>
+ <p className="mt-1 text-xs leading-relaxed text-white/60">
```

The `opacity-40` already applied to the logo (line 26) plus the "Past Partners" heading is
enough to convey the state.

**`components/Mission.tsx:25`** — the real fix is to remove the placeholder entirely. See
[P2-4](#p2-4--rewrite-the-copy).

### Verify

A reusable checker is worth keeping in the repo:

```python
# scripts/contrast.py
def hx(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def over(fg, a, bg):
    return tuple(round(fg[i]*a + bg[i]*(1-a)) for i in range(3))

def lum(c):
    def f(v):
        v /= 255
        return v/12.92 if v <= 0.03928 else ((v+0.055)/1.055)**2.4
    r, g, b = (f(x) for x in c)
    return 0.2126*r + 0.7152*g + 0.0722*b

def ratio(a, b):
    l1, l2 = sorted((lum(a), lum(b)), reverse=True)
    return (l1+0.05) / (l2+0.05)
```

Run it over every `text-*` / surface pairing and assert `>= 4.5`.

---

## P0-4 — Contradictory and stale recruiting messages

**Files:** `content/config.yml`, `app/contact/page.tsx:22-33`, `app/hiring/page.tsx:30-33`

### Problem

Two different recruiting messages are live at the same time and they contradict each other:

- **`/contact`** renders a green banner: *"We're Recruiting! — Applications open until
  **April 15, 2026**"* with an "Apply Now" button pointing at Linktree. Driven by
  `content/config.yml`:

  ```yaml
  recruiting: true
  recruitingDetails: "Applications open until April 15, 2026"
  recruitingUrl: "https://linktr.ee/quantt"
  ```

- **`/hiring`** says applications *"will be posted on Instagram shortly"* and the CTA is
  "Follow on Instagram".

As of today the April 15 2026 deadline is five months stale and still rendering.

### Fix

1. Decide which channel is authoritative for this cycle. Given `/hiring` is the newer, better
   page and the club's own copy points at Instagram, make that the single source.

2. Either set `recruiting: false` in `content/config.yml`, or point the banner at `/hiring`
   rather than Linktree so both surfaces tell the same story:

   ```yaml
   recruiting: true
   recruitingDetails: "Analyst applications for 2026–2027 open soon — details on Instagram."
   recruitingUrl: "/hiring"
   ```

3. **Dead config:** `content/config.yml` defines `copyright: "2026 QUANTT"` but
   `components/Footer.tsx:57` uses `new Date().getFullYear()`. Remove the key or use it.

4. **Add a guard against this recurring.** Any recruiting banner with a date should carry an
   expiry so a stale deadline cannot render:

   ```yaml
   recruiting: true
   recruitingDetails: "Applications open until April 15, 2027"
   recruitingUntil: "2027-04-15"
   ```

   ```tsx
   // app/contact/page.tsx
   const isOpen =
     config.recruiting &&
     (!config.recruitingUntil ||
       new Date(config.recruitingUntil + "T23:59:59") >= new Date());
   ```

---

## P0-5 — No focus styles, no reduced-motion support

### Problem A — focus

There is **one** `.focus()` call in the entire codebase
(`components/HiringPortfoliosPopup.tsx:105`) and **zero** `focus-visible:` styles. Every link,
button, tab and accordion trigger falls back to the browser's default ring, which is undesigned
against the navy palette and low-contrast in several places.

### Fix A

Add a global default rather than patching each component. In `app/globals.css`:

```css
/* Keyboard focus is designed once, here, so every control inherits it. */
@layer base {
  :focus-visible {
    outline: 2px solid var(--color-blue-accent);
    outline-offset: 2px;
    border-radius: 2px;
  }
}
```

`--color-blue-accent` (`#c8d6ea`) clears 8.4:1 against the mid-gradient and 12.3:1 against navy,
so it is visible on every surface in the system. Add explicit
`focus-visible:ring-2 focus-visible:ring-blue-accent` to controls that need a tighter ring
(the popup's circular buttons, the year tabs).

### Problem B — reduced motion

`prefers-reduced-motion` is honored in exactly one place
(`components/HiringPortfoliosPopup.tsx:40`). Three other sources of motion ignore it:

| Source | File | Behavior |
|--------|------|----------|
| `ScrollReveal` | `components/ScrollReveal.tsx` | 700ms fade-and-slide on 12 sections |
| `RotatingText` | `components/RotatingText.tsx:12-18` | Infinite 3s loop, no pause control |
| `ParticleCanvas` | `components/ParticleCanvas.tsx` | Continuous `requestAnimationFrame` |

`RotatingText` is additionally a **WCAG 2.2.2 (Pause, Stop, Hide)** failure: it auto-updates
indefinitely with no mechanism to pause it.

### Fix B

`ScrollReveal` is handled by [P0-1](#p0-1--content-is-invisible-without-javascript).

**`components/RotatingText.tsx`** — stop rotating under reduced motion, and stop when the tab
is hidden:

```tsx
"use client";

import { useEffect, useState } from "react";

const phrases = ["Quantitative Finance", "Algo Trading", "Data Science"];

export default function RotatingText() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return; // show phrases[0] and stop

    let fadeTimer: number | undefined;
    const interval = window.setInterval(() => {
      if (document.hidden) return; // don't burn cycles in a background tab
      setVisible(false);
      fadeTimer = window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % phrases.length);
        setVisible(true);
      }, 500);
    }, 3000);

    return () => {
      window.clearInterval(interval);
      if (fadeTimer) window.clearTimeout(fadeTimer);
    };
  }, []);

  return (
    <span
      className={`inline-block bg-gradient-to-r from-blue-light to-blue-accent bg-clip-text text-transparent transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {phrases[index]}
    </span>
  );
}
```

> The existing implementation also leaks its inner `setTimeout` if the component unmounts
> mid-fade. The cleanup above fixes that.

`ParticleCanvas` is covered in [P1-5](#p1-5--performance-particle-canvas-and-scroll-handler).

### Problem C — the modal has no focus trap

`components/HiringPortfoliosPopup.tsx` sets `aria-modal="true"`, handles Escape, locks body
scroll and focuses the close button — all correct. But **Tab walks straight out of the dialog**
into the page behind it, which is not `inert` and not `aria-hidden`.

### Fix C

If the popup survives [P2-1](#p2-1--remove-the-interstitial), add a trap:

```tsx
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape") { e.preventDefault(); close(); return; }
  if (e.key === "ArrowRight") { e.preventDefault(); navigate(1, true); return; }
  if (e.key === "ArrowLeft") { e.preventDefault(); navigate(-1, true); return; }
  if (e.key !== "Tab") return;

  const root = dialogRef.current;
  if (!root) return;
  const focusables = root.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
};
```

Also restore focus to whatever was focused before the dialog opened, on close.

### Problem D — decorative glyphs are announced

`components/ThreePillars.tsx:39` renders `✦ ◆ ▶` inside a plain `<div>` with no
`aria-hidden`. Screen readers announce these as "black right-pointing triangle" and similar.

### Fix D

Covered by [P1-4](#p1-4--replace-emoji-and-glyph-icons-normalize-partner-logos) — replace with
SVGs carrying `aria-hidden="true"`.

---

## P0-6 — Touch targets below 44px, and missing `cursor-pointer`

### Problem A — target sizes

Measured against the 44×44px minimum:

| Control | File | Current size |
|---------|------|--------------|
| Popup pagination dots | `HiringPortfoliosPopup.tsx:213` | **6×6px** (`h-1.5 w-1.5`) |
| Popup prev / next | `HiringPortfoliosPopup.tsx:192,199` | **32×32px** (`h-8 w-8`) |
| Popup close `×` | `HiringPortfoliosPopup.tsx:157` | **~20×20px** (no padding) |
| Mobile menu rows | `Navbar.tsx:120` | **~40px** (`py-3` on `text-sm`) |

The mobile hamburger (`h-11 w-11` = 44px) is correct.

### Fix A

Keep the visual size, expand the hit area with transparent padding:

```diff
  {/* dots — visual size unchanged, hit area now 44px tall */}
  <button
    key={p.slug}
    onClick={() => navigate(i)}
    aria-label={`Go to ${p.title}`}
    aria-current={i === index ? "true" : undefined}
-   className={`h-1.5 rounded-full transition-all duration-300 ${
-     i === index ? "w-5 bg-blue-light" : "w-1.5 bg-white/25 hover:bg-white/45"
-   }`}
+   className="group -my-5 cursor-pointer px-1 py-5"
  >
+   <span
+     className={`block h-1.5 rounded-full transition-all duration-300 ${
+       i === index
+         ? "w-5 bg-blue-light"
+         : "w-1.5 bg-white/35 group-hover:bg-white/60"
+     }`}
+   />
  </button>
```

```diff
  {/* prev / next */}
- className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 …"
+ className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 …"
```

```diff
  {/* close */}
- className="absolute right-4 top-4 text-xl leading-none text-white/40 transition-colors hover:text-white"
+ className="absolute right-2 top-2 flex h-11 w-11 cursor-pointer items-center justify-center text-xl leading-none text-white/60 transition-colors hover:text-white"
```

```diff
  {/* Navbar.tsx mobile menu rows */}
- className={`block py-3 text-sm ${…}`}
+ className={`block py-3.5 text-base ${…}`}
```

> The `×` character is also being used as a glyph. `&times;` reads as "multiplication sign" —
> the `aria-label="Close"` already present covers it, so this is fine, but an inline SVG is
> cleaner and matches [P1-4](#p1-4--replace-emoji-and-glyph-icons-normalize-partner-logos).

### Problem B — nothing looks clickable

`cursor-pointer` appears **zero** times in the codebase. Tailwind's preflight sets
`cursor: default` on `<button>`, so the accordion triggers, year tabs and every popup control
do not show a pointer on hover.

### Fix B

Add a base rule rather than 20 individual classes:

```css
/* app/globals.css */
@layer base {
  button:not(:disabled),
  [role="button"]:not([aria-disabled="true"]) {
    cursor: pointer;
  }
}
```

### Verify

Chrome DevTools → Lighthouse → Accessibility, and the "Tap targets are sized appropriately"
audit under the mobile profile.

---

# P1 — System

## P1-1 — One container width

### Problem

Every page picks its own container width, and none of them match the chrome. The navbar and
footer are `max-w-7xl` on all pages:

| Surface | Width | File |
|---------|-------|------|
| Navbar | `max-w-7xl` (1280) | `components/Navbar.tsx:42` |
| Footer | `max-w-7xl` (1280) | `components/Footer.tsx:10` |
| Home sections | `max-w-7xl` (1280) | `Mission.tsx`, `ThreePillars.tsx`, `UpcomingEvents.tsx` |
| Team | `max-w-5xl` (1024) | `app/team/page.tsx:282` |
| Competition | `max-w-5xl` (1024) | `app/competition/page.tsx:81` |
| Partners | `max-w-5xl` (1024) | `app/partners/page.tsx:18` |
| Education | `max-w-4xl` (896) | `app/education/page.tsx:97` |
| Hiring | `max-w-3xl` (768) | `app/hiring/page.tsx:21` |
| Contact | `max-w-3xl` (768) | `app/contact/page.tsx:17` |
| Blog | `max-w-3xl` (768) | `app/blog/page.tsx:18` |

Measured at 1440px: nav logo left edge at **104px**, team content at **232px**, education at
**296px**. The logo never lines up with the content beneath it, on any inner page.

### Problem — the hero is not on the grid either

`components/Hero.tsx:8,43`. The section is `flex` and the content block is
`mx-auto max-w-7xl` — as a flex item it is shrink-to-fit, so `mx-auto` centers it on its own
content width rather than aligning it to the 1280px column. It renders at **x≈399** on a 1440px
screen instead of 104px.

Its horizontal position is set by the pixel width of the headline's first line, so any copy
change moves the entire block. Adding `w-full` or `min-w-0` does **not** fix this — verified.

### Fix

**1. Pick one content width.** `max-w-5xl` (1024) is the right call: it suits the team and
partner grids, and text columns inside it can be narrowed per-section. Apply it to every page,
and change the navbar and footer to match so the grid is visible and consistent.

**2. Keep prose narrow inside it.** At `max-w-3xl` (768px) and 14px, the hiring body copy runs
~95–100 characters per line, above the <80 guideline. Let the *page* be 1024 and constrain
*paragraphs* to `max-w-[65ch]`.

**3. Fix the hero** by moving `flex` onto the constrained container instead of the section:

```diff
  // components/Hero.tsx:8
- <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-navy via-navy-mid to-primary">
+ <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-navy via-navy-mid to-primary">

  … background layers unchanged …

  // components/Hero.tsx:43
- <div className="relative z-10 mx-auto max-w-7xl px-6 py-32">
+ <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl items-center px-6 py-32">
+   <div>
      … hero content …
+   </div>
  </div>
```

The container is now a block-level element at the full column width, so `mx-auto` aligns it to
the grid, and vertical centering is preserved by the inner flex.

**4. Kill the dead gradient.** `GradientBackground` applies `min-h-screen`
(`components/GradientBackground.tsx:20`), so sparse pages render a large empty void before the
footer: `/blog` is ~300px of content followed by ~900px of nothing; `/contact` and
`/competition` are similar. Use `min-h-[60vh]` for the `short` variant, or drop `min-h-screen`
and let the body background carry the color so the footer sits directly under the content.

---

## P1-2 — Collapse seven glass surfaces into one component

### Problem A — seven "same" surfaces

`GlassCard` exists (`components/GlassCard.tsx`) but is used in only **2 of ~10** card contexts
(`ThreePillars.tsx:37`, `app/education/page.tsx:115,132`). Everywhere else the styles are
hand-copied, and they have already drifted:

| Count | Recipe | Where |
|------:|--------|-------|
| 5 | `border-white/15 bg-white/[0.06]` | team page cards, competition cards |
| 5 | `border-white/10 bg-white/[0.07]` | `GlassCard`, BlogCard, UpcomingEvents, PartnerCard, YearTabs |
| 5 | `border-white/10 bg-white/[0.04]` | empty states, hiring tech tags, muted partners |
| 3 | `border-white/5 bg-white/[0.02]` | education track panels |
| 3 | `border-white/15 bg-white/[0.08]` | avatar circles, pillar icon rings |
| 1 | `border-white/15 bg-white/[0.1]` | TeamMemberCard |
| 1 | `border-white/10 bg-white/[0.05]` | Mission photo placeholder |

Three of these are the *same* semantic surface — a content card — rendered three different ways.

### Fix A

Give `GlassCard` real variants and route every card through it:

```tsx
// components/GlassCard.tsx
import { ReactNode } from "react";

type Elevation = "flat" | "raised" | "sunken";

const surfaces: Record<Elevation, string> = {
  // sunken  — a panel nested inside another card (education track panels)
  sunken: "border-white/10 bg-white/[0.03]",
  // flat    — the default content card
  flat: "border-white/10 bg-white/[0.06]",
  // raised  — a card that sits above its siblings (featured, selected)
  raised: "border-white/20 bg-white/[0.10]",
};

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  elevation?: Elevation;
  interactive?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  elevation = "flat",
  interactive = false,
}: GlassCardProps) {
  return (
    <div
      className={`rounded-lg border backdrop-blur-md ${surfaces[elevation]} ${
        interactive
          ? "transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.09]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

Migrate `BlogCard`, `PartnerCard`, `TeamMemberCard`, `UpcomingEvents`, and the inline cards in
`app/team/page.tsx` and `app/competition/page.tsx` onto it.

> Note the `interactive` variant changes *color* rather than translating the card.
> `hover:-translate-y-0.5` on every card is one of the generic tells — see
> [P2-3](#p2-3--delete-the-template-chrome).

### Problem B — four radii with no rule

| Radius | Used for |
|--------|----------|
| `rounded` (4px) | buttons |
| `rounded-md` (6px) | year tabs, "Research Paper" buttons |
| `rounded-lg` (8px) | cards |
| `rounded-xl` (12px) | the modal |

### Fix B

Two radii, assigned semantically. Add to `@theme` in `app/globals.css`:

```css
  /* Radii: controls get one value, containers get the other. No third option. */
  --radius-control: 0.375rem;   /* 6px — buttons, tabs, tags, inputs */
  --radius-surface: 0.625rem;   /* 10px — cards, panels, dialogs */
```

Then `rounded-[--radius-control]` / `rounded-[--radius-surface]` everywhere.
`rounded-full` stays for avatars and dots.

### Problem C — five unrelated greens and an orphan yellow

```
4× emerald-400   app/education/page.tsx   (trading track dot, arrows)
1× emerald-500   app/education/page.tsx   (icon tile background)
2× green-300     app/hiring/page.tsx, HiringPortfoliosPopup.tsx  ("Now Hiring")
2× green-400     app/contact/page.tsx     (recruiting banner)
1× green-600 / green-700  components/PortfolioCard.tsx (status pill — dead code)
   yellow-400    app/competition/page.tsx (winner state)
```

None of these are in the palette. `app/globals.css:4-15` defines the token set and then the
components reach past it.

### Fix C

Add semantic tokens and use them:

```css
  /* Semantic accents — the only non-blue colors in the system */
  --color-accent-positive: #34d399;  /* open / active / trading track */
  --color-accent-highlight: #fbbf24; /* award, winner */
```

Then: `text-accent-positive`, `bg-accent-positive/10`, etc. One green, one gold, both named
for what they mean rather than what they look like.

### Problem D — two parallel text-color systems

`app/globals.css:22-25` defines `.g-heading` / `.g-body` / `.g-muted`, which duplicate the
Tailwind utilities `text-white` / `text-text-light`. Both are in use, sometimes in the same
file for the same role — `app/team/page.tsx` uses `g-heading` on line 44 and `text-white` on
line 288 for equivalent headings.

### Fix D

Delete the `.g-*` classes. Move their values into `@theme` as semantic color tokens so there is
one system:

```css
@theme {
  …
  --color-fg:       #ffffff;   /* headings */
  --color-fg-body:  #b3c2da;   /* body copy */
  --color-fg-muted: #9fb2d0;   /* secondary / meta */
}
```

Then `text-fg`, `text-fg-body`, `text-fg-muted`. Replace all 25 `.g-*` usages.

### Problem E — dead code

`components/PortfolioCard.tsx` is imported nowhere. It is also styled for a light background
(`text-text-dark` `#0f1d35` on `bg-white/30`) that does not exist anywhere on the site — if it
were ever rendered it would be illegible.

`--color-text-dark`, `--color-text-dark-body` and `--color-blue-accent` in
`app/globals.css:11,14,15` exist mainly to serve it.

### Fix E

```bash
git rm components/PortfolioCard.tsx
```

Then drop `--color-text-dark` and `--color-text-dark-body`. Keep `--color-blue-accent` — it is
used by `ThreePillars` and is the right focus-ring color (see
[P0-5](#p0-5--no-focus-styles-no-reduced-motion-support)).

---

## P1-3 — Raise the type scale

### Problem

The scale is concentrated at the bottom with nothing in the middle:

| Size | Instances |
|------|----------:|
| `text-sm` (14px) | 43 |
| `text-xs` (12px) | 34 |
| `text-[10px]` | 20 |
| `text-[11px]` | 7 |
| `text-base` (16px) | 4 |
| `text-lg` (18px) | 10 |
| `text-xl` – `text-2xl` | 8 |
| `text-3xl` – `text-7xl` (display) | 12 |

**104 instances at ≤14px. 27 at ≤11px.** Body copy is 14px, below the 16px floor, and there is
almost nothing between 18px and 36px. On a 1440px screen the result is a large dark canvas with
small grey text huddled in the left third.

### Fix

Define the scale once, then migrate:

```css
/* app/globals.css — @theme */
  --text-meta:    0.8125rem;  /* 13px — timestamps, tags, captions. Floor. */
  --text-body:    1rem;       /* 16px — all body copy */
  --text-lead:    1.125rem;   /* 18px — intros, card descriptions */
  --text-h3:      1.375rem;   /* 22px */
  --text-h2:      1.75rem;    /* 28px */
  --text-h1:      2.5rem;     /* 40px */
  --text-display: 3.75rem;    /* 60px — hero only */
```

Migration rules:

- Every `text-[10px]` and `text-[11px]` → `text-meta` (13px). **Nothing below 13px.**
- Body paragraphs currently `text-sm` → `text-body` (16px).
- Card descriptions currently `text-xs` → `text-meta` or `text-body` depending on role.
- Section headings currently `text-lg`/`text-2xl` → `text-h2`.
- Keep display sizes as they are.

Add `line-height` with it — serif body wants more leading than sans:

```css
  --leading-body: 1.6;
  --leading-tight: 1.15;   /* display */
```

### Related: mobile headline breaks badly

`components/Hero.tsx:50-53` hard-codes `<br />` between "Tomorrow's Talent in" and the rotating
phrase. At 390px this yields:

```
Tomorrow's Talent
in
Quantitative
Finance
```

— an orphaned "in" on its own line, and the rotating phrase wrapping unpredictably because the
three phrases have different lengths.

Fix: drop the `<br />`, let the line break naturally, and add `text-balance`:

```diff
- <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
-   Tomorrow&apos;s Talent in
-   <br />
-   <RotatingText />
- </h1>
+ <h1 className="mt-4 max-w-[14ch] text-balance font-heading text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
+   Tomorrow&apos;s Talent in <RotatingText />
+ </h1>
```

Check all three phrases at 390px, 768px and 1440px — the longest is "Quantitative Finance".

---

## P1-4 — Replace emoji and glyph icons, normalize partner logos

### Problem A — emoji as icons

| Emoji | File | Context |
|-------|------|---------|
| 📈 | `app/education/page.tsx:118` | Trading Track tile |
| 💻 | `app/education/page.tsx:135` | Development Track tile |
| 🏆 | `app/competition/page.tsx:42` | Winner badge |

Emoji render differently on every OS, cannot be color-matched to the palette, and are announced
by screen readers ("chart increasing", "trophy").

### Problem B — glyphs as icons

| Glyph | File | Context |
|-------|------|---------|
| `✦ ◆ ▶` | `components/ThreePillars.tsx:7,12,17` | Pillar icons — in a bare `<div>`, no `aria-hidden` |
| `▾` | `components/Accordion.tsx:35` | Accordion chevron |
| `‹ ›` | `HiringPortfoliosPopup.tsx:195,202` | Carousel arrows |
| `→ ↗ ↓` | 8 locations | Appended to link text — see [P2-3](#p2-3--delete-the-template-chrome) |

`✦ ◆ ▶` are also meaningless as symbols — a diamond does not say "research".

### Fix

Install an icon set and use inline SVG with `aria-hidden="true"`:

```bash
npm install lucide-react
```

```tsx
// components/ThreePillars.tsx
import { Users, LineChart, Cpu } from "lucide-react";

const pillars = [
  {
    Icon: Users,
    title: "Collaboration",
    description: "…",
  },
  { Icon: LineChart, title: "Research", description: "…" },
  { Icon: Cpu, title: "Application", description: "…" },
];

// in the map:
<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-blue-accent">
  <pillar.Icon size={18} strokeWidth={1.5} aria-hidden="true" />
</div>
```

Same treatment for `TrendingUp` / `Code2` on `/education`, `Trophy` on `/competition`, and
`ChevronDown` / `ChevronLeft` / `ChevronRight` for the accordion and carousel.

### Problem C — partner logos are not normalized

`components/PartnerCard.tsx:19-31` puts every logo in an identical `180×56` white chip with
`object-contain`. But the source assets have wildly different aspect ratios and internal
padding, so the rendered logos differ by ~2× in optical weight:

- Ontario Teachers' Pension Plan — fills the box
- Connor, Clark & Lunn — renders ~90px wide and is illegible at that size
- National Bank of Canada — ~110px

Identical frames plus inconsistent logo scale reads as partner *tiering* when it is just asset
sizing. `public/images/partners/nbc.jpg` is also the lone JPEG among PNGs.

### Fix

1. Re-export each logo as a transparent PNG or SVG, trimmed to its own bounding box, on a
   consistent optical scale — match by *visual weight*, not by bounding box. A wordmark-only
   lock-up should be wider than a mark-plus-wordmark.
2. Convert `nbc.jpg` → `nbc.png` (or SVG) so the whole set is consistent.
3. Increase the chip to give small marks room, and set a per-logo scale hint in
   `content/partners.yml` if a single treatment cannot serve all five:

   ```yaml
   - name: Connor, Clark & Lunn
     logo: /images/partners/ccl.png
     logoScale: 1.3   # optional optical correction
   ```

---

## P1-5 — Performance: particle canvas and scroll handler

### Problem A — unbounded O(n²) animation loop

`components/ParticleCanvas.tsx:25,46-72`

- 60 particles, nested loop → **1,770 distance calculations per frame**, ~106,000/second at 60fps.
- `requestAnimationFrame` never stops: it keeps running when the hero is scrolled out of view,
  and when the browser tab is backgrounded.
- The mobile bail-out (`line 16`) is evaluated **once at mount**. A desktop window resized
  narrow keeps animating; a phone rotated into landscape never starts.
- Each connection does `beginPath` / `stroke` separately — 1,770 individual stroke calls per
  frame rather than batching by alpha bucket.

### Fix A

```tsx
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const smallQuery = window.matchMedia("(max-width: 768px)");

  let animationId: number | null = null;
  let particles: Particle[] = [];

  const shouldRun = () =>
    !motionQuery.matches && !smallQuery.matches && !document.hidden;

  const stop = () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  const start = () => {
    if (animationId === null && shouldRun()) {
      animationId = requestAnimationFrame(draw);
    }
  };

  // Pause whenever the hero scrolls off screen.
  const io = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? start() : stop()),
    { threshold: 0 }
  );
  io.observe(canvas);

  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);
  motionQuery.addEventListener("change", () => (shouldRun() ? start() : stop()));
  smallQuery.addEventListener("change", () => (shouldRun() ? start() : stop()));

  // …init() / draw() as before…

  return () => {
    stop();
    io.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("resize", resize);
  };
}, []);
```

Additionally: drop `particleCount` to ~40 (the visual difference is negligible, the loop cost
falls by 55%), and consider a spatial grid if you keep 60+.

> If [P2-2](#p2-2--rebuild-the-hero-around-the-actual-subject-matter) lands, this component may
> be deleted outright — do the cheap guards now, decide on the rewrite separately.

### Problem B — unthrottled scroll handler

`components/Navbar.tsx:26-33` fires **three** `setState` calls on every scroll event. It is
correctly `passive`, but React re-renders far more than necessary.

### Fix B

Coalesce into one state object and gate on `requestAnimationFrame`:

```tsx
useEffect(() => {
  let ticking = false;
  const lastY = { current: 0 };

  const handleScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      setNav({
        scrolled: y > 50,
        hidden: y > lastY.current && y > 100,
      });
      lastY.current = y;
      ticking = false;
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

---

## P1-6 — Navigation overlap and fake tabs

### Problem A — duplicate content under two labels

`/team` ("Who We Are") renders project teams with their project managers and research paper
links. `/competition` renders the *same* project teams with the *same* research paper links.
Both read from `getTeamYears()` and `config.researchPapers`.

Eight top-level nav items is already a lot; two of them showing the same data is worse.

### Fix A

Pick one owner for project teams. Suggested split:

- **`/team`** — people. Leadership, roles, members. Link out to project work.
- **`/competition`** — the competition itself. What it is, the yearly result, the papers. Not a
  second team roster.

Then consider folding `Competition` under `Who We Are` or into a single `Research` destination
that also absorbs `Blog`, bringing the nav from 8 items to 5–6.

### Problem B — a tab bar with one tab

`/competition` filters to years that have `projectTeams`, which currently leaves exactly one
(`2025-2026`). `YearTabs` still renders the full tab bar for it.

### Fix B

```tsx
// components/YearTabs.tsx — skip the chrome when there's nothing to switch between
if (tabs.length <= 1) {
  return <>{tabs[0]?.content ?? null}</>;
}
```

### Problem C — tabs are not tabs

`components/YearTabs.tsx:19-29` uses plain `<button>` elements. There is no `role="tablist"`,
no `role="tab"`, no `aria-selected`, no `aria-controls`, no arrow-key navigation, and no URL
state — you cannot link anyone to a specific year.

### Fix C

```tsx
"use client";

import { useState, useRef, type ReactNode } from "react";

export default function YearTabs({ tabs }: { tabs: YearTab[] }) {
  const defaultYear = tabs.find((t) => t.current)?.year ?? tabs[0]?.year;
  const [selected, setSelected] = useState(defaultYear);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  if (tabs.length <= 1) return <>{tabs[0]?.content ?? null}</>;

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = tabs[(i + delta + tabs.length) % tabs.length];
    setSelected(next.year);
    refs.current[next.year]?.focus();
  };

  return (
    <>
      <div role="tablist" aria-label="Academic year" className="mb-10 flex gap-2">
        {tabs.map((tab, i) => (
          <button
            key={tab.year}
            ref={(el) => { refs.current[tab.year] = el; }}
            role="tab"
            id={`tab-${tab.year}`}
            aria-selected={selected === tab.year}
            aria-controls={`panel-${tab.year}`}
            tabIndex={selected === tab.year ? 0 : -1}
            onClick={() => setSelected(tab.year)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`cursor-pointer rounded-[--radius-control] px-4 py-2 text-sm font-medium transition-colors ${
              selected === tab.year
                ? "bg-primary text-white"
                : "bg-white/[0.07] text-white/70 hover:bg-white/[0.12] hover:text-white"
            }`}
          >
            {tab.year}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.year}
          role="tabpanel"
          id={`panel-${tab.year}`}
          aria-labelledby={`tab-${tab.year}`}
          hidden={selected !== tab.year}
        >
          {tab.content}
        </div>
      ))}
    </>
  );
}
```

Consider syncing `selected` to a `?year=` search param so years are linkable.

### Problem D — the navbar auto-hides

`components/Navbar.tsx:29` hides the nav on any downward scroll past 100px. On a site this
shallow that costs more in orientation than it saves in vertical space.

### Fix D

Remove the `hidden` state and keep the `scrolled` background change. If the space is genuinely
needed, only hide after a larger threshold and a deliberate scroll velocity.

---

# P2 — Design direction

These need a decision, not just a patch.

## P2-1 — Remove the interstitial

**File:** `components/HiringPortfoliosPopup.tsx` (244 lines), mounted globally in
`app/layout.tsx:51`

### Problem

A full-screen modal opens automatically 800ms after landing, **on every page**, blurring out
whatever the visitor came for, to show a carousel of 8 items that are already reachable from
the "Hiring" link in the nav one row above it. It is session-scoped, so it returns on every new
session.

It is competently built — Escape, backdrop click, arrow keys, reduced-motion, pause-on-hover,
scroll lock, `aria-modal`. That is what makes it worse: all of that engineering went into an
interruption. It is the highest-impact UX decision on the site and it works against the
recruiting goal it exists to serve.

### Fix

Delete the component and its mount. Replace with something that does the same job without
blocking:

**Option A (recommended)** — put the open portfolios *in the hero*. If hiring is the priority
this cycle, the homepage should say so above the fold. This also solves
[P2-2](#p2-2--rebuild-the-hero-around-the-actual-subject-matter).

**Option B** — a dismissible inline banner directly under the navbar:

```tsx
// components/HiringBanner.tsx — non-blocking, one line, dismissible
<div className="border-b border-white/10 bg-primary/15 px-6 py-2.5">
  <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
    <p className="text-meta text-white/80">
      Analyst applications for 2026–2027 are open across 8 research portfolios.
    </p>
    <Link href="/hiring" className="…">See the portfolios</Link>
  </div>
</div>
```

**If it stays**, it needs at minimum: the focus trap from
[P0-5](#p0-5--no-focus-styles-no-reduced-motion-support), the touch targets from
[P0-6](#p0-6--touch-targets-below-44px-and-missing-cursor-pointer), and the contrast fixes from
[P0-3](#p0-3--text-contrast-below-wcag-aa). Do not leave it as-is.

---

## P2-2 — Rebuild the hero around the actual subject matter

**File:** `components/Hero.tsx`

### Problem

The hero is: a particle-connection canvas, a decorative polyline with invented data, a 16-column
grid at 4% opacity, and a word rotating through *Quantitative Finance → Algo Trading → Data
Science* in gradient text.

This is the most common "we do algorithmic trading" hero on the internet. Nothing in it is
specific to QUANTT. The polyline is fake data. The particle network means nothing.

What *is* specific and genuinely interesting sits elsewhere in the repo:

- Eight portfolios with real theses — natural gas storage stress in salt caverns, swap-spread
  convergence, earnings IV crush, long/short gamma, credit CEF arbitrage, causal discovery
- Five research papers (`public/papers/`)
- A 10-week dual-track curriculum
- Five named institutional partners

None of it appears above the fold. `Our Work ↓` links to `#pillars`, which is three abstract
nouns — the actual work is two clicks away under a nav item called "Competition".

### Direction

Open with the most characteristic thing in this club's world. Candidates, roughly in order of
how much they'd distinguish the site:

1. **The portfolio theses as the hero.** Set the eight portfolio names as the primary type,
   with a one-line thesis each. That is a hero no other student club can copy, and it doubles
   as the recruiting pitch that [P2-1](#p2-1--remove-the-interstitial) is currently
   interrupting people to deliver.
2. **A real chart from a real paper.** One figure from one of the five PDFs, credited, with the
   paper title. Real data instead of a decorative polyline.
3. **The curriculum as a structure.** Ten weeks is genuinely a sequence — one of the few places
   on this site where numbered markers would be *earned*.

Whatever you choose, remove the fake polyline. Charting invented data on a quantitative
research site undercuts the thing you are selling.

---

## P2-3 — Delete the template chrome

These are the patterns that mark a page as machine-generated. The site has five of them, each
applied systematically.

### A — ALL-CAPS tracked-out eyebrow above every heading

`components/SectionLabel.tsx` (`text-[10px] uppercase tracking-[3px]`), used **12 times** —
once on every page and section:

```
OUR PEOPLE      / Meet the Team
LEARN WITH US   / Curriculum & Education
OUR NETWORK     / Partners
INSIGHTS        / Blog
REACH OUT       / Contact Us
PROJECT TEAMS   / Competition
NOW HIRING      / Join a Portfolio
OUR MISSION     / Closing the Gap
WHAT WE DO      / Three Pillars
COMING UP       / Upcoming Events
```

Every one restates its own heading in different words. None carries information.

**Fix:** delete `SectionLabel` and all 12 usages. Where a label genuinely adds something — a
status, a date, a count — use that content instead. `NOW HIRING` above `Join a Portfolio` could
become `8 open portfolios · applications close March 1`, which is a real fact.

### B — arrows appended to link text

8 locations:

| Text | File |
|------|------|
| `Our Work ↓` | `components/Hero.tsx:76` |
| `LinkedIn →` | `components/TeamMemberCard.tsx:26` |
| `Research Paper ↗` | `app/team/page.tsx:104`, `app/competition/page.tsx:57` |
| `View portfolio details →` | `HiringPortfoliosPopup.tsx:184` |
| `Go to Hiring →` | `HiringPortfoliosPopup.tsx:231` |
| `Facebook →`, etc. | `app/contact/page.tsx:50` |

**Fix:** remove the arrow characters. Where "opens in a new tab" needs signalling, use a real
SVG external-link icon with `aria-hidden` (the `aria-label`s on the paper links are already
correct).

### C — middle-dot meta strings

4 locations: `app/blog/[slug]/page.tsx:42`, `components/Hero.tsx:57`,
`HiringPortfoliosPopup.tsx:167`, `components/UpcomingEvents.tsx:30`.

**Fix:** structure the metadata instead of joining it with `·`. A date and a location are two
facts, not one string.

### D — identical cards for non-identical content

Covered structurally in [P1-2](#p1-2--collapse-seven-glass-surfaces-into-one-component), but
the design question is separate: a person, a company, an article, an event, a job posting and
an abstract noun currently all render in the same box. Hierarchy should be visible — a partner
logo tile and a team member are not the same kind of thing.

### E — fade-and-slide-up on every section

`ScrollReveal` wraps 12 blocks, all at the same 700ms. One orchestrated moment lands better
than twelve scattered ones. After [P0-1](#p0-1--content-is-invisible-without-javascript) makes
above-the-fold content static, consider keeping the reveal on **one** section and removing it
everywhere else.

Related: `hover:-translate-y-0.5` on `GlassCard`, `BlogCard` and `UpcomingEvents` — hover
transitions on every card is the same tell. A color change is enough.

### F — numbered markers that aren't a sequence

`app/hiring/page.tsx:52-53` numbers the portfolios `01`–`08`. Eight independent research
portfolios are a **menu**, not steps. The numbering implies a ranking that does not exist and
pins "Natural Gas Storage Stress" at `01` permanently.

**Fix:** remove the numbers. (The 10-week curriculum on `/education` *is* a sequence — that is
where numbering belongs, and it already uses "Week N" correctly.)

---

## P2-4 — Rewrite the copy

### A — the same sentence, four times

> "Bridging academic research and industry practice through collaboration, research, and
> real-world application"

appears in `app/layout.tsx:25` (metadata), `components/Hero.tsx:61` (hero subhead), and
near-verbatim in `components/Mission.tsx:14-21` and `app/education/page.tsx:106`. Repetition is
not consistency — nothing new is said on the second, third or fourth pass.

**Fix:** say one concrete thing per surface. The hero says what QUANTT *is*. Mission says what
it *does that is hard*. Education says what a member *learns*. No overlap.

### B — live placeholder on the homepage

`components/Mission.tsx:24-26` renders a bordered box containing the literal text
`Club Photo`. This is in production.

**Fix:** ship a real photo, or delete the box and let the mission text run at full width.

### C — CTAs don't name their action

`Get Involved` (`components/Hero.tsx:70`) goes to `/contact`, which is an email address and
four social links. A CTA should say exactly what happens: **`Email the team`**, or better,
**`See open portfolios`** pointing at `/hiring`.

`Our Work ↓` points at three abstract nouns rather than work — see
[P2-2](#p2-2--rebuild-the-hero-around-the-actual-subject-matter).

### D — empty states say nothing

`app/blog/page.tsx`, `app/education/page.tsx` and `app/team/page.tsx` render `Coming soon` or
`TBA`. An empty screen is an invitation to act.

**Fix:**

```diff
- <p className="text-sm text-white/50">Coming soon</p>
+ <p className="text-body text-white/70">
+   Our first research write-ups go up after the winter term.
+   <Link href="/hiring" className="…">Join a portfolio</Link> to write one.
+ </p>
```

### E — unsupported superlative

"Canada's Premier Quantitative Finance Club" appears in `components/Hero.tsx:57` and
`components/Footer.tsx:21`. It is unverifiable and it is the kind of claim that reads as
filler to exactly the institutional audience the partners page is targeting.

**Fix:** replace with something checkable — founding year, number of portfolios, papers
published, partner names, placement outcomes.

### F — voice has no definition

Tone drifts across the site: institutional ("Bridging academic research and industry
practice"), promotional ("Canada's Premier…"), casual ("Maybe later", "Ready to join?",
"We're Recruiting!").

**Fix:** write a short voice definition covering the two audiences (students and institutional
partners) and apply it. Even three bullets and five do/don't examples would hold the site
together.

---

## P2-5 — Let `/hiring` set the direction

`app/hiring/page.tsx` is the best-designed page on the site and the only one that escapes the
card kit: hairline-ruled sections (`border-t border-white/10 py-10`), real prose at a readable
measure, a genuine type hierarchy, and content that is actually about quantitative finance.

It reads like a different, better website.

**Direction:** apply its treatment to `/education`, `/competition` and `/team`. Structural
devices — rules, spacing, weight, measure — carrying the hierarchy, instead of a border and a
background tint carrying everything.

Note it needs `max-w-[65ch]` on its paragraphs (currently ~95–100 characters at
`max-w-3xl` + 14px) and the numbering removed per
[P2-3F](#f--numbered-markers-that-arent-a-sequence). Otherwise it is the model.

---

# Appendix

## Verification commands

**Run the site:**

```bash
npm install && npm run dev
```

**Desktop screenshots:**

```bash
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for p in / /education /team /hiring /partners /competition /contact /blog; do
  "$CH" --headless=new --disable-gpu --hide-scrollbars \
    --window-size=1440,1400 --virtual-time-budget=4000 \
    --screenshot="/tmp/shot$(echo "$p" | tr / -).png" "http://localhost:3000$p"
done
```

**Mobile screenshots — use an iframe.** `--window-size=390,844` does *not* give a real 390px
layout viewport in headless Chrome on macOS (the OS enforces a minimum window width), and it
will show you phantom overflow bugs that do not exist on real devices:

```bash
cat > /tmp/frame.html <<'HTML'
<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;padding:0;background:#222}
iframe{width:390px;height:844px;border:0;display:block}
</style></head><body><iframe src="http://localhost:3000/"></iframe></body></html>
HTML

"$CH" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=400,860 --virtual-time-budget=6000 \
  --screenshot=/tmp/mobile.png "file:///tmp/frame.html"
```

**No-JS check (P0-1):** see the two working methods in
[P0-1's Verify section](#verify). Do **not** use `--disable-javascript` — Chrome ignores it in
both headless modes, so it silently produces an ordinary render. Confirm with:

```bash
cat > /tmp/jstest.html <<'HTML'
<!doctype html><html><body><div id="t">NOJS</div>
<script>document.getElementById('t').textContent='JS-RAN';</script></body></html>
HTML
# screenshot this — if it reads "JS-RAN", the flag is being ignored on your machine too
```

**Metadata check (P0-2):**

```bash
curl -s http://localhost:3000/ | grep -iE 'og:|twitter:|viewport'
```

## Audit inventory

Counts taken from the codebase at `753f892`, useful as a before/after baseline:

```bash
# Type scale distribution
grep -rhoE 'text-\[[0-9]+px\]|text-(xs|sm|base|lg|xl|[2-7]xl)' app components | sort | uniq -c | sort -rn

# Radius variants
grep -rhoE 'rounded(-[a-z]+)?' app components | sort | uniq -c | sort -rn

# Glass surface recipes
grep -rhoE 'border-white/\[?0?\.?[0-9]+\]? bg-white/\[?[0-9.]+\]?' app components | sort | uniq -c | sort -rn

# Non-palette greens
grep -rhoE '(emerald|green)-[0-9]+' app components | sort | uniq -c

# Eyebrow labels
grep -rc '<SectionLabel>' app components

# Focus styles (currently 0)
grep -rn 'focus-visible:' app components | wc -l

# cursor-pointer (currently 0)
grep -rn 'cursor-pointer' app components | wc -l
```

## Notes on things that are already right

Worth preserving through the refactor:

- Content architecture. Markdown + YAML under `content/` with typed loaders in `lib/` is clean,
  and the year-scoped team config handles a genuinely awkward problem well.
- `alt=""` on the navbar logo (`Navbar.tsx:26`) is correct — it is decorative next to the
  adjacent "QUANTT" text.
- `aria-label` on the research paper links announcing "opens in new tab".
- `rel="noopener noreferrer"` applied consistently on external links.
- The mobile hamburger is a correct 44×44 target.
- Per-page `metadata` exports with real titles and descriptions on every route.
- `/hiring`'s writing. The portfolio descriptions are specific, confident and genuinely
  interesting — they are the strongest content on the site and the argument for
  [P2-2](#p2-2--rebuild-the-hero-around-the-actual-subject-matter).
