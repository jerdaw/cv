# Agent Instructions

This file provides guidance for automated coding tools working on this repository.

## Project Overview

Static Astro professional hub for Jeremy Dawson. Single-page, deployed to GitHub Pages at [jeremydawson.ca](https://jeremydawson.ca/).

**Tech stack**: Astro 6, TypeScript, vanilla CSS, plain JavaScript (no framework in public/).

## Key Files

| File | Purpose |
|------|---------|
| `src/data/profile.ts` | All site content — edit here first |
| `src/styles/global.css` | Global styles and design tokens |
| `public/enhancements.js` | All client-side scroll animation logic |
| `src/components/TimelinePath.astro` | SVG timeline path markup and SVG defs |
| `.github/workflows/deploy.yml` | CI: type-check → build → deploy to Pages |

## Development

```bash
# Requires Node ≥22; Node 24 is recommended
npm install
npm run dev       # dev server on :4321
npm run check     # Astro type-check (runs in CI)
npm run build     # production build to dist/
```

Use local preview launch configuration if present. Do not commit local tool configuration.

## Coding Conventions

- **Content**: edit `src/data/profile.ts` only — all sections, links, and metadata flow from there.
- **Styles**: use CSS custom properties defined in `:root` (see `global.css`). Do not introduce utility-class frameworks.
- **Animation**: all scroll-driven animation lives in `public/enhancements.js`. SVG structure is in `TimelinePath.astro`. Keep them in sync.
- **No framework JS**: `enhancements.js` is plain vanilla ES2020+. No bundler, no imports.
- **Accessibility**: all animation respects `prefers-reduced-motion`. Keep it that way.
- **TypeScript**: strict mode. Run `npm run check` before committing.

## Authorship and Attribution

**All commits must be authored by the human contributor (Jeremy Dawson) only.**

- AI agents may assist with code but must not appear as commit authors or co-authors.
- Only Jeremy Dawson or another actual human contributor may be listed as an author, co-author, contributor, reviewer, signer, or changelog credit.
- Do not name Claude, Codex, Gemini, Copilot, ChatGPT, OpenAI, or any other automation tool in authorship, contribution, review, changelog, or release-note attribution.
- Do not add `Co-Authored-By`, `Signed-off-by`, or any trailer that names an AI model.
- Do not add AI attribution to comments, docstrings, changelogs, or any file tracked in git.
- The git user identity (`git config user.name / user.email`) should remain as the human's.

## Roadmap and Planning

- Active roadmap: `ROADMAP.md`
- Completed plans are archived under `.claude/plans/archive/`
- Do not create new top-level documentation files without a clear need — the site is intentionally minimal.

## CI

GitHub Actions workflow runs on every push to `main`:
1. `npm run check` — Astro + TypeScript diagnostics
2. `npm run build` — production build

Keep both passing. If CI is broken, fix it before adding features.

## What to Avoid

- Do not add dependencies without discussion — the project intentionally has almost none.
- Do not refactor working code speculatively.
- Do not introduce build tools, bundlers, or test frameworks without explicit agreement.
- Do not commit `.env` files, secrets, or credentials.
- Do not commit the `.claude/` directory (it is gitignored).
