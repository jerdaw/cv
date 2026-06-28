# Site Roadmap

## Current Status

Phase: `Temporary public placeholder`

## What's Live

- Minimal Astro placeholder homepage for `https://jeremydawson.ca/`
- Matching temporary 404 page
- Placeholder copy sourced from `src/data/profile.ts`
- Manual GitHub Pages deployment workflow
- Legacy full-site public assets moved out of `public/` so they are not emitted in production builds
- No downloadable CV or resume published from this repo

## Remaining Tasks

Status key: `pending` · `optional` · `done` · `blocked`

### P1

- `pending` Rewrite the full public site around the medical school transition before expanding beyond the temporary placeholder.
- `pending` Finalize the master CV before adding any public PDF or downloadable resume link.
- `pending` Add verified ORCID, LinkedIn, GitHub, or other public profile links only after each destination is current and ready for broad public review.
- `pending` Decide which project, research, and career-history summaries should return to the public site.

### Polish / Visual

- `optional` Reintroduce the legacy timeline animation only if it fits the rewritten content.
- `optional` Add project or research entries as work becomes public.

### Maintenance

- `pending` Keep GitHub Pages deployment manual-only unless the site is ready for routine public updates again.
- `done` Add non-deploy CI for `npm run verify` on pushes, pull requests, and manual dispatches.
- `done` Configure Dependabot for npm and GitHub Actions maintenance PRs.
- `done` Reduce active placeholder source, CSS, and public data to what is actually rendered.
- `done` Update Astro to the latest Astro 7 release and resolve the Windows `esbuild` dev-server audit advisory without using `npm audit fix --force`.
- `done` Keep the vulnerable `yaml-language-server` YAML transitive dependency overridden until upstream resolves to a non-vulnerable `yaml` version without it.
- `done` Update GitHub Actions to Node 24-backed major versions and remove the temporary Node 24 force environment override.
- `done` Update TypeScript to 6.x while keeping `@types/node` aligned with the Node 24 runtime.
- `done` Scope npm registry configuration so Dependabot can run npm updates without treating GitHub Packages as the public registry.

## Notes

- Live URL: `https://jeremydawson.ca/`
- Public documentation intentionally excludes deployment runbooks, DNS notes, monitoring details, credentials, and environment-specific paths.
- The GitHub Pages workflow runs `npm run check` + `npm run build` only when manually dispatched. Browser/Playwright-style checks should stay in GitHub CI if added later.
