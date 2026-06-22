# Jeremy Dawson Personal Site

Static Astro site for Jeremy Dawson. The public site currently serves a short
temporary placeholder while the full professional site is being rewritten.

Current public-site checklist: `ROADMAP.md`

## Public documentation boundary

This repository contains public project documentation and reproducible
development information. Deployment details, credentials, monitoring
configuration, private operational notes, and environment-specific production
paths are intentionally excluded from public documentation.

## Status

This repo is public and intentionally conservative while the site is being
rewritten. The generated public site is only the placeholder homepage and
matching 404 page. No downloadable CV or resume is published from this repo.

## Commands

- `npm install`
- `npm run dev`
- `npm run check`
- `npm run build`
- `npm run verify`
- `npm run preview`

Node 24 is recommended for local development and matches GitHub Actions. The
repository includes `.node-version` for tools that read it.

## Content Editing

Active public copy lives in `src/data/profile.ts`, with the placeholder rendered
by `src/pages/index.astro` and `src/pages/404.astro`. Prior full-site components,
animation code, and social-card assets are archived under `src/legacy-public/`
and are excluded from active type-checking and production output.

Only add public profile links, project details, or a downloadable CV/resume after
the destination or file is current, polished, and safe for broad public review.

## Deployment

The site builds as static Astro output. GitHub Pages deployment lives in
`.github/workflows/deploy.yml` and is currently manual-only via
`workflow_dispatch`. Private production runbooks, DNS notes, monitoring details,
and environment-specific paths should stay out of public documentation.

The non-deploy check workflow in `.github/workflows/ci.yml` runs `npm run verify`
on pushes, pull requests, and manual dispatches. Dependabot is configured for npm
and GitHub Actions updates.

## Windows / WSL Notes

`CLAUDE.md` and `GEMINI.md` are tracked as relative symlinks to `AGENTS.md`.
When this WSL repository is accessed through `\\wsl.localhost`, Windows Git may
report those links as modified even when their target is unchanged. Prefer WSL
Git for source-control operations in this repository.

The remaining low-severity audit advisory is in Astro's transitive `esbuild`
dev-server dependency on Windows. Until an Astro 6 patch or Astro 7 upgrade is
reviewed, keep local dev servers bound to localhost and do not expose them on a
public network.

### Remaining manual items

The remaining public-site tasks are tracked in `ROADMAP.md`.
