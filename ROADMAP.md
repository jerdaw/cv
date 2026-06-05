# Site Roadmap

## Current Status

Phase: `Public-safe professional hub`

## What's Live

- Astro one-page site with typed content model (`src/data/profile.ts`)
- Public-safe placeholder biography while the complete CV is finalized
- Selected public project summaries without stale metrics or repository/profile links
- Scroll-driven visual timeline with full `prefers-reduced-motion` fallback
- Public email revealed on request (not in HTML source)
- Social preview image and Open Graph / Twitter metadata
- No downloadable CV or resume published from this repo

## Remaining Tasks

Status key: `pending` · `optional`

### P1

- `pending` Finalize the master CV before adding any public PDF or downloadable resume link.
- `pending` Add verified ORCID, LinkedIn, and GitHub links only after each destination is current and ready for broad public review.

### Polish / Visual

- `optional` Per-section timeline timing fine-tuning as content evolves.
- `optional` Additional project or research entries as work becomes public.

### Maintenance

- `pending` Track the remaining `yaml-language-server` / `yaml` moderate advisory from `@astrojs/check`; avoid `npm audit fix --force` unless the breaking tool change is reviewed.

## Notes

- Live URL: `https://jeremydawson.ca/`
- Public documentation intentionally excludes deployment runbooks, DNS notes, monitoring details, credentials, and environment-specific paths.
- CI runs `npm run check` + `npm run build` on every push to `main`. Browser/Playwright-style checks should stay in GitHub CI if added later.
