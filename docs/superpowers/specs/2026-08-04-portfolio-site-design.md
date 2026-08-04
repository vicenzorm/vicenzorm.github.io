# Portfolio Site — Design Spec

**Date:** 2026-08-04
**Owner:** Vicenzo Ribas Másera
**Status:** Approved for planning

## Goal

A personal portfolio site with personality: dense, typographic, first-person, human. It has one job — a hiring manager or engineer who lands on it understands within ninety seconds who Vicenzo is, what he has shipped, and how to reach him, and can then go deeper on any single project.

The register is a personal site that happens to be a portfolio, not a marketing page that happens to mention a person. References: jkwon.co (primary), mikkelmalmberg.com, mirzakhani.io.

## Non-goals

These are explicitly out of scope for v1. They are recorded so they are not re-litigated mid-build.

- No blog, essays, notes, or writing section.
- No "now" page.
- No CMS, no database, no server, no analytics.
- No contact form. Email is a `mailto:` link.
- No imagery, illustration, or video. The design is typographic.
- No client-side routing, no view transitions between pages.
- No i18n. English only, despite the Portuguese resume existing.

## Audience

1. **Hiring managers and recruiters** for iOS engineering roles. Skimming. Need shipped-product evidence and a resume fast.
2. **Engineers** evaluating technical depth. Want architecture decisions and tradeoffs, which is what the case studies exist for.
3. **Peers and collaborators.** Want to know what he is like. This is what the prose voice is for.

## Architecture

Astro 7 with static output. Static HTML is emitted at build time; no JavaScript framework ships to the browser.

### Surfaces

| Route | Content |
| --- | --- |
| `/` | Single dense page: intro, work, projects, contact |
| `/projects/[slug]` | One case study per project |
| `/404` | Minimal, in-voice |

### Content model

Case studies live in `src/content/projects/*.md` as an Astro content collection with a Zod schema:

```
title      string
tagline    string          one line, shown on the home page row
role       string          e.g. "Solo" | "5-person team"
year       string
order      number          controls home page ordering
stack      string[]        rendered as a plain comma list, not chips
summary    string          2-3 sentences, used for meta description and OG
metrics    string[]        optional; rendered in the case study header
links      { appStore?: url, github?: url }
draft      boolean         excluded from build when true
```

The route slug is derived from the filename by Astro and is not part of the schema.

The schema is the content contract. Malformed frontmatter fails the build rather than rendering wrong. Adding a fourth project is one Markdown file and zero code changes — this is the extensibility requirement that drove the choice of Astro over hand-written HTML.

### Components

Each has one purpose, takes at most three props, and can be understood without reading its callers.

- `Intro` — prose block, no props, content inline. The voice lives here.
- `WorkEntry` — org, role, dates, 2-3 lines. Used for Apple Developer Academy and PUCRS.
- `ProjectRow` — title, tagline, year, href. The hover interaction lives here.
- The case study layout — frontmatter header plus rendered Markdown body — lives directly in the `/projects/[...id]` route file. It has exactly one caller, so extracting it into a component would add indirection without adding a boundary.
- `Contact` — email, GitHub, LinkedIn, resume PDF.
- `Seo` — meta tags, OG, and JSON-LD. The only component that knows about structured data.

### Repository

The repo is named `vicenzorm.github.io` — a GitHub Pages *user* site, so `base: '/'` and `site: 'https://vicenzorm.github.io'`. A project-site repo would force a `/Portfolio/` prefix through every internal URL, asset path, and JSON-LD `@id`; the user-site naming avoids that class of bug entirely.

Deployment is GitHub Actions using the first-party `withastro/action`, triggered on push to `main`. No custom domain in v1; the config keeps `site` in one place so adding one later is a one-line change.

### Dependencies

Deliberately minimal and pinned: `astro@7.1.6`, `@astrojs/sitemap@3.7.3`, `@fontsource-variable/inter@5.3.0`, `@fontsource/instrument-serif@5.3.0`. Nothing else without a new decision.

## Visual system

Warm paper with a single accent. All tokens are CSS custom properties in one `global.css`. No CSS framework, no utility classes, no preprocessor.

### Color

| Token | Light | Dark |
| --- | --- | --- |
| `--surface` | `#FDFBF7` | `#14120F` |
| `--ink` | `#1A1815` | `#EDE8E0` |
| `--ink-muted` | `#5C564E` | `#A39C91` |
| `--rule` | `#E3DDD2` | `#2B2721` |
| `--accent` | `#B4462A` | `#E0714E` |

Dark mode is a token swap under `prefers-color-scheme`, not a second stylesheet. Every pairing must clear WCAG AA (4.5:1 body, 3:1 large text) in both themes. The palette above was computed against that bar rather than eyeballed:

| Pairing | Light | Dark |
| --- | --- | --- |
| accent on surface | 5.31:1 | 6.00:1 |
| ink-muted on surface | 7.00:1 | 6.99:1 |

`--ink` on `--surface` clears AAA in both themes by a wide margin. `--rule` is decorative and exempt.

The accent appears in exactly three places: link underlines, one highlighted phrase in the intro, and the Shiro App Store link. Restraint is the point — a fourth use dilutes the other three.

### Typography

- Headings: **Instrument Serif**. Body and UI: **Inter**.
- Both self-hosted via Fontsource (`@fontsource-variable/inter`, `@fontsource/instrument-serif`), which vendors subset `woff2` files into the build. No Google Fonts request — it is a third-party round trip and a privacy leak for zero benefit.
- Fluid scale via `clamp()` against viewport width. No breakpoint-triggered size jumps.
- Measure capped at `68ch`. Body leading `1.6`, heading leading `1.15`.

### Layout

Single centered column, `max-width: 42rem`, generous vertical rhythm. Sections separated by whitespace and hairline rules — no cards, no shadows, no gradients, no borders around content blocks. The page must read as a document.

## Interaction

Two details. Both are pure CSS and both are disabled under `prefers-reduced-motion: reduce`.

1. **Project rows** — on hover and on `:focus-visible`, the row translates 4px right and a hairline rule draws left-to-right beneath it.
2. **Links** — the accent underline wipes in from the left rather than appearing instantly.

The Shiro easter egg discussed during design is **deferred**, not cancelled. It is out of scope for v1.

## Discoverability

The stated goal was "ATS-optimized." ATS software parses uploaded resume files and never crawls a website, so that goal is served by two separate mechanisms:

**On the site** — semantic landmarks (`header`/`main`/`section`/`footer`), exactly one `h1`, all content as real selectable text. `@astrojs/sitemap`, a `robots.txt`, and OG/Twitter meta. JSON-LD in `Seo`:

- `Person` — name, `jobTitle`, `url`, `sameAs` (GitHub, LinkedIn), `alumniOf` (PUCRS), `knowsAbout` (Swift, SwiftUI, The Composable Architecture, CoreML, HealthKit, Swift Concurrency, …).
- `SoftwareApplication` — Shiro, linked to its App Store URL.

Keyword coverage matches real iOS job postings and is written into prose. No hidden text, no keyword-stuffed containers — these are penalized by search engines and read as dishonest by humans.

**In the resume** — `Resumes/vicenzo-resume-en.pdf` is copied to `public/` and linked from `Contact`. That PDF remains the actual ATS artifact and is optimized separately from this project, via the `resume-ats-optimizer` skill.

## Verification

There are no unit tests. The site has no logic, no state, and no branching — tests over static content assert that strings equal themselves, which is theater. The real gates are:

- `astro check` passes with zero errors.
- `astro build` completes clean; the content collection schema validates every project file.
- Playwright over the built output: Lighthouse ≥95 on Performance, Accessibility, Best Practices, and SEO.
- axe-core: zero violations, both themes.
- Contrast audit: every token pairing meets AA in both themes.
- Manual keyboard-only traversal — skip link, focus order, visible focus rings throughout.
- The `web-design-guidelines` skill runs a final review pass before ship.

A build that fails any gate does not ship.

## Tooling

| Stage | Tool | Rationale |
| --- | --- | --- |
| Spec → plan → execute | `superpowers:brainstorming` → `writing-plans` → `executing-plans` | The SDD spine for this project. |
| Visual layer | `minimalist-ui` | Matches the chosen direction: warm monochrome, typographic contrast, no gradients, no heavy shadows. |
| Case study copy | `portfolio-case-study-writer` | Vendored in `.agents/skills/`. Converts resume bullets into full case studies. |
| Resume PDF | `resume-ats-optimizer`, `tech-resume-optimizer` | Vendored. Applied to the PDF, not the site. |
| Final audit | `web-design-guidelines` | Vendored. Runs the accessibility and UX review. |
| Verification | Playwright MCP | Lighthouse, axe, screenshots. |

The `gsd-*` suite is not used. It is a second, parallel spec-driven-development framework; running two simultaneously produces duplicate and diverging specs, roadmaps, and phase state. One framework, chosen deliberately.

## Phasing

Each phase ends in a verifiable state and an atomic commit.

1. **Scaffold** — `vicenzorm.github.io` repo, Astro init, config, GitHub Actions deploy. Ends with a placeholder page live at the real URL. Deployment is proven before there is anything to lose.
2. **Design system** — tokens, self-hosted fonts, fluid type scale, layout primitives, dark mode. Verified against a type-specimen page.
3. **Home page** — intro, work, project rows, contact. The voice is written here.
4. **Case study content** — three Markdown files (Shiro, Build Together, Equillibrium) via `portfolio-case-study-writer`.
5. **Case study template** — `/projects/[slug]` layout and Markdown prose styles.
6. **Discoverability** — `Seo` component, JSON-LD, sitemap, robots, resume PDF.
7. **Audit and ship** — the full §Verification gate, then release.

## Decisions

| Decision | Rationale |
| --- | --- |
| Astro over vanilla HTML | Markdown-powered case studies were a stated requirement. Vanilla would mean hand-editing four HTML files per content change. |
| Astro over Next.js | A React runtime to render four pages of static text is unjustified weight against a crawlability goal. |
| Static output, no client framework | Fastest possible load; every byte of JS would have to earn its place. |
| Self-hosted fonts | Removes a third-party round trip and a privacy leak. |
| No tests | No logic exists to test. Verification is build gates plus audits. |
| User-site repo naming | Avoids a permanent base-path prefix through every URL and asset. |
| One SDD framework | `superpowers` only; `gsd-*` would duplicate and diverge. |
