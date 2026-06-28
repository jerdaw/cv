# Agent Instructions

This file provides guidance for automated coding tools working on this repository.

## Project Overview

Static Astro site for Jeremy Dawson. The public deployment at [jeremydawson.ca](https://jeremydawson.ca/) currently serves a temporary placeholder while the full professional site is being rewritten.

**Tech stack**: Astro 7, TypeScript, vanilla CSS, plain JavaScript for any legacy browser enhancements.

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
| `.github/dependabot.yml` | Weekly npm and GitHub Actions update configuration |
| `.npmrc` | npm registry defaults and scoped GitHub Packages registry mapping |

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
- **Dependencies**: keep Node type definitions aligned with the active Node
  runtime. This repo currently uses Node 24 and ignores `@types/node`
  semver-major Dependabot updates until the runtime intentionally changes.

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

Dependabot checks npm and GitHub Actions weekly. `.npmrc` keeps public packages
on the npm registry and scopes GitHub Packages to `@jerdaw`, which prevents
Dependabot from treating `npm.pkg.github.com` as an unscoped replacement for the
public npm registry.

## Windows / WSL

This repo lives in WSL and tracks `CLAUDE.md` and `GEMINI.md` as relative
symlinks to `AGENTS.md`. Prefer WSL Git for source-control operations; Windows
Git over `\\wsl.localhost` can report those symlinks as modified even when their
target is unchanged.

The previous low-severity audit advisory in Astro's transitive `esbuild`
dev-server dependency on Windows was resolved by the Astro 7 upgrade. Keep local
dev servers bound to localhost unless a public network exposure is intentional.
The `yaml-language-server` YAML override remains intentional until upstream
dependencies resolve to a non-vulnerable `yaml` version without it.

## What to Avoid

- Do not add dependencies without discussion — the project intentionally has almost none.
- Do not refactor working code speculatively.
- Do not introduce build tools, bundlers, or test frameworks without explicit agreement.
- Do not commit `.env` files, secrets, or credentials.
- Do not commit the `.claude/` directory (it is gitignored).
