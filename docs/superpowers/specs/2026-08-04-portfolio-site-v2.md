# Portfolio Site v2 — Design Spec

**Date:** 2026-08-04
**Owner:** Vicenzo Ribas Másera
**Status:** Implemented
**Supersedes:** parts of [`2026-08-04-portfolio-site-design.md`](./2026-08-04-portfolio-site-design.md) — §Architecture/Surfaces, §Components, §Visual system/Color, §Typography, §Dependencies. Every other section of v1 still stands.

## Why v2

v1 shipped a single dense page: intro, work, education, projects, contact, one scroll. It reads as a résumé transcribed to HTML — accurate, complete, and impersonal.

v2 keeps the goal from v1 §Goal ("a personal site that happens to be a portfolio") but changes the form to match the primary reference, **jkwon.co**, more literally: sparse pages, one idea per page, a large rough-letterpress title, and a plain text nav. Work and Education leave the site; the résumé PDF is where that detail belongs, and a hiring manager who wants it is one click away on Contact.

## Surfaces

Replaces v1 §Architecture/Surfaces.

| Route | Content |
| --- | --- |
| `/` | Name, one line, nav |
| `/about/` | The intro prose from v1, unchanged |
| `/projects/` | The three project rows |
| `/contact/` | Email, GitHub, LinkedIn, résumé PDF |
| `/projects/[slug]` | One case study per project — unchanged from v1 |
| `/404` | Minimal, in-voice |

Every page has the same shape: `<h1>` page title, content, nav. `Base.astro` owns all three, so a page file is a title, a description, and its content.

## Navigation

The nav sits at the **end of the content**, scrolling with the page. Not fixed, not sticky.

Four links, a plain `<ul>` that wraps at narrow widths. The current page is marked with **both** `aria-current="page"` and the blue accent colour — colour alone is not an accessible state signal. Case studies under `/projects/<slug>/` keep Projects marked current, via a `startsWith` prefix match in `Nav.astro`.

Hrefs carry trailing slashes because `astro.config.mjs` sets `build.format: 'directory'`; without them every nav click costs a redirect.

**New non-goal:** no fixed or sticky nav, no mobile hamburger, no dropdowns. Four links do not need disclosure.

## Components

Replaces v1 §Components.

- `Nav` — no props. The four links and the active-state logic.
- `ProjectRow` — title, tagline, year, href. Unchanged from v1.
- `Seo` — meta, OG, JSON-LD. Unchanged from v1.
- The case study layout still lives in the `/projects/[...id]` route file; it still has exactly one caller.

**Removed:** `Intro` (its prose moved into `about.astro`), `WorkEntry` (Work and Education are off the site), `Contact` (became `contact.astro`).

The `Person` JSON-LD keeps `alumniOf: PUCRS` even though Education is no longer a visible section. Structured data serves crawlers, the fact is true, and it is traceable to `Resumes/vicenzo-resume-en.typ`.

## Typography

Replaces v1 §Typography. Instrument Serif and Inter are gone.

- Body: **IM Fell English** — the exact face jkwon.co uses (`body { font-family: IM Fell English, serif }` in its stylesheet).
- Headings: **IM Fell DW Pica** — a sister cut from the same Fell revival, chunkier and rougher at display sizes.

jkwon.co sets its headings in **WonderType**, a custom licensed face served from its own bundle. It is not redistributable, so it cannot ship here. IM Fell DW Pica is the closest free stand-in: same rough letterpress texture, same period, and it pairs with IM Fell English by construction rather than by coincidence.

Both self-hosted via Fontsource. No Google Fonts request — same reasoning as v1.

The Fell faces have a noticeably smaller x-height than Inter, so the whole fluid scale moves up roughly one step and body leading tightens from 1.6 to 1.55. Fallback stack is `Georgia, serif` — a real serif, so a swap does not change the page's character. The v1 `Inter Fallback` metric-override block is deleted; its `ascent-override` values were computed for Inter against Arial and are wrong for a Fell face against Georgia.

Only weight 400 exists in either family. Nothing on the site asks for bold; `<strong>` in case study prose falls back to synthetic bold, which is acceptable for the two or three places it appears.

Measure is capped at `70ch` and the column widened to `44rem` to compensate for the narrower glyphs.

## Color

Replaces v1 §Visual system/Color. The warm-paper-and-terracotta palette is gone.

Soft black on soft white, with two accents: jkwon's blue, and a red of our own.

| Token | Light | Dark |
| --- | --- | --- |
| `--surface` | `#FBFAF8` | `#171614` |
| `--ink` | `#2E2C2A` | `#E9E6E0` |
| `--ink-muted` | `#5C564E` | `#A39C91` |
| `--rule` | `#E6E3DD` | `#2B2721` |
| `--accent` (blue) | `#3366CC` | `#8FB0F0` |
| `--accent-warm` (red) | `#C0392B` | `#E88070` |

Measured against the surface, both themes:

| Pairing | Light | Dark |
| --- | --- | --- |
| ink | 13.33:1 | 14.52:1 |
| ink-muted | 6.95:1 | 6.65:1 |
| accent (blue) | 5.14:1 | 8.30:1 |
| accent-warm (red) | 5.21:1 | 6.68:1 |

All clear AA. `--rule` is decorative and exempt, as in v1.

jkwon.co is light-only. We keep the `prefers-color-scheme` token swap from v1 — it is a handful of lines, no JavaScript, and no toggle.

**Accent discipline**, carried over from v1: blue does link hover/focus and the active nav item. Red does exactly one thing — the highlighted phrase in the About prose (`<em class="accent">`, "on-device machine learning that never makes a network call"). It is the only red on the site, and set in the Fell italic we already ship. A third use of either colour dilutes both.

## Dependencies

Replaces v1 §Dependencies. The "nothing else without a new decision" clause is exercised here; this is that decision. Net count is unchanged at four.

`astro@^7.1.6`, `@astrojs/sitemap@^3.7.3`, `@fontsource/im-fell-english@^5.3.0`, `@fontsource/im-fell-dw-pica@^5.3.0`.

Removed: `@fontsource-variable/inter`, `@fontsource/instrument-serif`.

`@astrojs/check` and `typescript` are installed with `--no-save` when the check gate runs. They are build-time tooling, not shipped code, and the project keeps zero devDependencies.

## What did not change

Still in force from v1, and not re-litigated: no blog, no "now" page, no CMS, no analytics, no contact form (email is a `mailto:`), no imagery, no client-side routing, no i18n, no cards, no shadows, no gradients. Single centered column. The page still reads as a document.

The jkwon `[at]`/`[dot]` email obfuscation is deliberately **not** copied. It is a spam measure, not a design feature, and it costs a hiring manager a click.

Source fidelity still binds: every claim on the site traces to `Resumes/vicenzo-resume-en.typ`. v2 moved existing sentences between pages; it wrote one new one — the home page line "iOS engineer. Swift, SwiftUI, and on-device machine learning." — and every term in it appears in the résumé. Note that the résumé records **no location**, so the home line does not claim one.

## Verification

Same gate as v1 §Verification, including the no-unit-tests ruling. Results at implementation:

- `astro check` — 0 errors, 0 warnings. Fixed one pre-existing error (`Astro.site` possibly undefined in `Seo.astro`).
- `astro build` — clean, 8 pages.
- axe-core over all four pages plus a case study, both themes — **0 violations**.
- Contrast — table above, all pairings AA.
- Computed fonts confirmed as IM Fell DW Pica / IM Fell English on every page, no Georgia fallback.
- Nav active state confirmed correct on all five surfaces.
- Screenshots at 1440px and 390px, both themes.
