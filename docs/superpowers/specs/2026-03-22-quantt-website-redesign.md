# QUANTT Website Redesign — Design Spec

## Overview

Rebuild the QUANTT (Queen's University Algorithmic Network & Trading Team) website as a modern static site. Replaces the current WordPress + Semplice setup (expired SSL, costly VPS, hard to edit) with a fast, secure, free-to-host Next.js site on Vercel.

**Design direction:** Modernized refresh — keep content and brand identity, elevate everything else. Dark, data-driven aesthetic that says "quant" at first glance, with clean readability throughout.

**Note:** The current site's Timeline section is intentionally replaced by the Upcoming Events section, which serves a similar visual purpose while providing more actionable, up-to-date content.

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 15 (App Router, TypeScript) | React ecosystem, familiar to most CS students |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration, CSS-based `@theme` config |
| Content | MDX + YAML data files | Blog posts in MDX, structured data in YAML, all git-versioned |
| Fonts | Inter + Merriweather via `next/font/google` | Self-hosted for performance |
| Images | `next/image` with Vercel image optimization | WebP conversion, lazy loading, responsive srcset |
| Animations | CSS transitions + Intersection Observer + Canvas | Lightweight, no heavy libraries |
| Deployment | Vercel (free tier) | Native Next.js, auto-deploy on push, free SSL, image optimization |
| Domain | quantt.ca pointed to Vercel | CNAME to `cname.vercel-dns.com`, auto-provisioned SSL |

**Deployment model:** Standard Vercel deployment (not pure static export). This enables `next/image` optimization, server-side image processing, and preview deploys. Vercel's free tier handles this natively for Next.js.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Homepage — hero, mission, three pillars, upcoming events |
| `/education` | Curriculum accordion (6 chapters) |
| `/partners` | Current + past partner showcase |
| `/team` | Leadership + project showcase (combined page) |
| `/blog` | Blog post listings + `/blog/[slug]` for individual posts |
| `/contact` | Contact info, social links, recruitment CTA (toggleable) |
| `not-found` | Custom 404 page (handles old WordPress URLs like `/wp-admin`, `/wp-content/...`) |

## Project Structure

```
quantt-website/
├── app/
│   ├── layout.tsx              # Root layout (Navbar + Footer + GradientBackground)
│   ├── page.tsx                # Homepage
│   ├── not-found.tsx           # Custom 404 page
│   ├── education/
│   │   └── page.tsx
│   ├── partners/
│   │   └── page.tsx
│   ├── team/
│   │   └── page.tsx
│   ├── blog/
│   │   ├── page.tsx            # Blog listing
│   │   └── [slug]/
│   │       └── page.tsx        # Individual post
│   └── contact/
│       └── page.tsx
├── app/globals.css             # Tailwind v4 @theme config (colors, fonts, tokens)
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── GradientBackground.tsx
│   ├── GlassCard.tsx
│   ├── Hero.tsx
│   ├── ThreePillars.tsx
│   ├── UpcomingEvents.tsx
│   ├── Accordion.tsx
│   ├── PartnerCard.tsx
│   ├── TeamMemberCard.tsx
│   ├── ProjectCard.tsx
│   ├── BlogCard.tsx
│   └── SectionLabel.tsx
├── content/
│   ├── blog/                   # MDX blog posts
│   ├── team/                   # MD files per member
│   ├── projects/               # MD files per project
│   ├── education/              # MD files per chapter
│   ├── config.yml              # Site-wide config (recruitment toggle, etc.)
│   ├── events.yml              # Upcoming events list
│   └── partners.yml            # Partner data
├── public/
│   ├── favicon.png             # Site favicon
│   └── images/                 # All images (logos, partners, team photos, etc.)
├── lib/
│   ├── blog.ts                 # MDX loading utilities
│   └── content.ts              # YAML/MD content loading
├── next.config.ts
└── package.json
```

**Note:** Tailwind CSS v4 uses CSS-based configuration via `@theme` in `globals.css` — there is no `tailwind.config.ts` file. All color tokens, font families, and spacing values are defined in `app/globals.css`.

## Visual Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `navy` | `#0a1628` | Hero background, footer |
| `navy-mid` | `#0f1d35` | Early gradient |
| `primary` | `#2452a1` | Brand blue, accents, links |
| `blue-mid` | `#1e3360` | Mid-gradient tones |
| `blue-light` | `#6b8fd4` | Accent text, highlights |
| `blue-grey` | `#c8d6ea` | Gradient endpoint |
| `text-light` | `#8a9fc4` | Body text on dark backgrounds |
| `text-dark` | `#0f1d35` | Headings on light backgrounds |
| `text-dark-body` | `#2a4060` | Body text on light backgrounds |
| `glass-bg` | `rgba(255,255,255,0.07)` | Glassmorphism card fill |
| `glass-border` | `rgba(255,255,255,0.1)` | Glassmorphism card border |

### Typography

| Element | Font | Weight | Style |
|---------|------|--------|-------|
| h1, h2 | Merriweather | 700 | Serif, large |
| h3, h4, body, nav | Inter | 400, 600 | Sans-serif |
| Overline labels | Inter | 600 | Uppercase, letter-spacing 2-3px, small |

### Design Language

- **Continuous gradient backgrounds** — dark navy to soft blue-grey, no hard section breaks. The page is one flowing surface.
- **Glassmorphism cards** — frosted glass effect with `backdrop-filter: blur(8px)`, subtle white border, used for pillars, events, team, projects.
- **Data-driven accents** — fading grid overlay and SVG chart lines in the hero area, reinforcing the quant identity.
- **Rounded corners** — 8px on cards, 4px on buttons.
- **Consistent spacing** — generous padding, breathing room between sections.

## Page Designs

### Homepage (`/`)

1. **Hero** (full viewport)
   - Dark gradient background with animated canvas particle network or flowing SVG chart lines
   - Canvas animation disabled on mobile (replaced with static gradient) to preserve battery/performance
   - Fading grid overlay for data-driven texture
   - Overline: "Queen's University Algorithmic Network & Trading Team"
   - Heading: "Tomorrow's Talent in [rotating text]" — cycles through "Quantitative Finance", "Algo Trading", "Data Science" with fade transitions
   - Subtitle paragraph describing the club
   - Two CTAs: "Get Involved" (solid blue button, links to `/contact`) + "Our Work" (text link with down arrow, smooth-scrolls to Three Pillars section)

2. **Mission — "Closing the Gap"**
   - Two-column layout: text left, photo right
   - Still on the gradient mid-tones, white text
   - Overline label + Merriweather heading + body paragraph

3. **Three Pillars**
   - Centered heading with overline
   - Three glassmorphism cards in a row: Collaboration, Research, Application
   - Each with icon, title, description

4. **Upcoming Events**
   - In the lighter gradient zone
   - Dark text, event cards with date, title, location
   - Pulled from `events.yml` — section auto-hides if no events listed
   - Cards use frosted glass style with higher white opacity for readability

5. **Footer** — dark navy bookend

### Education (`/education`)

- Shorter/subtler version of the gradient background
- Page header with title + subtitle
- Accordion component with 6 chapters, content loaded from `content/education/*.md`:
  - Ch1: Introduction to Capital Markets
  - Ch2: Introduction to Algo-trading
  - Ch3: Time Series Analysis
  - Ch4: Feature Engineering
  - Ch5: Computational Statistics and Probability
  - Ch6: Portfolio Optimization
- Click to expand/collapse with smooth `grid-template-rows: 0fr → 1fr` animation
- Active chapter highlighted with blue accent (`#2452a1`)

### Partners (`/partners`)

- Hero section: "Leveraging our talent-base to provide the value YOU need"
- Current partners: grid of cards with logo, name, description
  - Ontario Teachers' Pension Plan
  - Picton Investments
  - National Bank of Canada
  - Connor, Clark & Lunn
- CTA: "Looking for 2026-2027 Partners!" with mailto link
- Past partners section: smaller, muted styling
  - QuantConnect
  - Viewpoint Investment Partners
- All data from `partners.yml`

### Team & Projects (`/team`)

- **Leadership section**: grid of team member cards
  - Photo (circular crop), name, role, short bio
  - Data from `content/team/*.md` files
  - Grid: 3-4 columns desktop, 2 tablet, 1 mobile
  - Empty state: "Team roster coming soon" message

- **Projects section**: showcase cards
  - Title, description, tech stack tags, status badge (active/completed)
  - Data from `content/projects/*.md` files
  - Visual divider between leadership and projects sections
  - Empty state: "Projects coming soon" message

### Blog (`/blog`)

- Post listing page with cards: title, date, author, excerpt, optional cover image
- Individual post pages (`/blog/[slug]`) with full MDX content, good reading typography
- Empty state: "No posts yet — check back soon" message
- Frontmatter schema:
  ```yaml
  title: "Post Title"
  date: "2026-03-20"
  author: "Author Name"
  excerpt: "Brief description."
  coverImage: "/images/blog/cover.jpg"  # optional
  ```

### Contact (`/contact`)

- Contact email: quanttgroup@gmail.com (mailto link)
- Social links: Facebook, LinkedIn, Instagram
- Recruitment CTA: controlled by `recruiting: true/false` in `content/config.yml`
  - When active: prominent "We're Recruiting!" banner with application details
  - When inactive: section hidden cleanly
- Linktree link

### 404 Page (`not-found.tsx`)

- Matches site gradient aesthetic
- "Page not found" message with link back to homepage
- Handles stale WordPress URLs gracefully

## Content Schemas

### `content/config.yml`
```yaml
recruiting: true
recruitingDetails: "Applications open until April 15, 2026"
recruitingUrl: "https://linktr.ee/quantt"  # optional external link
copyright: "2026 QUANTT"
```

### `content/events.yml`
```yaml
- title: "Workshop: Intro to Algo Trading"
  date: "2026-03-28"
  time: "6:00 PM"
  location: "Goodes Hall 302"
  url: ""  # optional link to event page/signup

- title: "Guest Speaker: NBC Quant Desk"
  date: "2026-04-05"
  time: "5:30 PM"
  location: "Smith Hall 120"
```

### `content/partners.yml`
```yaml
current:
  - name: "Ontario Teachers' Pension Plan"
    logo: "/images/partners/otpp.png"
    description: "One of the world's largest institutional investors."

  - name: "National Bank of Canada"
    logo: "/images/partners/nbc.png"
    description: "Leading Canadian financial institution."

past:
  - name: "QuantConnect"
    logo: "/images/partners/quantconnect.png"
    description: "Open-source algorithmic trading platform."
```

### `content/team/*.md` frontmatter
```yaml
---
name: "Jane Smith"
role: "President"
photo: "/images/team/jane-smith.jpg"  # optional, shows initials placeholder if missing
order: 1                               # display order
bio: "4th year Commerce, specializing in quantitative finance."
linkedin: "https://linkedin.com/in/janesmith"  # optional
---
```

### `content/projects/*.md` frontmatter
```yaml
---
title: "Pairs Trading Algorithm"
description: "Statistical arbitrage strategy using cointegration analysis."
tech: ["Python", "pandas", "scikit-learn"]
status: "active"  # "active" or "completed"
order: 1
---

Optional body content in markdown for a longer project description.
```

### `content/education/*.md` frontmatter
```yaml
---
title: "Introduction to Capital Markets"
chapter: 1
---

Chapter content in markdown, rendered inside the accordion when expanded.
```

### `content/blog/*.mdx` frontmatter
```yaml
---
title: "Post Title"
date: "2026-03-20"
author: "Author Name"
excerpt: "Brief description."
coverImage: "/images/blog/cover.jpg"  # optional
---
```

## Shared Components

| Component | Purpose |
|-----------|---------|
| `Navbar` | Fixed position, transparent on hero → solid dark on scroll, hide on scroll-down / show on scroll-up, hamburger on mobile |
| `Footer` | Dark navy, logo, email mailto, social icons, dynamic copyright from `config.yml` |
| `GradientBackground` | Reusable wrapper with configurable gradient range (full for homepage, shorter for inner pages) |
| `GlassCard` | Frosted glass card with blur, border, hover lift effect |
| `Accordion` | Expand/collapse with smooth `grid-template-rows` transition |
| `SectionLabel` | Uppercase overline text component |
| `Hero` | Full-viewport hero with canvas animation (desktop) / static gradient (mobile), rotating text |

## Animations

| Animation | Technique | Where |
|-----------|-----------|-------|
| Particle network / chart lines | Canvas API or animated SVG (desktop only, disabled on mobile via `matchMedia`) | Hero section |
| Rotating hero text | CSS fade transition on interval | Hero heading |
| Scroll reveals | Intersection Observer + CSS `opacity`/`translateY` transition | All sections |
| Accordion expand | CSS `grid-template-rows: 0fr → 1fr` transition | Education page |
| Navbar transition | CSS `background-color` + `opacity` transition on scroll | Navbar |
| Card hover | CSS `transform: translateY(-2px)` + border glow | All cards |

## Responsiveness

- Mobile-first Tailwind breakpoints (`sm`, `md`, `lg`, `xl`)
- Hero: text scales down, CTAs stack vertically, canvas animation replaced with static gradient
- Three pillars: 3-col → 1-col on mobile
- Event/team/project cards: grid → stack
- Navbar: full nav → hamburger with slide-out menu
- All interactive targets minimum 44px

## Performance

- Vercel deployment with server-side image optimization via `next/image`
- WebP conversion, lazy loading, responsive srcset for all images
- Self-hosted fonts via `next/font` (no external requests)
- Canvas animation only runs when hero is in viewport, disabled on mobile
- Favicon: `public/favicon.png`

## SEO

- Per-page `<title>` and `<meta name="description">`
- Open Graph tags (title, description, image) for social sharing
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Blog posts generate individual OG tags from frontmatter
- Custom 404 page for graceful handling of old URLs

## Security

- No server-side user input processing — near-zero attack surface
- Static/ISR pages served from Vercel CDN
- All external links: `rel="noopener noreferrer"` and `target="_blank"`
- No user-input forms (contact is mailto, recruitment is informational)
- Auto-renewed SSL via Vercel (never expires)
- No cookies, no tracking scripts (unless analytics added later)

## Content Management

All content editable via git-versioned files:

- **Blog posts**: add/edit MDX files in `content/blog/`
- **Team members**: add/edit MD files in `content/team/` (see schema above)
- **Projects**: add/edit MD files in `content/projects/` (see schema above)
- **Education chapters**: add/edit MD files in `content/education/` (see schema above)
- **Events**: edit `content/events.yml` (see schema above)
- **Partners**: edit `content/partners.yml` (see schema above)
- **Recruitment toggle**: set `recruiting: true/false` in `content/config.yml`
- **Copyright text**: set `copyright` field in `content/config.yml`

Template files and a README guide will be included for each content type.

## Deployment

1. Push to `main` branch on GitHub
2. Vercel auto-builds and deploys (~60 seconds)
3. Preview deploys on PRs for review
4. Custom domain: point `quantt.ca` CNAME to `cname.vercel-dns.com`
5. SSL auto-provisioned by Vercel

## Verification Checklist

- [ ] All 6 pages render correctly (`/`, `/education`, `/partners`, `/team`, `/blog`, `/contact`)
- [ ] Custom 404 page works
- [ ] Blog posts load from MDX files
- [ ] Team members and projects load from MD files
- [ ] Education accordion loads chapter content from MD files
- [ ] Events load from YAML, section hides when empty
- [ ] Partners load from YAML (current and past sections)
- [ ] Recruitment banner toggles via `config.yml`
- [ ] Mobile responsive on all screen sizes
- [ ] Canvas hero animation works on desktop, falls back to static on mobile
- [ ] Navigation works including smooth scroll for "Our Work" CTA
- [ ] Navbar hides on scroll down, reappears on scroll up
- [ ] All partner logos display
- [ ] Accordion works on education page
- [ ] Social links open correct profiles
- [ ] Contact email mailto works
- [ ] Favicon displays
- [ ] OG tags render correctly for social sharing
- [ ] Empty states display for blog/team/projects when no content exists
- [ ] Build succeeds on Vercel
- [ ] Custom domain connected with valid SSL

## Social & Contact

- Email: quanttgroup@gmail.com
- Facebook: https://www.facebook.com/QUANTTpage
- LinkedIn: https://www.linkedin.com/company/quanttqueens/
- Instagram: https://www.instagram.com/quanttqueens
- Linktree: https://linktr.ee/quantt
