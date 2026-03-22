# QUANTT Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the QUANTT website — a 6-page Next.js site with dark data-driven design, MDX blog, YAML-driven content, deployed to Vercel.

**Architecture:** Next.js 15 App Router with Tailwind CSS v4 (CSS-based @theme config). Content loaded from markdown and YAML files at build time via gray-matter and js-yaml. Pages use a continuous gradient background with glassmorphism cards. Canvas particle animation on hero (desktop only).

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, next-mdx-remote, gray-matter, js-yaml, next/font, next/image

**Spec:** `docs/superpowers/specs/2026-03-22-quantt-website-redesign.md`

---

## File Map

### Configuration
- `package.json` — dependencies and scripts
- `next.config.ts` — Next.js config (MDX, images)
- `postcss.config.mjs` — PostCSS with @tailwindcss/postcss
- `tsconfig.json` — TypeScript config (auto-generated, minor tweaks)
- `app/globals.css` — Tailwind v4 import + @theme tokens (colors, fonts)

### Content Data
- `content/config.yml` — site config (recruiting toggle, copyright)
- `content/events.yml` — upcoming events list
- `content/partners.yml` — partner data (current + past)
- `content/team/jane-smith.md` — sample team member
- `content/team/john-doe.md` — sample team member
- `content/projects/pairs-trading.md` — sample project
- `content/projects/portfolio-optimizer.md` — sample project
- `content/education/ch1-capital-markets.md` — chapter 1
- `content/education/ch2-algo-trading.md` — chapter 2
- `content/education/ch3-time-series.md` — chapter 3
- `content/education/ch4-feature-engineering.md` — chapter 4
- `content/education/ch5-computational-stats.md` — chapter 5
- `content/education/ch6-portfolio-optimization.md` — chapter 6
- `content/blog/canadian-quant-companies.mdx` — sample blog post
- `content/blog/introduction-to-options.mdx` — sample blog post

### Content Loading (lib/)
- `lib/content.ts` — loads YAML files, MD frontmatter, config
- `lib/blog.ts` — loads MDX blog posts with frontmatter

### Shared Components
- `components/SectionLabel.tsx` — uppercase overline text
- `components/GlassCard.tsx` — frosted glass card with hover effect
- `components/GradientBackground.tsx` — configurable gradient wrapper
- `components/ScrollReveal.tsx` — Intersection Observer fade-in wrapper
- `components/Navbar.tsx` — fixed nav with scroll behavior + mobile menu
- `components/Footer.tsx` — dark navy footer with social links

### Page-Specific Components
- `components/Hero.tsx` — full-viewport hero with canvas + rotating text
- `components/ParticleCanvas.tsx` — canvas particle network animation
- `components/RotatingText.tsx` — fade-cycling text component
- `components/Mission.tsx` — "Closing the Gap" section
- `components/ThreePillars.tsx` — collaboration/research/application cards
- `components/UpcomingEvents.tsx` — event cards from events.yml
- `components/Accordion.tsx` — expand/collapse with grid-template-rows
- `components/PartnerCard.tsx` — partner logo + description card
- `components/TeamMemberCard.tsx` — team member photo + bio card
- `components/ProjectCard.tsx` — project showcase card
- `components/BlogCard.tsx` — blog post preview card

### Pages
- `app/layout.tsx` — root layout (fonts, navbar, footer, metadata)
- `app/page.tsx` — homepage
- `app/education/page.tsx` — education page
- `app/partners/page.tsx` — partners page
- `app/team/page.tsx` — team & projects page
- `app/blog/page.tsx` — blog listing
- `app/blog/[slug]/page.tsx` — individual blog post
- `app/contact/page.tsx` — contact page
- `app/not-found.tsx` — custom 404

### Static Assets
- `public/favicon.png` — favicon (placeholder)
- `public/images/` — image directory

### Tests
- `__tests__/lib/content.test.ts` — content loading unit tests
- `__tests__/lib/blog.test.ts` — blog loading unit tests

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `postcss.config.mjs`, `app/globals.css`, `app/layout.tsx`
- Create: `public/favicon.png`, `public/images/.gitkeep`

- [ ] **Step 1: Initialize Next.js 15 project**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack
```

When prompted, accept defaults. If the directory is not empty, it may ask to proceed — say yes. This scaffolds Next.js 15 with Tailwind CSS and App Router.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install next-mdx-remote gray-matter js-yaml @tailwindcss/typography
npm install -D @types/js-yaml
```

- `next-mdx-remote` — renders MDX from content directory in server components
- `gray-matter` — parses frontmatter from MD/MDX files
- `js-yaml` — parses YAML data files
- `@tailwindcss/typography` — prose classes for blog post content

- [ ] **Step 2b: Clean up Tailwind v3 artifacts**

`create-next-app` may scaffold Tailwind v3 config files. Delete them if present:

```bash
rm -f tailwind.config.ts tailwind.config.js
```

Also check `app/globals.css` — if it contains `@tailwind base; @tailwind components; @tailwind utilities;`, those are v3 directives and will be replaced in Step 4.

- [ ] **Step 3: Configure PostCSS for Tailwind v4**

Verify or create `postcss.config.mjs`:

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 4: Set up Tailwind v4 theme in globals.css**

Replace the contents of `app/globals.css` with:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  /* Colors */
  --color-navy: #0a1628;
  --color-navy-mid: #0f1d35;
  --color-primary: #2452a1;
  --color-blue-mid: #1e3360;
  --color-blue-light: #6b8fd4;
  --color-blue-grey: #c8d6ea;
  --color-text-light: #8a9fc4;
  --color-text-dark: #0f1d35;
  --color-text-dark-body: #2a4060;

  /* Fonts — CSS variables set by next/font in layout.tsx */
  --font-heading: var(--font-merriweather);
  --font-body: var(--font-inter);
}
```

- [ ] **Step 5: Configure next.config.ts**

Replace `next.config.ts` with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
```

- [ ] **Step 6: Set up fonts in layout.tsx**

Replace `app/layout.tsx` with a minimal layout that loads fonts:

```tsx
import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QUANTT — Queen's University Algorithmic Network & Trading Team",
  description:
    "Bridging academic research and industry practice through collaboration, research, and real-world application in quantitative finance.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable} scroll-smooth`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Create placeholder favicon and images directory**

Create `public/favicon.png` — a 1x1 placeholder PNG (or copy the real one later).
Create `public/images/.gitkeep` to ensure the directory exists in git.

```bash
mkdir -p public/images
touch public/images/.gitkeep
# Create a minimal placeholder favicon (1x1 transparent PNG)
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n\xb4\x00\x00\x00\x00IEND\xaeB`\x82' > public/favicon.png
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Open `http://localhost:3000` — should see the default Next.js page with Tailwind working. Kill the dev server after verifying.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 with Tailwind v4, fonts, and dependencies"
```

---

## Task 2: Content Loading Utilities

> **Important:** Complete Task 3 (Seed Content Files) before running the tests in Step 5. The lib code can be written first, but tests require content files to exist.

**Files:**
- Create: `lib/content.ts`, `lib/blog.ts`
- Create: `__tests__/lib/content.test.ts`, `__tests__/lib/blog.test.ts`

- [ ] **Step 1: Install test runner**

```bash
npm install -D vitest @vitejs/plugin-react
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

Add to `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`

- [ ] **Step 2: Create lib/content.ts**

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

const contentDir = path.join(process.cwd(), "content");

export interface SiteConfig {
  recruiting: boolean;
  recruitingDetails?: string;
  recruitingUrl?: string;
  copyright: string;
}

export interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  url?: string;
}

export interface Partner {
  name: string;
  logo: string;
  description: string;
}

export interface PartnersData {
  current: Partner[];
  past: Partner[];
}

export interface TeamMember {
  name: string;
  role: string;
  photo?: string;
  order: number;
  bio: string;
  linkedin?: string;
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  status: "active" | "completed";
  order: number;
  body?: string;
}

export interface EducationChapter {
  title: string;
  chapter: number;
  body: string;
}

function readYaml<T>(filename: string): T {
  const filePath = path.join(contentDir, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return yaml.load(raw) as T;
}

function readMdDir<T>(dir: string): (T & { body: string })[] {
  const dirPath = path.join(contentDir, dir);
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dirPath, file), "utf-8");
    const { data, content } = matter(raw);
    return { ...(data as T), body: content.trim() };
  });
}

export function getSiteConfig(): SiteConfig {
  return readYaml<SiteConfig>("config.yml");
}

export function getEvents(): Event[] {
  const events = readYaml<Event[] | null>("events.yml");
  return events ?? [];
}

export function getPartners(): PartnersData {
  return readYaml<PartnersData>("partners.yml");
}

export function getTeamMembers(): TeamMember[] {
  return readMdDir<TeamMember>("team").sort((a, b) => a.order - b.order);
}

export function getProjects(): Project[] {
  return readMdDir<Project>("projects").sort((a, b) => a.order - b.order);
}

export function getEducationChapters(): EducationChapter[] {
  return readMdDir<EducationChapter>("education").sort(
    (a, b) => a.chapter - b.chapter
  );
}
```

- [ ] **Step 3: Create lib/blog.ts**

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogDir = path.join(process.cwd(), "content", "blog");

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  coverImage?: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

export function getBlogPosts(): BlogPostMeta[] {
  if (!fs.existsSync(blogDir)) return [];
  const files = fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(blogDir, file), "utf-8");
    const { data } = matter(raw);
    const slug = file.replace(/\.mdx?$/, "");
    return { slug, ...(data as Omit<BlogPostMeta, "slug">) };
  });
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBlogPost(slug: string): BlogPost | null {
  const mdxPath = path.join(blogDir, `${slug}.mdx`);
  const mdPath = path.join(blogDir, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
      ? mdPath
      : null;
  if (!filePath) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { slug, ...(data as Omit<BlogPostMeta, "slug">), content };
}

export function getBlogSlugs(): string[] {
  if (!fs.existsSync(blogDir)) return [];
  return fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}
```

- [ ] **Step 4: Write tests for content loading**

Create `__tests__/lib/content.test.ts`:

```ts
import { describe, it, expect, beforeAll } from "vitest";
import {
  getSiteConfig,
  getEvents,
  getPartners,
  getTeamMembers,
  getProjects,
  getEducationChapters,
} from "@/lib/content";

describe("content loading", () => {
  it("loads site config", () => {
    const config = getSiteConfig();
    expect(config).toHaveProperty("recruiting");
    expect(config).toHaveProperty("copyright");
    expect(typeof config.recruiting).toBe("boolean");
  });

  it("loads events as array", () => {
    const events = getEvents();
    expect(Array.isArray(events)).toBe(true);
    if (events.length > 0) {
      expect(events[0]).toHaveProperty("title");
      expect(events[0]).toHaveProperty("date");
    }
  });

  it("loads partners with current and past", () => {
    const partners = getPartners();
    expect(partners).toHaveProperty("current");
    expect(partners).toHaveProperty("past");
    expect(Array.isArray(partners.current)).toBe(true);
  });

  it("loads team members sorted by order", () => {
    const members = getTeamMembers();
    expect(Array.isArray(members)).toBe(true);
    if (members.length > 1) {
      expect(members[0].order).toBeLessThanOrEqual(members[1].order);
    }
  });

  it("loads projects sorted by order", () => {
    const projects = getProjects();
    expect(Array.isArray(projects)).toBe(true);
  });

  it("loads education chapters sorted by chapter number", () => {
    const chapters = getEducationChapters();
    expect(Array.isArray(chapters)).toBe(true);
    if (chapters.length > 1) {
      expect(chapters[0].chapter).toBeLessThanOrEqual(chapters[1].chapter);
    }
  });
});
```

Create `__tests__/lib/blog.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { getBlogPosts, getBlogPost, getBlogSlugs } from "@/lib/blog";

describe("blog loading", () => {
  it("returns array of blog posts sorted by date descending", () => {
    const posts = getBlogPosts();
    expect(Array.isArray(posts)).toBe(true);
    if (posts.length > 1) {
      const d1 = new Date(posts[0].date).getTime();
      const d2 = new Date(posts[1].date).getTime();
      expect(d1).toBeGreaterThanOrEqual(d2);
    }
  });

  it("returns blog slugs", () => {
    const slugs = getBlogSlugs();
    expect(Array.isArray(slugs)).toBe(true);
    slugs.forEach((slug) => {
      expect(slug).not.toContain(".mdx");
      expect(slug).not.toContain(".md");
    });
  });

  it("loads individual blog post by slug", () => {
    const slugs = getBlogSlugs();
    if (slugs.length > 0) {
      const post = getBlogPost(slugs[0]);
      expect(post).not.toBeNull();
      expect(post).toHaveProperty("title");
      expect(post).toHaveProperty("content");
    }
  });

  it("returns null for nonexistent slug", () => {
    const post = getBlogPost("this-slug-does-not-exist-xyz");
    expect(post).toBeNull();
  });
});
```

- [ ] **Step 5: Skip tests for now**

Tests will be run after Task 3 creates the content files.

- [ ] **Step 6: Commit**

```bash
git add lib/ __tests__/ vitest.config.ts package.json
git commit -m "feat: add content loading utilities and test scaffolding"
```

---

## Task 3: Seed Content Files

**Files:**
- Create: `content/config.yml`, `content/events.yml`, `content/partners.yml`
- Create: `content/team/jane-smith.md`, `content/team/john-doe.md`
- Create: `content/projects/pairs-trading.md`, `content/projects/portfolio-optimizer.md`
- Create: `content/education/ch1-capital-markets.md` through `ch6-portfolio-optimization.md`
- Create: `content/blog/canadian-quant-companies.mdx`, `content/blog/introduction-to-options.mdx`

- [ ] **Step 1: Create content/config.yml**

```yaml
recruiting: true
recruitingDetails: "Applications open until April 15, 2026"
recruitingUrl: "https://linktr.ee/quantt"
copyright: "2026 QUANTT"
```

- [ ] **Step 2: Create content/events.yml**

```yaml
- title: "Workshop: Intro to Algo Trading"
  date: "2026-03-28"
  time: "6:00 PM"
  location: "Goodes Hall 302"

- title: "Guest Speaker: NBC Quant Desk"
  date: "2026-04-05"
  time: "5:30 PM"
  location: "Smith Hall 120"

- title: "Trading Competition Finals"
  date: "2026-04-12"
  time: "4:00 PM"
  location: "Biosciences Atrium"
```

- [ ] **Step 3: Create content/partners.yml**

```yaml
current:
  - name: "Ontario Teachers' Pension Plan"
    logo: "/images/partners/otpp.png"
    description: "One of the world's largest institutional investors, managing $250B+ in assets."

  - name: "Picton Investments"
    logo: "/images/partners/picton.png"
    description: "Canadian investment management firm focused on quantitative strategies."

  - name: "National Bank of Canada"
    logo: "/images/partners/nbc.png"
    description: "Leading Canadian financial institution with a strong quantitative division."

  - name: "Connor, Clark & Lunn"
    logo: "/images/partners/ccl.png"
    description: "Multi-boutique asset management firm specializing in quantitative investing."

past:
  - name: "QuantConnect"
    logo: "/images/partners/quantconnect.png"
    description: "Open-source algorithmic trading platform."

  - name: "Viewpoint Investment Partners"
    logo: "/images/partners/viewpoint.png"
    description: "Investment advisory firm focused on alternative strategies."
```

- [ ] **Step 4: Create content/team/ member files**

`content/team/jane-smith.md`:
```markdown
---
name: "Jane Smith"
role: "President"
order: 1
bio: "4th year Commerce, specializing in quantitative finance and derivatives trading."
linkedin: "https://linkedin.com/in/janesmith"
---
```

`content/team/john-doe.md`:
```markdown
---
name: "John Doe"
role: "VP Education"
order: 2
bio: "3rd year Computer Science, passionate about algorithmic trading and machine learning."
linkedin: "https://linkedin.com/in/johndoe"
---
```

Note: `photo` field is omitted from sample data so the initials fallback displays. Add real photos to `public/images/team/` and set the `photo` frontmatter field when ready.

- [ ] **Step 5: Create content/projects/ files**

`content/projects/pairs-trading.md`:
```markdown
---
title: "Pairs Trading Algorithm"
description: "Statistical arbitrage strategy using cointegration analysis on TSX-listed equities."
tech: ["Python", "pandas", "scikit-learn", "statsmodels"]
status: "active"
order: 1
---

Our flagship project implements a mean-reversion pairs trading strategy. We identify cointegrated pairs using the Engle-Granger method and generate trade signals when spreads deviate beyond 2 standard deviations.
```

`content/projects/portfolio-optimizer.md`:
```markdown
---
title: "Portfolio Optimization Engine"
description: "Modern portfolio theory implementation with risk-parity and Black-Litterman models."
tech: ["Python", "NumPy", "SciPy", "Plotly"]
status: "completed"
order: 2
---

Built a portfolio optimization tool that supports mean-variance, risk-parity, and Black-Litterman allocation methods. Includes interactive visualization of the efficient frontier.
```

- [ ] **Step 6: Create content/education/ chapter files**

Create 6 files. Each follows this pattern:

`content/education/ch1-capital-markets.md`:
```markdown
---
title: "Introduction to Capital Markets"
chapter: 1
---

An overview of financial markets, instruments, and key participants. Topics include equity markets, fixed income, derivatives, and market microstructure. Students learn the fundamentals of how capital flows through the global financial system.
```

`content/education/ch2-algo-trading.md`:
```markdown
---
title: "Introduction to Algo-trading"
chapter: 2
---

Foundations of algorithmic trading including order types, execution strategies, and market making. Covers the technology stack behind trading systems, backtesting frameworks, and the regulatory landscape.
```

`content/education/ch3-time-series.md`:
```markdown
---
title: "Time Series Analysis"
chapter: 3
---

Statistical methods for analyzing financial time series data. Topics include stationarity, autocorrelation, ARIMA models, GARCH volatility modeling, and cointegration analysis for pairs trading.
```

`content/education/ch4-feature-engineering.md`:
```markdown
---
title: "Feature Engineering"
chapter: 4
---

Techniques for transforming raw financial data into predictive features. Covers technical indicators, fundamental ratios, alternative data sources, and feature selection methods for trading models.
```

`content/education/ch5-computational-stats.md`:
```markdown
---
title: "Computational Statistics and Probability"
chapter: 5
---

Probability theory and computational statistics applied to finance. Topics include Monte Carlo simulation, bootstrapping, Bayesian inference, and statistical hypothesis testing for trading strategies.
```

`content/education/ch6-portfolio-optimization.md`:
```markdown
---
title: "Portfolio Optimization"
chapter: 6
---

Modern portfolio theory and beyond. Covers mean-variance optimization, risk parity, Black-Litterman model, factor investing, and practical considerations for portfolio construction and rebalancing.
```

- [ ] **Step 7: Create content/blog/ sample posts**

`content/blog/canadian-quant-companies.mdx`:
```mdx
---
title: "Top Quantitative Finance Companies in Canada"
date: "2025-11-15"
author: "QUANTT Research Team"
excerpt: "A curated guide to the leading quantitative finance firms hiring in Canada."
---

Canada's quantitative finance landscape is growing rapidly. From the trading floors of Bay Street to innovative fintech startups, there are more opportunities than ever for quantitative analysts, developers, and researchers.

## Major Players

### Institutional Investors
- **Ontario Teachers' Pension Plan** — One of the world's largest pension funds with a sophisticated quantitative investment team.
- **CPP Investments** — Managing $500B+ with significant quant capabilities.
- **CDPQ** — Quebec's pension fund with a growing systematic strategies division.

### Banks
- **RBC Capital Markets** — Leading Canadian bank with quantitative trading and research teams.
- **National Bank of Canada** — Strong quantitative division with algorithmic trading capabilities.
- **TD Securities** — Expanding quantitative strategies group.

### Asset Managers
- **Connor, Clark & Lunn** — Multi-boutique firm known for quantitative investing.
- **Picton Investments** — Quantitative-focused Canadian asset manager.
- **Man Group (Toronto)** — Global quant firm with Canadian presence.

## Getting Started
The best way to break into Canadian quant finance is through internships and university partnerships — exactly what QUANTT helps facilitate.
```

`content/blog/introduction-to-options.mdx`:
```mdx
---
title: "A Beginner's Guide to Options Trading"
date: "2025-09-20"
author: "QUANTT Education Team"
excerpt: "Understanding calls, puts, and basic options strategies for beginners."
---

Options are financial derivatives that give the holder the right, but not the obligation, to buy or sell an underlying asset at a specified price before a certain date.

## Key Concepts

### Call Options
A call option gives you the right to **buy** an asset at the strike price. You profit when the asset price rises above the strike price plus the premium you paid.

### Put Options
A put option gives you the right to **sell** an asset at the strike price. You profit when the asset price falls below the strike price minus the premium.

## Basic Strategies

1. **Long Call** — Bullish bet with limited downside (premium paid)
2. **Long Put** — Bearish bet with limited downside
3. **Covered Call** — Own the stock, sell calls for income
4. **Protective Put** — Own the stock, buy puts for insurance

## The Greeks
Options pricing depends on several factors measured by "the Greeks":
- **Delta** — sensitivity to underlying price
- **Gamma** — rate of change of delta
- **Theta** — time decay
- **Vega** — sensitivity to volatility

Understanding these fundamentals is the first step toward more advanced options strategies like straddles, strangles, and spreads.
```

- [ ] **Step 8: Run tests — should now pass**

```bash
npm test
```

Expected: All tests PASS.

- [ ] **Step 9: Commit**

```bash
git add content/ __tests__/
git commit -m "feat: add seed content files (config, events, partners, team, projects, education, blog)"
```

---

## Task 4: Shared Building Block Components

**Files:**
- Create: `components/SectionLabel.tsx`, `components/GlassCard.tsx`, `components/GradientBackground.tsx`, `components/ScrollReveal.tsx`

- [ ] **Step 1: Create SectionLabel component**

```tsx
export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[3px]">
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Create GlassCard component**

```tsx
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
}: GlassCardProps) {
  return (
    <div
      className={`rounded-lg border border-white/10 bg-white/[0.07] backdrop-blur-md ${
        hover
          ? "transition-transform duration-300 hover:-translate-y-0.5 hover:border-white/20"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Create GradientBackground component**

```tsx
import { ReactNode } from "react";

interface GradientBackgroundProps {
  children: ReactNode;
  variant?: "full" | "short";
  className?: string;
}

export default function GradientBackground({
  children,
  variant = "full",
  className = "",
}: GradientBackgroundProps) {
  const gradients = {
    full: "bg-gradient-to-b from-navy via-blue-mid via-50% to-blue-grey",
    short: "bg-gradient-to-b from-navy via-blue-mid to-blue-grey/80",
  };

  return (
    <div className={`relative min-h-screen ${gradients[variant]} ${className}`}>
      {children}
    </div>
  );
}
```

Note: The gradient utility classes rely on the custom colors defined in `globals.css` `@theme`. Tailwind v4 auto-generates `from-navy`, `via-blue-mid`, `to-blue-grey` from the `--color-*` tokens. If these don't work, use arbitrary values: `from-[#0a1628] via-[#1e3360] to-[#c8d6ea]`.

- [ ] **Step 4: Create ScrollReveal component**

```tsx
"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollReveal({
  children,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
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
      className={`transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: Build succeeds (components exist but aren't used yet — that's fine).

- [ ] **Step 6: Commit**

```bash
git add components/
git commit -m "feat: add shared components (SectionLabel, GlassCard, GradientBackground, ScrollReveal)"
```

---

## Task 5: Navbar Component

**Files:**
- Create: `components/Navbar.tsx`

- [ ] **Step 1: Create Navbar component**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { href: "/education", label: "Education" },
  { href: "/partners", label: "Partners" },
  { href: "/team", label: "Team" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      setHidden(currentY > lastScrollY.current && currentY > 100);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
      } ${scrolled ? "bg-navy/95 backdrop-blur-sm shadow-lg" : "bg-transparent"}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-[15px] font-bold tracking-[2px] text-white"
        >
          QUANTT
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[11px] uppercase tracking-[1px] transition-colors ${
                pathname === link.href
                  ? "text-white"
                  : "text-white/55 hover:text-white/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className={`rounded border px-3.5 py-1.5 text-[11px] uppercase tracking-[1px] transition-colors ${
              pathname === "/contact"
                ? "border-white/40 text-white"
                : "border-white/20 text-white/70 hover:border-white/40 hover:text-white"
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 items-center justify-center md:hidden"
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`block h-0.5 w-5 bg-white transition-transform ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition-opacity ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition-transform ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-navy/95 px-6 pb-6 backdrop-blur-sm md:hidden">
          {[...navLinks, { href: "/contact", label: "Contact" }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block py-3 text-sm ${
                pathname === link.href ? "text-white" : "text-white/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat: add Navbar with scroll behavior and mobile menu"
```

---

## Task 6: Footer Component

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 1: Create Footer component**

```tsx
import Link from "next/link";
import { getSiteConfig } from "@/lib/content";

export default function Footer() {
  const config = getSiteConfig();

  return (
    <footer className="bg-navy px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/"
            className="text-sm font-bold tracking-[2px] text-white"
          >
            QUANTT
          </Link>
          <p className="mt-1 text-[11px] text-text-light">
            <a
              href="mailto:quanttgroup@gmail.com"
              className="hover:text-white transition-colors"
            >
              quanttgroup@gmail.com
            </a>
          </p>
        </div>

        <div className="flex gap-4">
          {[
            { href: "https://www.facebook.com/QUANTTpage", label: "Facebook" },
            {
              href: "https://www.linkedin.com/company/quanttqueens/",
              label: "LinkedIn",
            },
            {
              href: "https://www.instagram.com/quanttqueens",
              label: "Instagram",
            },
            { href: "https://linktr.ee/quantt", label: "Linktree" },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-text-light transition-colors hover:text-white"
            >
              {social.label}
            </a>
          ))}
        </div>

        <p className="text-[10px] text-blue-mid">
          &copy; {config.copyright}
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: add Footer with social links and dynamic copyright"
```

---

## Task 7: Root Layout Assembly

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Update layout.tsx to include Navbar and Footer**

Update `app/layout.tsx` — add Navbar and Footer imports and render them in the body:

```tsx
import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QUANTT — Queen's University Algorithmic Network & Trading Team",
  description:
    "Bridging academic research and industry practice through collaboration, research, and real-world application in quantitative finance.",
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "QUANTT — Queen's University Algorithmic Network & Trading Team",
    description:
      "Bridging academic research and industry practice in quantitative finance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable} scroll-smooth`}>
      <body className="font-body antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create temporary homepage placeholder**

Replace `app/page.tsx`:

```tsx
import GradientBackground from "@/components/GradientBackground";

export default function Home() {
  return (
    <GradientBackground>
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="font-heading text-4xl font-bold text-white">
          QUANTT Website — Coming Soon
        </h1>
      </div>
    </GradientBackground>
  );
}
```

- [ ] **Step 3: Verify dev server**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify: gradient background, white heading text, navbar at top, footer at bottom. Check that fonts load (Merriweather for heading, Inter for nav). Kill dev server.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat: assemble root layout with Navbar, Footer, fonts, and metadata"
```

---

## Task 8: Hero Component

**Files:**
- Create: `components/ParticleCanvas.tsx`, `components/RotatingText.tsx`, `components/Hero.tsx`

- [ ] **Step 1: Create ParticleCanvas component**

```tsx
"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Disable on mobile
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const particleCount = 60;
    const connectionDistance = 150;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      resize();
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(107, 143, 212, ${
              0.15 * (1 - dist / connectionDistance)
            })`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(107, 143, 212, 0.4)";
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animationId = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: Create RotatingText component**

```tsx
"use client";

import { useEffect, useState } from "react";

const phrases = ["Quantitative Finance", "Algo Trading", "Data Science"];

export default function RotatingText() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % phrases.length);
        setVisible(true);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`inline-block bg-gradient-to-r from-blue-light to-blue-grey bg-clip-text text-transparent transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {phrases[index]}
    </span>
  );
}
```

- [ ] **Step 3: Create Hero component**

```tsx
import Link from "next/link";
import ParticleCanvas from "./ParticleCanvas";
import RotatingText from "./RotatingText";
import SectionLabel from "./SectionLabel";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-navy via-navy-mid to-primary">
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #cfd6f6 1px, transparent 1px)",
          backgroundSize: "calc(100% / 16) 100%",
        }}
        aria-hidden="true"
      />

      {/* Chart lines SVG */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 h-[200px] w-full opacity-10"
        viewBox="0 0 500 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline
          points="0,160 50,130 100,140 150,80 200,110 250,40 300,70 350,30 400,56 450,20 500,36"
          fill="none"
          stroke="#6b8fd4"
          strokeWidth="1.5"
        />
        <polyline
          points="0,180 50,150 100,160 150,110 200,124 250,76 300,90 350,60 400,80 450,50 500,60"
          fill="none"
          stroke="#4a7ae0"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>

      {/* Particle animation (desktop only) */}
      <ParticleCanvas />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32">
        <SectionLabel>
          <span className="text-text-light">
            Queen&apos;s University Algorithmic Network &amp; Trading Team
          </span>
        </SectionLabel>

        <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
          Tomorrow&apos;s Talent in
          <br />
          <RotatingText />
        </h1>

        <p className="mt-5 max-w-md text-sm leading-relaxed text-text-light md:text-base">
          Bridging academic research and industry practice through
          collaboration, research, and real-world application.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/contact"
            className="inline-block rounded bg-primary px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary/80"
          >
            Get Involved
          </Link>
          <a
            href="#pillars"
            className="text-xs uppercase tracking-wider text-text-light transition-colors hover:text-white"
          >
            Our Work ↓
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add components/ParticleCanvas.tsx components/RotatingText.tsx components/Hero.tsx
git commit -m "feat: add Hero with particle canvas, rotating text, and CTAs"
```

---

## Task 9: Homepage Sections (Mission, ThreePillars, UpcomingEvents)

**Files:**
- Create: `components/Mission.tsx`, `components/ThreePillars.tsx`, `components/UpcomingEvents.tsx`

- [ ] **Step 1: Create Mission component**

```tsx
import SectionLabel from "./SectionLabel";
import ScrollReveal from "./ScrollReveal";

export default function Mission() {
  return (
    <ScrollReveal>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-center">
          <div className="flex-1">
            <SectionLabel>
              <span className="text-blue-grey">Our Mission</span>
            </SectionLabel>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white">
              Closing the Gap
            </h2>
            <p className="mt-4 leading-relaxed text-white/75">
              QUANTT bridges the gap between academic theory and industry practice
              in quantitative finance. We equip students with real-world skills
              through hands-on projects, mentorship, and industry partnerships —
              preparing tomorrow&apos;s leaders in algorithmic trading and
              quantitative research.
            </p>
          </div>
          <div className="flex h-48 w-full flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] md:h-52 md:w-64">
            <span className="text-xs text-white/30">Club Photo</span>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
```

- [ ] **Step 2: Create ThreePillars component**

```tsx
import GlassCard from "./GlassCard";
import SectionLabel from "./SectionLabel";
import ScrollReveal from "./ScrollReveal";

const pillars = [
  {
    icon: "✦",
    title: "Collaboration",
    description:
      "Working together across disciplines to solve complex problems in quantitative finance.",
  },
  {
    icon: "◆",
    title: "Research",
    description:
      "Rigorous quantitative analysis, financial modeling, and academic exploration.",
  },
  {
    icon: "▶",
    title: "Application",
    description:
      "Real-world algorithmic trading, portfolio management, and data-driven strategies.",
  },
];

export default function ThreePillars() {
  return (
    <ScrollReveal>
      <section id="pillars" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 text-center">
          <SectionLabel>
            <span className="text-white/50">What We Do</span>
          </SectionLabel>
          <h2 className="mt-2 font-heading text-2xl font-bold text-white">
            Three Pillars
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => (
            <GlassCard key={pillar.title} className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-blue-grey">
                {pillar.icon}
              </div>
              <h3 className="mb-2 text-sm font-semibold text-white">
                {pillar.title}
              </h3>
              <p className="text-xs leading-relaxed text-white/60">
                {pillar.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
```

- [ ] **Step 3: Create UpcomingEvents component**

```tsx
import { getEvents } from "@/lib/content";
import SectionLabel from "./SectionLabel";
import ScrollReveal from "./ScrollReveal";

export default function UpcomingEvents() {
  const events = getEvents();
  if (events.length === 0) return null;

  return (
    <ScrollReveal>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionLabel>
          <span className="text-blue-mid">Coming Up</span>
        </SectionLabel>
        <h2 className="mt-2 font-heading text-2xl font-bold text-text-dark">
          Upcoming Events
        </h2>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {events.map((event) => (
            <div
              key={`${event.date}-${event.title}`}
              className="rounded-lg border border-white/30 bg-white/35 p-5 backdrop-blur-sm"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-mid">
                {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <h3 className="mt-1.5 text-sm font-semibold text-text-dark">
                {event.title}
              </h3>
              <p className="mt-1 text-xs text-text-dark-body">
                {event.location} &middot; {event.time}
              </p>
            </div>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/Mission.tsx components/ThreePillars.tsx components/UpcomingEvents.tsx
git commit -m "feat: add Mission, ThreePillars, and UpcomingEvents sections"
```

---

## Task 10: Homepage Assembly

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Assemble the homepage**

Replace `app/page.tsx`:

```tsx
import GradientBackground from "@/components/GradientBackground";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import ThreePillars from "@/components/ThreePillars";
import UpcomingEvents from "@/components/UpcomingEvents";

export default function Home() {
  return (
    <>
      <Hero />
      <GradientBackground>
        <Mission />
        <ThreePillars />
        <UpcomingEvents />
      </GradientBackground>
    </>
  );
}
```

- [ ] **Step 2: Verify in dev server**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify:
- Hero fills viewport with gradient, particle animation (on desktop), rotating text
- Scroll down: Mission section, Three Pillars cards, Upcoming Events
- Navbar shows at top, becomes solid on scroll, hides on scroll down
- Footer at the bottom
- "Our Work ↓" smooth-scrolls to #pillars section

Kill dev server.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble homepage with Hero, Mission, ThreePillars, UpcomingEvents"
```

---

## Task 11: Education Page

**Files:**
- Create: `components/Accordion.tsx`, `app/education/page.tsx`

- [ ] **Step 1: Create Accordion component**

```tsx
"use client";

import { useState } from "react";

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-white/10">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className={`flex w-full items-center justify-between px-5 py-4 text-left transition-colors ${
              openIndex === i
                ? "bg-primary text-white"
                : "bg-white/[0.05] text-white/80 hover:bg-white/[0.08]"
            }`}
          >
            <span className="text-sm font-semibold">{item.title}</span>
            <span
              className={`text-lg transition-transform duration-300 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            >
              ▾
            </span>
          </button>
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-in-out"
            style={{
              gridTemplateRows: openIndex === i ? "1fr" : "0fr",
            }}
          >
            <div className="overflow-hidden">
              <div className="px-5 py-4 text-sm leading-relaxed text-white/70">
                {item.content}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create Education page**

```tsx
import type { Metadata } from "next";
import GradientBackground from "@/components/GradientBackground";
import SectionLabel from "@/components/SectionLabel";
import Accordion from "@/components/Accordion";
import ScrollReveal from "@/components/ScrollReveal";
import { getEducationChapters } from "@/lib/content";

export const metadata: Metadata = {
  title: "Education — QUANTT",
  description:
    "QUANTT's curriculum covers capital markets, algorithmic trading, time series analysis, and more.",
};

export default function EducationPage() {
  const chapters = getEducationChapters();
  const items = chapters.map((ch) => ({
    title: `Chapter ${ch.chapter}: ${ch.title}`,
    content: ch.body,
  }));

  return (
    <GradientBackground variant="short">
      <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
        <ScrollReveal>
          <SectionLabel>
            <span className="text-blue-light">Learn With Us</span>
          </SectionLabel>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">
            Education
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Our curriculum is designed to take you from fundamentals to
            advanced quantitative finance concepts.
          </p>
        </ScrollReveal>

        <div className="mt-10">
          <Accordion items={items} />
        </div>
      </div>
    </GradientBackground>
  );
}
```

- [ ] **Step 3: Verify in dev server**

```bash
npm run dev
```

Open `http://localhost:3000/education`. Verify: gradient background, 6 accordion chapters, clicking expands/collapses smoothly with blue highlight.

- [ ] **Step 4: Commit**

```bash
git add components/Accordion.tsx app/education/
git commit -m "feat: add Education page with accordion chapters"
```

---

## Task 12: Partners Page

**Files:**
- Create: `components/PartnerCard.tsx`, `app/partners/page.tsx`

- [ ] **Step 1: Create PartnerCard component**

```tsx
import type { Partner } from "@/lib/content";

interface PartnerCardProps {
  partner: Partner;
  muted?: boolean;
}

export default function PartnerCard({
  partner,
  muted = false,
}: PartnerCardProps) {
  return (
    <div
      className={`rounded-lg border p-5 ${
        muted
          ? "border-white/5 bg-white/[0.03]"
          : "border-white/10 bg-white/[0.07] backdrop-blur-md"
      }`}
    >
      <div className="mb-3 flex h-12 items-center">
        {/* Logo placeholder — replace with next/image when real logos are added */}
        <div
          className={`flex h-10 items-center rounded bg-white/10 px-3 text-xs font-semibold ${
            muted ? "text-white/30" : "text-white/50"
          }`}
        >
          {partner.name}
        </div>
      </div>
      <h3
        className={`text-sm font-semibold ${muted ? "text-white/50" : "text-white"}`}
      >
        {partner.name}
      </h3>
      <p
        className={`mt-1 text-xs leading-relaxed ${
          muted ? "text-white/35" : "text-white/60"
        }`}
      >
        {partner.description}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create Partners page**

```tsx
import type { Metadata } from "next";
import GradientBackground from "@/components/GradientBackground";
import SectionLabel from "@/components/SectionLabel";
import ScrollReveal from "@/components/ScrollReveal";
import PartnerCard from "@/components/PartnerCard";
import { getPartners } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partners — QUANTT",
  description:
    "QUANTT partners with leading financial institutions to provide real-world quantitative finance experience.",
};

export default function PartnersPage() {
  const partners = getPartners();

  return (
    <GradientBackground variant="short">
      <div className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        <ScrollReveal>
          <SectionLabel>
            <span className="text-blue-light">Our Network</span>
          </SectionLabel>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">
            Partners
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70">
            Leveraging our talent-base to provide the value you need.
          </p>
        </ScrollReveal>

        {/* Current Partners */}
        <div className="mt-12">
          <h2 className="mb-6 text-lg font-semibold text-white">
            Current Partners
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {partners.current.map((partner) => (
              <PartnerCard key={partner.name} partner={partner} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <ScrollReveal>
          <div className="mt-12 rounded-lg border border-primary/30 bg-primary/10 p-6 text-center">
            <h3 className="font-heading text-lg font-bold text-white">
              Looking for 2026-2027 Partners!
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Interested in partnering with QUANTT? We&apos;d love to hear from
              you.
            </p>
            <a
              href="mailto:quanttgroup@gmail.com"
              className="mt-4 inline-block rounded bg-primary px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary/80"
            >
              Get in Touch
            </a>
          </div>
        </ScrollReveal>

        {/* Past Partners */}
        {partners.past.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-sm font-semibold text-white/50">
              Past Partners
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {partners.past.map((partner) => (
                <PartnerCard key={partner.name} partner={partner} muted />
              ))}
            </div>
          </div>
        )}
      </div>
    </GradientBackground>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/PartnerCard.tsx app/partners/
git commit -m "feat: add Partners page with current/past partners and CTA"
```

---

## Task 13: Team & Projects Page

**Files:**
- Create: `components/TeamMemberCard.tsx`, `components/ProjectCard.tsx`, `app/team/page.tsx`

- [ ] **Step 1: Create TeamMemberCard component**

```tsx
import Image from "next/image";
import type { TeamMember } from "@/lib/content";

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 text-center backdrop-blur-md">
      {/* Photo or initials */}
      <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full border border-white/15 bg-white/[0.08]">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white/40">
            {member.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-white">{member.name}</h3>
      <p className="text-xs font-medium text-blue-light">{member.role}</p>
      <p className="mt-2 text-xs leading-relaxed text-white/60">
        {member.bio}
      </p>
      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-[10px] text-blue-light hover:text-white"
        >
          LinkedIn →
        </a>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create ProjectCard component**

```tsx
import type { Project } from "@/lib/content";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 backdrop-blur-md">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-sm font-semibold text-white">{project.title}</h3>
        <span
          className={`ml-2 flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
            project.status === "active"
              ? "bg-green-500/20 text-green-300"
              : "bg-white/10 text-white/50"
          }`}
        >
          {project.status}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-white/60">
        {project.description}
      </p>
      {project.body && (
        <p className="mt-2 text-xs leading-relaxed text-white/50">
          {project.body}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/60"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create Team page**

```tsx
import type { Metadata } from "next";
import GradientBackground from "@/components/GradientBackground";
import SectionLabel from "@/components/SectionLabel";
import ScrollReveal from "@/components/ScrollReveal";
import TeamMemberCard from "@/components/TeamMemberCard";
import ProjectCard from "@/components/ProjectCard";
import { getTeamMembers, getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Team & Projects — QUANTT",
  description:
    "Meet the QUANTT leadership team and explore our quantitative finance projects.",
};

export default function TeamPage() {
  const members = getTeamMembers();
  const projects = getProjects();

  return (
    <GradientBackground variant="short">
      <div className="mx-auto max-w-5xl px-6 pt-32 pb-20">
        {/* Team Section */}
        <ScrollReveal>
          <SectionLabel>
            <span className="text-blue-light">Our People</span>
          </SectionLabel>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">
            Leadership
          </h1>
        </ScrollReveal>

        {members.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-white/50">
            Team roster coming soon.
          </p>
        )}

        {/* Divider */}
        <div className="my-16 h-px bg-white/10" />

        {/* Projects Section */}
        <ScrollReveal>
          <SectionLabel>
            <span className="text-blue-light">Our Work</span>
          </SectionLabel>
          <h2 className="mt-2 font-heading text-2xl font-bold text-white">
            Projects
          </h2>
        </ScrollReveal>

        {projects.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-white/50">Projects coming soon.</p>
        )}
      </div>
    </GradientBackground>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/TeamMemberCard.tsx components/ProjectCard.tsx app/team/
git commit -m "feat: add Team & Projects page with member cards and project showcase"
```

---

## Task 14: Blog

**Files:**
- Create: `components/BlogCard.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`

- [ ] **Step 1: Create BlogCard component**

```tsx
import Link from "next/link";
import Image from "next/image";
import type { BlogPostMeta } from "@/lib/blog";

export default function BlogCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-lg border border-white/10 bg-white/[0.07] backdrop-blur-md transition-transform hover:-translate-y-0.5"
    >
      {post.coverImage && (
        <div className="relative h-40 w-full">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 700px"
          />
        </div>
      )}
      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-light">
          {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <h3 className="mt-2 text-base font-semibold text-white group-hover:text-blue-light">
          {post.title}
        </h3>
        <p className="mt-1 text-xs text-white/60">{post.excerpt}</p>
        <p className="mt-3 text-[10px] text-white/40">By {post.author}</p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create Blog listing page**

```tsx
import type { Metadata } from "next";
import GradientBackground from "@/components/GradientBackground";
import SectionLabel from "@/components/SectionLabel";
import ScrollReveal from "@/components/ScrollReveal";
import BlogCard from "@/components/BlogCard";
import { getBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — QUANTT",
  description: "Articles and insights from the QUANTT team on quantitative finance.",
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <GradientBackground variant="short">
      <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
        <ScrollReveal>
          <SectionLabel>
            <span className="text-blue-light">Insights</span>
          </SectionLabel>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">
            Blog
          </h1>
        </ScrollReveal>

        {posts.length > 0 ? (
          <div className="mt-10 space-y-4">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-sm text-white/50">
            No posts yet — check back soon.
          </p>
        )}
      </div>
    </GradientBackground>
  );
}
```

- [ ] **Step 3: Create individual blog post page**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import GradientBackground from "@/components/GradientBackground";
import { getBlogPost, getBlogSlugs } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — QUANTT Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <GradientBackground variant="short">
      <article className="mx-auto max-w-3xl px-6 pt-32 pb-20">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-light">
          {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}{" "}
          &middot; {post.author}
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">
          {post.title}
        </h1>

        <div className="prose-invert prose-sm mt-10 max-w-none prose-headings:font-heading prose-headings:text-white prose-p:text-white/75 prose-a:text-blue-light prose-strong:text-white prose-li:text-white/75">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </GradientBackground>
  );
}
```

Note: The `prose-*` classes use `@tailwindcss/typography`, which was installed in Task 1 and configured via `@plugin` in `globals.css`.

- [ ] **Step 4: Verify blog**

```bash
npm run dev
```

Open `http://localhost:3000/blog`. Verify post listing shows two sample posts.
Click a post — verify full content renders with good typography.

- [ ] **Step 5: Commit**

```bash
git add components/BlogCard.tsx app/blog/ package.json app/globals.css
git commit -m "feat: add Blog listing and individual post pages with MDX rendering"
```

---

## Task 15: Contact Page

**Files:**
- Create: `app/contact/page.tsx`

- [ ] **Step 1: Create Contact page**

```tsx
import type { Metadata } from "next";
import GradientBackground from "@/components/GradientBackground";
import SectionLabel from "@/components/SectionLabel";
import ScrollReveal from "@/components/ScrollReveal";
import { getSiteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact — QUANTT",
  description: "Get in touch with the QUANTT team at Queen's University.",
};

export default function ContactPage() {
  const config = getSiteConfig();

  return (
    <GradientBackground variant="short">
      <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
        <ScrollReveal>
          <SectionLabel>
            <span className="text-blue-light">Reach Out</span>
          </SectionLabel>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white md:text-4xl">
            Contact Us
          </h1>
        </ScrollReveal>

        {/* Recruiting Banner */}
        {config.recruiting && (
          <ScrollReveal>
            <div className="mt-10 rounded-lg border border-green-400/30 bg-green-400/10 p-6">
              <h2 className="text-lg font-bold text-white">
                🎉 We&apos;re Recruiting!
              </h2>
              {config.recruitingDetails && (
                <p className="mt-2 text-sm text-white/80">
                  {config.recruitingDetails}
                </p>
              )}
              {config.recruitingUrl && (
                <a
                  href={config.recruitingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block rounded bg-primary px-5 py-2 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary/80"
                >
                  Apply Now
                </a>
              )}
            </div>
          </ScrollReveal>
        )}

        {/* Contact Info */}
        <ScrollReveal>
          <div className="mt-10 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white">Email</h3>
              <a
                href="mailto:quanttgroup@gmail.com"
                className="text-sm text-blue-light hover:text-white"
              >
                quanttgroup@gmail.com
              </a>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Social</h3>
              <div className="mt-2 flex flex-col gap-2">
                {[
                  { href: "https://www.facebook.com/QUANTTpage", label: "Facebook" },
                  { href: "https://www.linkedin.com/company/quanttqueens/", label: "LinkedIn" },
                  { href: "https://www.instagram.com/quanttqueens", label: "Instagram" },
                  { href: "https://linktr.ee/quantt", label: "Linktree" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-light hover:text-white"
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </GradientBackground>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/contact/
git commit -m "feat: add Contact page with recruitment toggle and social links"
```

---

## Task 16: 404 Page

**Files:**
- Create: `app/not-found.tsx`

- [ ] **Step 1: Create custom 404 page**

```tsx
import Link from "next/link";
import GradientBackground from "@/components/GradientBackground";

export default function NotFound() {
  return (
    <GradientBackground variant="short">
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-7xl font-bold text-white/20">404</p>
        <h1 className="mt-4 font-heading text-2xl font-bold text-white">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-white/60">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 rounded bg-primary px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-primary/80"
        >
          Back to Home
        </Link>
      </div>
    </GradientBackground>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/not-found.tsx
git commit -m "feat: add custom 404 page"
```

---

## Task 17: Final Polish and Verification

**Files:**
- Modify: various files for adjustments

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 3: Test all routes in dev server**

```bash
npm run dev
```

Manually verify each route:
- `http://localhost:3000` — homepage with all sections
- `http://localhost:3000/education` — accordion works
- `http://localhost:3000/partners` — partner cards display
- `http://localhost:3000/team` — team members and projects
- `http://localhost:3000/blog` — blog listing
- `http://localhost:3000/blog/canadian-quant-companies` — full blog post
- `http://localhost:3000/contact` — contact info + recruiting banner
- `http://localhost:3000/nonexistent` — custom 404

Check:
- [ ] Navbar hides on scroll down, shows on scroll up
- [ ] Mobile hamburger menu works (resize browser)
- [ ] Scroll animations fire on each section
- [ ] Particle canvas runs on desktop, not on mobile-width
- [ ] All nav links work
- [ ] Footer social links open correct URLs
- [ ] Mailto link works

- [ ] **Step 4: Fix any issues found during testing**

Address any visual/layout/build issues discovered during Step 3.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete QUANTT website — all pages, components, and content"
```

---

## Summary

| Task | Description | Commits |
|------|-------------|---------|
| 1 | Project scaffolding | Next.js + Tailwind v4 + fonts |
| 2 | Content loading utilities | lib/content.ts, lib/blog.ts + tests |
| 3 | Seed content files | All YAML/MD/MDX sample content |
| 4 | Shared building blocks | SectionLabel, GlassCard, GradientBackground, ScrollReveal |
| 5 | Navbar | Fixed nav with scroll behavior + mobile menu |
| 6 | Footer | Dark footer with social links |
| 7 | Root layout assembly | Fonts, navbar, footer, metadata |
| 8 | Hero | Particle canvas, rotating text, CTAs |
| 9 | Homepage sections | Mission, ThreePillars, UpcomingEvents |
| 10 | Homepage assembly | Wire all homepage sections |
| 11 | Education page | Accordion + chapters from MD |
| 12 | Partners page | Partner cards from YAML |
| 13 | Team & Projects page | Team + project cards from MD |
| 14 | Blog | Listing + MDX post rendering |
| 15 | Contact page | Contact info + recruitment toggle |
| 16 | 404 page | Custom not-found |
| 17 | Final polish | Build, test, visual verification |
