# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a dense, typographic, first-person portfolio site at `https://vicenzorm.github.io` with three Markdown-powered project case studies.

**Architecture:** Astro 7 emitting static HTML with zero client-side JavaScript. Case studies are Markdown files in a Zod-validated content collection, so adding a project is one file and no code. A single stylesheet of CSS custom properties carries the whole visual system, with dark mode as a token swap.

**Tech Stack:** Astro 7.1.6, `@astrojs/sitemap` 3.7.3, Fontsource (Inter Variable, Instrument Serif), GitHub Actions → GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-08-04-portfolio-site-design.md`

## Note on testing

The spec establishes that this site has no logic, no state, and no branching, and therefore ships no unit tests — tests over static content assert that strings equal themselves. This plan replaces the usual TDD red/green loop with **verification steps that have objective pass/fail criteria**: build exit codes, schema validation failures, HTTP status, axe violation counts, and Lighthouse scores. Every task still ends in a gate a reviewer can independently re-run.

## Global Constraints

Every task's requirements implicitly include this section.

- Astro 7.1.6, static output. No SSR adapter.
- Dependencies are limited to exactly four: `astro`, `@astrojs/sitemap`, `@fontsource-variable/inter`, `@fontsource/instrument-serif`. Adding a fifth requires a new decision, per the spec.
- Zero JavaScript shipped to the browser. No `client:*` directives anywhere.
- Repo is a GitHub Pages **user site**: `site: 'https://vicenzorm.github.io'`, **no `base`**.
- Exactly one `<h1>` per page.
- All animation sits behind `@media (prefers-reduced-motion: no-preference)`.
- Color tokens are exactly: surface `#FDFBF7`/`#14120F`, ink `#1A1815`/`#EDE8E0`, ink-muted `#5C564E`/`#A39C91`, rule `#E3DDD2`/`#2B2721`, accent `#B4462A`/`#E0714E` (light/dark).
- Accent appears in exactly two places in v1: link underlines and one highlighted phrase in the intro. The Shiro easter egg is deferred.
- Column width `42rem`; prose measure capped at `68ch`.
- English only. No imagery, illustration, icons, cards, shadows, or gradients.
- Voice is first person, conversational, specific. No "passionate about", no "I love building beautiful experiences", no exclamation marks.

**Ordering deviation from the spec:** the spec lists home page (phase 3) before case study content (phase 4). This plan swaps them — the home page renders project rows from the collection, so the collection must exist first. Same work, dependency-correct order.

---

### Task 1: Scaffold and prove the deploy pipeline

Ends with a placeholder page actually live at the real URL. Deployment is proven before there is anything to lose.

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`
- Create: `src/pages/index.astro`
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: nothing.
- Produces: a working `npm run build` emitting to `dist/`, and a `main`-push deploy.

- [ ] **Step 1: Scaffold Astro into the existing directory**

The `Site/` directory already contains `docs/` and a git repo. Scaffold in place with the empty template:

```bash
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict --skip-houston
```

Answer "yes" to continuing in a non-empty directory. It must not delete `docs/` or `.git/`.

- [ ] **Step 2: Install pinned dependencies**

```bash
npm install astro@7.1.6
npm install @astrojs/sitemap@3.7.3 @fontsource-variable/inter@5.3.0 @fontsource/instrument-serif@5.3.0
```

- [ ] **Step 3: Write the Astro config**

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vicenzorm.github.io',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
```

No `base` key. This is a user site; adding `base` here is the single most likely way to break every asset URL.

- [ ] **Step 4: Write a placeholder home page**

`src/pages/index.astro`:

```astro
---
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Vicenzo Ribas Másera</title>
  </head>
  <body>
    <h1>Vicenzo Ribas Másera</h1>
    <p>Site under construction.</p>
  </body>
</html>
```

- [ ] **Step 5: Verify the build succeeds locally**

```bash
npm run build
```

Expected: exit code 0, and `dist/index.html` exists containing "Vicenzo".

```bash
test -f dist/index.html && grep -c Vicenzo dist/index.html
```

Expected: prints `1` or greater.

- [ ] **Step 6: Add `.gitignore`**

```
dist/
node_modules/
.astro/
.DS_Store
```

- [ ] **Step 7: Write the deploy workflow**

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: withastro/action@v6

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

`withastro/action` detects the package manager from the lockfile, so `package-lock.json` **must** be committed.

- [ ] **Step 8: Create the GitHub repo and push**

The repo must be named exactly `vicenzorm.github.io`.

```bash
gh repo create vicenzorm.github.io --public --source=. --remote=origin
git add -A
git commit -m "Scaffold Astro site and deploy pipeline"
git push -u origin main
```

- [ ] **Step 9: Enable Pages with the Actions source**

```bash
gh api -X POST repos/vicenzorm/vicenzorm.github.io/pages -f build_type=workflow
```

If it returns 409, Pages is already enabled; confirm the source with:

```bash
gh api repos/vicenzorm/vicenzorm.github.io/pages --jq .build_type
```

Expected: `workflow`.

- [ ] **Step 10: Verify the site is live**

```bash
gh run watch --exit-status
curl -s -o /dev/null -w '%{http_code}\n' https://vicenzorm.github.io/
```

Expected: workflow succeeds, curl prints `200`. First deploy can take a few minutes to propagate; retry before treating a 404 as failure.

---

### Task 2: Design system

The visual foundation everything else consumes. Verified against a throwaway specimen page that is deleted before commit.

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/Base.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: Task 1's build.
- Produces: `Base.astro`, accepting props `{ title: string; description: string }` and a default `<slot />`. Every page uses it. CSS custom properties named below are relied on by Tasks 4 and 5.

- [ ] **Step 0: Load the `minimalist-ui` skill**

Invoke it before writing any CSS. Its remit — warm monochrome, typographic contrast, flat layout, no gradients, no heavy shadows — is the direction chosen in the spec, and it governs every styling decision in this task and in Tasks 4 and 5. The tokens below are the spec's; the skill informs how they are applied.

- [ ] **Step 1: Write the token and base stylesheet**

`src/styles/global.css`:

```css
@import '@fontsource-variable/inter';
@import '@fontsource/instrument-serif';

:root {
  --surface: #FDFBF7;
  --ink: #1A1815;
  --ink-muted: #5C564E;
  --rule: #E3DDD2;
  --accent: #B4462A;

  --font-display: 'Instrument Serif', ui-serif, Georgia, serif;
  --font-body: 'Inter Variable', ui-sans-serif, system-ui, sans-serif;

  --column: 42rem;
  --measure: 68ch;

  --step-0: clamp(1rem, 0.96rem + 0.22vw, 1.125rem);
  --step-1: clamp(1.25rem, 1.18rem + 0.36vw, 1.5rem);
  --step-2: clamp(1.56rem, 1.44rem + 0.6vw, 2rem);
  --step-3: clamp(1.95rem, 1.72rem + 1.1vw, 2.75rem);
  --step--1: clamp(0.83rem, 0.81rem + 0.12vw, 0.9rem);

  --space-xs: 0.5rem;
  --space-s: 1rem;
  --space-m: 2rem;
  --space-l: 4rem;
  --space-xl: 7rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --surface: #14120F;
    --ink: #EDE8E0;
    --ink-muted: #A39C91;
    --rule: #2B2721;
    --accent: #E0714E;
  }
}

*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  padding: var(--space-l) var(--space-m) var(--space-xl);
  background: var(--surface);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: var(--step-0);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

main { max-width: var(--column); margin-inline: auto; }

h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 400;
  line-height: 1.15;
  margin: 0 0 var(--space-s);
}

h1 { font-size: var(--step-3); }
h2 { font-size: var(--step-2); }
h3 { font-size: var(--step-1); }

p, li { max-width: var(--measure); }

a {
  color: inherit;
  text-decoration: none;
  background-image: linear-gradient(var(--accent), var(--accent));
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 100% 1px;
}

a:hover, a:focus-visible { color: var(--accent); }

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.skip-link {
  position: absolute;
  left: -9999px;
}
.skip-link:focus {
  left: var(--space-s);
  top: var(--space-s);
  background: var(--surface);
  padding: var(--space-xs) var(--space-s);
}

@media (prefers-reduced-motion: no-preference) {
  a {
    background-size: 0% 1px;
    transition: background-size 220ms ease, color 220ms ease;
  }
  a:hover, a:focus-visible { background-size: 100% 1px; }
}
```

The underline wipe is written so that **reduced motion is the base case** — a static full underline — and motion is layered on top. This ordering means a reduced-motion user gets a correct, fully-styled link rather than a degraded one.

- [ ] **Step 2: Write the base layout**

`src/layouts/Base.astro`:

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="sitemap" href="/sitemap-index.xml" />
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <main id="main">
      <slot />
    </main>
  </body>
</html>
```

`Seo` is added in Task 6; this layout is deliberately minimal until then.

- [ ] **Step 3: Point the placeholder page at the layout**

Replace `src/pages/index.astro`:

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Vicenzo Ribas Másera" description="iOS engineer.">
  <h1>Vicenzo Ribas Másera</h1>
  <p>Site under construction. <a href="https://github.com/vicenzorm">GitHub</a></p>
</Base>
```

- [ ] **Step 4: Verify fonts and tokens render**

```bash
npm run build
grep -o 'instrument-serif[^"]*woff2' -r dist/ | head -3
```

Expected: at least one vendored `.woff2` path, confirming Fontsource inlined the font rather than requesting Google Fonts.

```bash
grep -ri 'fonts.googleapis\|fonts.gstatic' dist/ | wc -l
```

Expected: `0`. Any hit is a spec violation.

- [ ] **Step 5: Visually verify both themes**

Run `npm run dev`, then use the Playwright MCP to load `http://localhost:4321/`, screenshot at 390px and 1280px widths in both `light` and `dark` color schemes. Confirm: cream background in light, near-black in dark, serif `h1`, sans body, link underline present and accent-colored on hover.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/layouts/Base.astro src/pages/index.astro package.json package-lock.json
git commit -m "Add design system tokens and base layout"
```

---

### Task 3: Content collection and case study copy

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/projects/shiro.md`
- Create: `src/content/projects/build-together.md`
- Create: `src/content/projects/equillibrium.md`

**Interfaces:**
- Consumes: nothing from prior tasks.
- Produces: collection `projects`. Entry shape consumed by Tasks 4 and 5:
  `entry.id` (string, from filename), `entry.data.{ title, tagline, role, year, order, stack, summary, metrics?, links: { appStore?, github? }, draft }`.

- [ ] **Step 1: Define the collection**

`src/content.config.ts` (note: **`src/content.config.ts`**, not `src/content/config.ts` — the latter is the pre-v5 location and is silently ignored):

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    role: z.string(),
    year: z.string(),
    order: z.number(),
    stack: z.array(z.string()).nonempty(),
    summary: z.string(),
    metrics: z.array(z.string()).optional(),
    links: z
      .object({
        appStore: z.string().url().optional(),
        github: z.string().url().optional(),
      })
      .default({}),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
```

- [ ] **Step 2: Write the Shiro case study**

Source material is `../Resumes/vicenzo-resume-en.typ`. Use the `portfolio-case-study-writer` skill to expand the resume bullets into prose. Body sections, in order: **The problem** → **What I built** → **Decisions that mattered** → **What shipped**. Every claim must trace to something true in the resume; invent nothing.

`src/content/projects/shiro.md`:

```markdown
---
title: Shiro
tagline: An arcade game, live on the App Store
role: 5-person team
year: '2025'
order: 1
stack: [Swift, SpriteKit, GameplayKit, GameKit, Game Center]
summary: >-
  A complete iOS arcade game taken from concept to App Store launch with a
  five-person team, with Game Center leaderboards and achievements.
links:
  appStore: https://apps.apple.com/br/app/shiro/id6752502968
---

## The problem

[Written during execution via portfolio-case-study-writer.]
```

The frontmatter above is final and must be used verbatim. The body prose is written during execution — it is content, not structure, and cannot be pre-specified here without inventing claims.

- [ ] **Step 3: Write the Build Together case study**

`src/content/projects/build-together.md`, frontmatter verbatim:

```markdown
---
title: Build Together
tagline: Real-time team collaboration for retros and planning poker
role: ~50-person squad organization
year: '2025'
order: 2
stack: [Swift, SwiftUI, The Composable Architecture, WebSockets, iOS, macOS]
summary: >-
  A cross-platform iOS and macOS collaboration tool built in raw TCA, with
  live WebSocket state sync, optimistic updates, and automatic reconnection.
metrics:
  - Cross-platform iOS + macOS from one codebase
  - Live shared state across concurrent participants
---

## The problem

[Written during execution via portfolio-case-study-writer.]
```

- [ ] **Step 4: Write the Equillibrium case study**

`src/content/projects/equillibrium.md`, frontmatter verbatim:

```markdown
---
title: Equillibrium
tagline: An on-device walking and mobility companion
role: Solo
year: '2026'
order: 3
stack: [Swift, SwiftUI, MVVM-C, HealthKit, CoreML, Foundation Models, App Intents, WidgetKit]
summary: >-
  An iPhone gait companion that turns five passively collected HealthKit
  walking metrics into a personal baseline and a 0–100 Mobility Score,
  entirely on device.
metrics:
  - Sub-1MB CoreML classifier, inference under 50ms
  - Daily results in under 2 seconds
  - Zero network calls
---

## The problem

[Written during execution via portfolio-case-study-writer.]
```

- [ ] **Step 5: Verify the schema validates**

```bash
npm run build
```

Expected: exit 0. Then deliberately break it to prove the gate is real:

```bash
sed -i '' 's/^order: 1$/order: "one"/' src/content/projects/shiro.md
npm run build; echo "exit=$?"
```

Expected: non-zero exit, error naming `order` and `Expected number, received string`. Restore with `git checkout src/content/projects/shiro.md` or by reverting the edit.

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts src/content/projects/
git commit -m "Add projects content collection and three case studies"
```

---

### Task 4: Home page

**Files:**
- Create: `src/components/Intro.astro`, `src/components/WorkEntry.astro`, `src/components/ProjectRow.astro`, `src/components/Contact.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `Base.astro` from Task 2; the `projects` collection from Task 3.
- Produces: the rendered home page. No component here is imported by later tasks.

Component props, exactly:
- `WorkEntry`: `{ org: string; role: string; dates: string }` plus `<slot />` for the body.
- `ProjectRow`: `{ title: string; tagline: string; year: string; href: string }`.
- `Intro` and `Contact`: no props; content is inline.

- [ ] **Step 1: Write `ProjectRow`**

```astro
---
interface Props {
  title: string;
  tagline: string;
  year: string;
  href: string;
}
const { title, tagline, year, href } = Astro.props;
---
<a class="row" href={href}>
  <span class="row__title">{title}</span>
  <span class="row__tagline">{tagline}</span>
  <span class="row__year">{year}</span>
</a>
```

- [ ] **Step 2: Add row styles to `global.css`**

Append:

```css
.row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0 var(--space-s);
  padding: var(--space-s) 0;
  border-top: 1px solid var(--rule);
  background-image: none;
  position: relative;
}
.row__title { font-family: var(--font-display); font-size: var(--step-1); }
.row__tagline { grid-column: 1; color: var(--ink-muted); font-size: var(--step--1); }
.row__year { grid-row: 1; color: var(--ink-muted); font-size: var(--step--1); }
.row:hover .row__title,
.row:focus-visible .row__title { color: var(--accent); }

.row::after {
  content: '';
  position: absolute;
  left: 0; bottom: 0;
  height: 1px;
  width: 100%;
  background: var(--accent);
}

@media (prefers-reduced-motion: no-preference) {
  .row { transition: transform 220ms ease; }
  .row:hover, .row:focus-visible { transform: translateX(4px); }
  .row::after {
    width: 0;
    transition: width 260ms ease;
  }
  .row:hover::after, .row:focus-visible::after { width: 100%; }
}
```

Note `background-image: none` — it cancels the global link underline, because rows get the rule-draw treatment instead. Both interactions on one element would be noise.

- [ ] **Step 3: Write `WorkEntry`**

```astro
---
interface Props {
  org: string;
  role: string;
  dates: string;
}
const { org, role, dates } = Astro.props;
---
<div class="work">
  <div class="work__head">
    <strong>{org}</strong>
    <span class="work__dates">{dates}</span>
  </div>
  <div class="work__role">{role}</div>
  <slot />
</div>
```

With styles appended to `global.css`:

```css
.work { padding: var(--space-s) 0; border-top: 1px solid var(--rule); }
.work__head { display: flex; justify-content: space-between; gap: var(--space-s); }
.work__dates, .work__role { color: var(--ink-muted); font-size: var(--step--1); }
```

- [ ] **Step 4: Write `Intro`**

First person, specific, no filler. One phrase wrapped in `<em class="accent">` — this is the single non-link use of the accent permitted by the spec. Content is written during execution to match Vicenzo's voice; the structure is:

```astro
---
---
<section class="intro">
  <h1>Vicenzo Ribas Másera</h1>
  <p><!-- Who he is and what he ships, in 2-3 sentences. Contains exactly one <em class="accent">…</em>. --></p>
  <p><!-- Something human: how he works, what he's drawn to. 1-2 sentences. --></p>
</section>
```

Add to `global.css`:

```css
.intro p { font-size: var(--step-1); }
.accent { color: var(--accent); font-style: normal; }
```

- [ ] **Step 5: Write `Contact`**

```astro
---
---
<section>
  <h2>Elsewhere</h2>
  <ul class="contact">
    <li><a href="mailto:vicenzomasera@icloud.com">vicenzomasera@icloud.com</a></li>
    <li><a href="https://github.com/vicenzorm" rel="me">GitHub</a></li>
    <li><a href="https://linkedin.com/in/vicenzomasera" rel="me">LinkedIn</a></li>
    <li><a href="/vicenzo-masera-resume.pdf">Résumé (PDF)</a></li>
  </ul>
</section>
```

```css
.contact { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: var(--space-s) var(--space-m); }
```

The resume PDF is placed in `public/` in Task 6; this link 404s until then, which is expected and caught by Task 7's link check.

- [ ] **Step 6: Assemble the home page**

`src/pages/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import Base from '../layouts/Base.astro';
import Intro from '../components/Intro.astro';
import WorkEntry from '../components/WorkEntry.astro';
import ProjectRow from '../components/ProjectRow.astro';
import Contact from '../components/Contact.astro';

const projects = (await getCollection('projects', ({ data }) => !data.draft))
  .sort((a, b) => a.data.order - b.data.order);
---
<Base
  title="Vicenzo Ribas Másera — iOS Engineer"
  description="iOS engineer shipping native Swift and SwiftUI products end to end — from a published App Store title to on-device CoreML intelligence."
>
  <Intro />

  <section>
    <h2>Work</h2>
    <WorkEntry org="Apple Developer Academy" role="iOS Developer" dates="2025 — 2026">
      <p>Shipped three native Apple products from zero to release across iPhone and Mac, owning ideation, architecture, implementation, and App Store submission. Facilitated Agile delivery for a ~50-person Spotify-model squad organization.</p>
    </WorkEntry>
    <WorkEntry org="PUCRS" role="B.S. Software Engineering" dates="Expected 2028">
      <p>Pontifical Catholic University of Rio Grande do Sul.</p>
    </WorkEntry>
  </section>

  <section>
    <h2>Projects</h2>
    {projects.map((p) => (
      <ProjectRow
        title={p.data.title}
        tagline={p.data.tagline}
        year={p.data.year}
        href={`/projects/${p.id}/`}
      />
    ))}
  </section>

  <Contact />
</Base>
```

- [ ] **Step 7: Verify**

```bash
npm run build
grep -c '<h1' dist/index.html
```

Expected: `1`. More than one is a spec violation.

```bash
grep -o '/projects/[a-z-]*/' dist/index.html | sort -u
```

Expected: exactly three paths — `/projects/shiro/`, `/projects/build-together/`, `/projects/equillibrium/`. These 404 until Task 5.

Then screenshot via Playwright MCP at 390px and 1280px, light and dark, and confirm hover on a project row both shifts the row and draws the rule.

- [ ] **Step 8: Commit**

```bash
git add src/components/ src/pages/index.astro src/styles/global.css
git commit -m "Add home page"
```

---

### Task 5: Case study template

**Files:**
- Create: `src/pages/projects/[...id].astro`
- Create: `src/pages/404.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `Base.astro`; the `projects` collection.
- Produces: routes `/projects/<id>/` for every non-draft entry.

- [ ] **Step 1: Write the dynamic route**

The filename is `[...id].astro` and the param is `id` — this matches the collection entry's `id`, which Astro derives from the filename. Using `slug` here is the pre-v5 API and will produce undefined params.

```astro
---
import { getCollection, render } from 'astro:content';
import Base from '../../layouts/Base.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects', ({ data }) => !data.draft);
  return projects.map((project) => ({
    params: { id: project.id },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await render(project);
const { title, tagline, role, year, stack, summary, metrics, links } = project.data;
---
<Base title={`${title} — Vicenzo Ribas Másera`} description={summary}>
  <p class="back"><a href="/">← Vicenzo Ribas Másera</a></p>

  <header class="case">
    <h1>{title}</h1>
    <p class="case__tagline">{tagline}</p>
    <dl class="case__meta">
      <dt>Year</dt><dd>{year}</dd>
      <dt>Role</dt><dd>{role}</dd>
      <dt>Stack</dt><dd>{stack.join(', ')}</dd>
    </dl>
    {metrics && (
      <ul class="case__metrics">
        {metrics.map((m) => <li>{m}</li>)}
      </ul>
    )}
    {links.appStore && <p><a href={links.appStore}>View on the App Store</a></p>}
    {links.github && <p><a href={links.github}>Source on GitHub</a></p>}
  </header>

  <article class="prose">
    <Content />
  </article>
</Base>
```

- [ ] **Step 2: Add case study styles**

```css
.back { font-size: var(--step--1); margin-bottom: var(--space-l); }
.case { border-bottom: 1px solid var(--rule); padding-bottom: var(--space-m); margin-bottom: var(--space-m); }
.case__tagline { color: var(--ink-muted); font-size: var(--step-1); }
.case__meta {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-xs) var(--space-s);
  font-size: var(--step--1);
  margin: var(--space-m) 0 0;
}
.case__meta dt { color: var(--ink-muted); }
.case__meta dd { margin: 0; }
.case__metrics { padding-left: 1.1em; font-size: var(--step--1); color: var(--ink-muted); }
.prose h2 { margin-top: var(--space-l); font-size: var(--step-2); }
.prose h3 { margin-top: var(--space-m); }
.prose > * + * { margin-top: var(--space-s); }
```

- [ ] **Step 3: Write the 404 page**

`src/pages/404.astro` — in voice, short, no jokes that age badly:

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Not found — Vicenzo Ribas Másera" description="This page doesn't exist.">
  <h1>Not found</h1>
  <p>There's nothing at this address. <a href="/">Head back to the homepage.</a></p>
</Base>
```

- [ ] **Step 4: Verify all three routes build**

```bash
npm run build
ls dist/projects/
```

Expected: directories `shiro`, `build-together`, `equillibrium`, each containing `index.html`.

```bash
grep -c '<h1' dist/projects/shiro/index.html
```

Expected: `1`.

- [ ] **Step 5: Verify no dead internal links**

```bash
npm run preview &
sleep 3
for p in / /projects/shiro/ /projects/build-together/ /projects/equillibrium/; do
  printf '%s ' "$p"; curl -s -o /dev/null -w '%{http_code}\n' "http://localhost:4321$p"
done
kill %1
```

Expected: `200` for all four.

- [ ] **Step 6: Commit**

```bash
git add src/pages/ src/styles/global.css
git commit -m "Add case study template and 404 page"
```

---

### Task 6: Discoverability layer

**Files:**
- Create: `src/components/Seo.astro`
- Create: `public/robots.txt`
- Create: `public/vicenzo-masera-resume.pdf` (copied)
- Modify: `src/layouts/Base.astro`

**Interfaces:**
- Consumes: `Base.astro` props `{ title, description }`.
- Produces: `Seo.astro` with props `{ title: string; description: string; type?: 'website' | 'article' }`, rendered inside `<head>`.

- [ ] **Step 1: Write the SEO component**

```astro
---
interface Props {
  title: string;
  description: string;
  type?: 'website' | 'article';
}
const { title, description, type = 'website' } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site).href;

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Vicenzo Ribas Másera',
  url: 'https://vicenzorm.github.io/',
  jobTitle: 'iOS Engineer',
  email: 'mailto:vicenzomasera@icloud.com',
  sameAs: [
    'https://github.com/vicenzorm',
    'https://linkedin.com/in/vicenzomasera',
  ],
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Pontifical Catholic University of Rio Grande do Sul',
  },
  knowsAbout: [
    'Swift', 'SwiftUI', 'UIKit', 'The Composable Architecture',
    'Swift Concurrency', 'CoreML', 'HealthKit', 'SwiftData',
    'App Intents', 'WidgetKit', 'SpriteKit', 'iOS development',
    'macOS development',
  ],
};

const shiro = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Shiro',
  applicationCategory: 'GameApplication',
  operatingSystem: 'iOS',
  url: 'https://apps.apple.com/br/app/shiro/id6752502968',
  author: { '@type': 'Person', name: 'Vicenzo Ribas Másera' },
};
---
<link rel="canonical" href={canonical} />
<meta property="og:type" content={type} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta name="twitter:card" content="summary" />
<script type="application/ld+json" set:html={JSON.stringify(person)} />
<script type="application/ld+json" set:html={JSON.stringify(shiro)} />
```

`set:html` with `JSON.stringify` is required — interpolating the object directly renders `[object Object]`.

- [ ] **Step 2: Wire it into `Base.astro`**

Add `import Seo from '../components/Seo.astro';` to the frontmatter, extend `Props` with `type?: 'website' | 'article'`, destructure it, and replace the standalone `<meta name="description">` line with:

```astro
    <meta name="description" content={description} />
    <Seo title={title} description={description} type={type} />
```

Then pass `type="article"` from `src/pages/projects/[...id].astro`'s `<Base>` call.

- [ ] **Step 3: Add `robots.txt`**

`public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://vicenzorm.github.io/sitemap-index.xml
```

- [ ] **Step 4: Copy the resume PDF**

```bash
cp ../Resumes/vicenzo-resume-en.pdf public/vicenzo-masera-resume.pdf
```

This is a copy, not a symlink — symlinks do not survive the static build reliably.

- [ ] **Step 5: Verify structured data and assets**

```bash
npm run build
grep -c 'application/ld+json' dist/index.html
```

Expected: `2`.

```bash
node -e "
const fs=require('fs');
const html=fs.readFileSync('dist/index.html','utf8');
const blocks=[...html.matchAll(/<script type=\"application\/ld\+json\">(.*?)<\/script>/gs)];
blocks.forEach((b,i)=>{const o=JSON.parse(b[1]);console.log(i,o['@type'],'OK');});
"
```

Expected: two lines, `Person` and `SoftwareApplication`, no JSON parse error.

```bash
test -f dist/sitemap-index.xml && test -f dist/robots.txt && test -f dist/vicenzo-masera-resume.pdf && echo "assets OK"
```

Expected: `assets OK`.

- [ ] **Step 6: Commit**

```bash
git add src/components/Seo.astro src/layouts/Base.astro src/pages/projects/ public/
git commit -m "Add structured data, sitemap, robots, and resume"
```

---

### Task 7: Audit and ship

**Files:**
- Modify: whatever the audit surfaces.

**Interfaces:**
- Consumes: the complete built site.
- Produces: a passing audit and a live deploy.

- [ ] **Step 1: Confirm zero shipped JavaScript**

```bash
npm run build
find dist -name '*.js' | wc -l
```

Expected: `0`. Any `.js` file means a `client:*` directive slipped in, violating a global constraint.

- [ ] **Step 2: Run axe-core on every page, both themes**

Serve with `npm run preview`, then via Playwright MCP visit `/`, `/projects/shiro/`, `/projects/build-together/`, `/projects/equillibrium/`, and `/404/` under both `prefers-color-scheme` values, injecting axe-core and collecting violations.

Expected: zero violations on all ten combinations. Fix any that appear before proceeding.

- [ ] **Step 3: Run Lighthouse**

Against the preview server, on `/` and one case study page.

Expected: ≥95 on Performance, Accessibility, Best Practices, and SEO. Record actual scores in the commit message. If any category falls short, fix rather than lower the bar.

- [ ] **Step 4: Manual keyboard traversal**

Tab from page load through the whole home page. Confirm: the skip link appears on first Tab and works; focus order is visual order; every interactive element has a visible focus ring; project rows show the same treatment on focus as on hover.

- [ ] **Step 5: Run the `web-design-guidelines` skill**

Point it at `src/`. Triage the findings — fix real issues, and note anything deliberately rejected with a one-line reason so it isn't re-raised later.

- [ ] **Step 6: Verify the deployed site**

```bash
git push
gh run watch --exit-status
for p in / /projects/shiro/ /projects/build-together/ /projects/equillibrium/ /sitemap-index.xml /vicenzo-masera-resume.pdf; do
  printf '%s ' "$p"; curl -s -o /dev/null -w '%{http_code}\n' "https://vicenzorm.github.io$p"
done
```

Expected: `200` for all six.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Fix audit findings and ship"
git push
```

---

## Deferred

Recorded so they are not lost, and not built in v1:

- The Shiro easter egg.
- A custom domain (`site` is in one place in `astro.config.mjs`; changing it is a one-line edit plus a `CNAME` file in `public/`).
- Portuguese translation, despite `vicenzo-resume-pt.pdf` existing.
- OG images. The site has no imagery, so `twitter:card` is `summary` rather than `summary_large_image`.
