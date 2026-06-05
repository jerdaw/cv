# Jeremy Dawson Personal Site

Static Astro site for Jeremy J. Dawson's public professional hub.

Current public-site checklist: `ROADMAP.md`

## Public documentation boundary

This repository contains public project documentation and reproducible development information. Deployment details, credentials, monitoring configuration, private operational notes, and environment-specific production paths are intentionally excluded from public documentation.

## Status

This repo is public and intentionally conservative while a complete CV is being finalized. No downloadable CV or resume is published from this repo; CV available on request.

## Commands

- `npm install`
- `npm run dev`
- `npm run check`
- `npm run build`
- `npm run preview`

## Content Editing

All main site content lives in `src/data/profile.ts`.

Only add public profile links or a downloadable CV/resume after the destination or file is current, polished, and safe for broad public review.

## Deployment

The site builds as static Astro output. Public deployment automation lives in `.github/workflows/deploy.yml`; private production runbooks, DNS notes, monitoring details, and environment-specific paths should stay out of public documentation.

### Remaining manual items

The remaining public-site tasks are tracked in `ROADMAP.md`.
