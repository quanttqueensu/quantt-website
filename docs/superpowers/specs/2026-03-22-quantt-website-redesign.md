# QUANTT Website Redesign — Design Spec

## Overview

Rebuild the QUANTT (Queen's University Algorithmic Network & Trading Team) website as a modern static site. Replaces the current WordPress + Semplice setup (expired SSL, costly VPS, hard to edit) with a fast, secure, free-to-host Next.js site on Vercel.

**Design direction:** Modernized refresh — keep content and brand identity, elevate everything else. Dark, data-driven aesthetic that says "quant" at first glance, with clean readability throughout.

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 15 (App Router, TypeScript) | Static export, React ecosystem, familiar to most CS students |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration |
| Content | MDX + YAML data files | Blog posts in MDX, structured data in YAML, all git-versioned |
| Fonts | Inter + Merriweather via `next/font/google` | Self-hosted for performance |
| Animations | CSS transitions + Intersection Observer + Canvas | Lightweight, no heavy libraries |
| Deployment | Vercel (free tier) | Native Next.js, auto-deploy on push, free SSL |
| Domain | quantt.ca pointed to Vercel | CNAME to `cname.vercel-dns.com`, auto-provisioned SSL |

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Homepage — hero, mission, three pillars, upcoming events |
| `/education` | Curriculum accordion (6 chapters) |
| `/partners` | Current + past partner showcase |
| `/team` | Leadership + project showcase (combined page) |
| `/blog` | Blog post listings + `/blog/[slug]` for individual posts |
| `/contact` | Contact info, social links, recruitment CTA (toggleable) |

## Project Structure

```
quantt-website/
├── app/
│   ├── layout.tsx              # Root layout (Navbar + Footer + GradientBackground)
│   ├── page.tsx                # Homepage
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
│   ├── events.yml              # Upcoming events list
│   └── partners.yml            # Partner data
├── public/
│   ├── images/
│   └── video/                  # If hero video is kept as fallback
├── lib/
│   ├── blog.ts                 # MDX loading utilities
│   └── content.ts              # YAML/MD content loading
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

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
   - Fading grid overlay for data-driven texture
   - Overline: "Queen's University Algorithmic Network & Trading Team"
   - Heading: "Tomorrow's Talent in [rotating text]" — cycles through "Quantitative Finance", "Algo Trading", "Data Science" with fade transitions
   - Subtitle paragraph describing the club
   - Two CTAs: "Get Involved" (solid blue button) + "Our Work" (text link with down arrow)

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
- Accordion component with 6 chapters:
  - Ch1: Introduction to Capital Markets
  - Ch2: Introduction to Algo-trading
  - Ch3: Time Series Analysis
  - Ch4: Feature Engineering
  - Ch5: Computational Statistics and Probability
  - Ch6: Portfolio Optimization
- Click to expand/collapse with smooth height animation
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

- **Projects section**: showcase cards
  - Title, description, tech stack tags, status badge (active/completed)
  - Data from `content/projects/*.md` files
  - Visual divider between leadership and projects sections

### Blog (`/blog`)

- Post listing page with cards: title, date, author, excerpt, optional cover image
- Individual post pages (`/blog/[slug]`) with full MDX content, good reading typography
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
- Recruitment CTA: controlled by a `recruiting: true/false` flag in config
  - When active: prominent "We're Recruiting!" banner with application details
  - When inactive: section hidden cleanly
- Linktree link

## Shared Components

| Component | Purpose |
|-----------|---------|
| `Navbar` | Fixed position, transparent on hero → solid dark on scroll, hide on scroll-down / show on scroll-up, hamburger on mobile |
| `Footer` | Dark navy, logo, email mailto, social icons, copyright |
| `GradientBackground` | Reusable wrapper with configurable gradient range (full for homepage, shorter for inner pages) |
| `GlassCard` | Frosted glass card with blur, border, hover lift effect |
| `Accordion` | Expand/collapse with smooth max-height transition |
| `SectionLabel` | Uppercase overline text component |
| `Hero` | Full-viewport hero with canvas animation, rotating text |

## Animations

| Animation | Technique | Where |
|-----------|-----------|-------|
| Particle network / chart lines | Canvas API or animated SVG | Hero section |
| Rotating hero text | CSS fade transition on interval | Hero heading |
| Scroll reveals | Intersection Observer + CSS `opacity`/`translateY` transition | All sections |
| Accordion expand | CSS `max-height` + `overflow: hidden` transition | Education page |
| Navbar transition | CSS `background-color` + `opacity` transition on scroll | Navbar |
| Card hover | CSS `transform: translateY(-2px)` + border glow | All cards |

## Responsiveness

- Mobile-first Tailwind breakpoints (`sm`, `md`, `lg`, `xl`)
- Hero: text scales down, CTAs stack vertically
- Three pillars: 3-col → 1-col on mobile
- Event/team/project cards: grid → stack
- Navbar: full nav → hamburger with slide-out menu
- All interactive targets minimum 44px

## Performance

- Static export — pure HTML/CSS/JS, CDN-distributed via Vercel
- `next/image` for optimized images (WebP conversion, lazy loading, responsive srcset)
- Self-hosted fonts via `next/font` (no external requests)
- Canvas animation only runs when hero is in viewport

## SEO

- Per-page `<title>` and `<meta name="description">`
- Open Graph tags (title, description, image) for social sharing
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Blog posts generate individual OG tags from frontmatter

## Security

- No server, no database, no admin panel — near-zero attack surface
- Static files served from Vercel CDN
- All external links: `rel="noopener noreferrer"` and `target="_blank"`
- No user-input forms (contact is mailto, recruitment is informational)
- Auto-renewed SSL via Vercel (never expires)
- No cookies, no tracking scripts (unless analytics added later)

## Content Management

All content editable via git-versioned files:

- **Blog posts**: add/edit MDX files in `content/blog/`
- **Team members**: add/edit MD files in `content/team/` with frontmatter (name, role, photo, bio)
- **Projects**: add/edit MD files in `content/projects/` with frontmatter (title, description, tech, status)
- **Events**: edit `content/events.yml` — simple list of date, title, location
- **Partners**: edit `content/partners.yml` — name, logo path, description, current/past status
- **Recruitment toggle**: flip `recruiting: true/false` in a config file

Template files and a README guide will be included for each content type.

## Deployment

1. Push to `main` branch on GitHub
2. Vercel auto-builds and deploys (~60 seconds)
3. Preview deploys on PRs for review
4. Custom domain: point `quantt.ca` CNAME to `cname.vercel-dns.com`
5. SSL auto-provisioned by Vercel

## Social & Contact

- Email: quanttgroup@gmail.com
- Facebook: https://www.facebook.com/QUANTTpage
- LinkedIn: https://www.linkedin.com/company/quanttqueens/
- Instagram: https://www.instagram.com/quanttqueens
- Linktree: https://linktr.ee/quantt
