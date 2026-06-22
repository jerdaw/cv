# Agent Instructions

This file provides guidance for automated coding tools working on this repository.

## Project Overview

Static Astro site for Jeremy Dawson. The public deployment at [jeremydawson.ca](https://jeremydawson.ca/) currently serves a temporary placeholder while the full professional site is being rewritten.

**Tech stack**: Astro 6, TypeScript, vanilla CSS, plain JavaScript for any legacy browser enhancements.

## Key Files

| File | Purpose |
|------|---------|
| `src/data/profile.ts` | Active placeholder copy - edit here first |
| `src/pages/index.astro` | Active temporary homepage |
| `src/pages/404.astro` | Active temporary 404 page |
| `src/styles/global.css` | Global styles and design tokens |
| `src/legacy-public/enhancements.js` | Archived scroll animation logic from the prior full site |
| `src/legacy-public/components/` | Archived prior full-site component markup |
| `src/legacy-public/components/TimelinePath.astro` | Archived SVG timeline path markup and SVG defs |
| `.github/workflows/ci.yml` | Non-deploy check/build workflow |
| `.github/workflows/deploy.yml` | Manual type-check, build, and deploy to Pages |

## Development

```bash
# Requires Node ≥22; Node 24 is recommended
npm install
npm run dev       # dev server on :4321
npm run check     # Astro type-check
npm run build     # production build to dist/
npm run verify    # type-check and production build
npm run preview   # local static preview after build
```

Use local preview launch configuration if present. Do not commit local tool configuration.

## Coding Conventions

- **Content**: edit `src/data/profile.ts` first. Active placeholder copy flows from there.
- **Styles**: use CSS custom properties defined in `:root` (see `global.css`). The active stylesheet should stay scoped to live placeholder pages until the rewrite resumes. Do not introduce utility-class frameworks.
- **Legacy archive**: prior full-site components, social-card assets, and scroll-driven animation code are archived under `src/legacy-public/`; do not move them back into active source or `public/` unless the full-site rewrite needs them.
- **No framework JS**: any browser script should remain plain vanilla ES2020+. No bundler, no imports.
- **Accessibility**: if animation returns, it must respect `prefers-reduced-motion`.
- **TypeScript**: strict mode. Run `npm run check` before committing.

## Authorship and Attribution

**All commits must be authored by the human contributor (Jeremy Dawson) only.**

- AI agents may assist with code but must not appear as commit authors or co-authors.
- Only Jeremy Dawson or another actual human contributor may be listed as an author, co-author, contributor, reviewer, signer, or changelog credit.
- Do not name Claude, Codex, Gemini, Copilot, ChatGPT, OpenAI, or any other automation tool in authorship, contribution, review, changelog, or release-note attribution.
- Do not add `Co-Authored-By`, `Signed-off-by`, or any trailer that names an AI model.
- Do not add AI attribution to comments, docstrings, changelogs, or any file tracked in git.
- The git user identity (`git config user.name / user.email`) should remain as the human's.
- `CLAUDE.md` and `GEMINI.md` must remain relative symlinks to `AGENTS.md`.

## Roadmap and Planning

- Active roadmap: `ROADMAP.md`
- Completed plans are archived under `.claude/plans/archive/` if local planning files exist.
- Do not create new top-level documentation files without a clear need - the site is intentionally minimal.

## CI

GitHub Actions deployment is manual-only via `workflow_dispatch`:
1. `npm run check` — Astro + TypeScript diagnostics
2. `npm run build` — production build
3. Deploy to GitHub Pages

The separate non-deploy `Check` workflow runs `npm run verify` on pushes, pull
requests, and manual dispatches. Keep checks and builds passing. Do not add local
Playwright runs; leave browser-style checks for GitHub CI if they are introduced
later.

## Windows / WSL

This repo lives in WSL and tracks `CLAUDE.md` and `GEMINI.md` as relative
symlinks to `AGENTS.md`. Prefer WSL Git for source-control operations; Windows
Git over `\\wsl.localhost` can report those symlinks as modified even when their
target is unchanged.

The remaining low-severity audit advisory is in Astro's transitive `esbuild`
dev-server dependency on Windows. Until an Astro 6 patch or Astro 7 upgrade is
reviewed, keep local dev servers bound to localhost and do not expose them on a
public network.

## What to Avoid

- Do not add dependencies without discussion — the project intentionally has almost none.
- Do not refactor working code speculatively.
- Do not introduce build tools, bundlers, or test frameworks without explicit agreement.
- Do not commit `.env` files, secrets, or credentials.
- Do not commit the `.claude/` directory (it is gitignored).
