# Site Roadmap

## Current Status

Phase: `Temporary public placeholder`

## What's Live

- Minimal Astro placeholder homepage for `https://jerdaw.github.io/cv/`
- Matching temporary 404 page
- Placeholder copy sourced from `src/data/profile.ts`
- Manual GitHub Pages deployment workflow
- Legacy full-site public assets moved out of `public/` so they are not emitted in production builds
- No downloadable CV or resume published from this repo

## Remaining Tasks

Status key: `pending` · `optional` · `done` · `blocked`

### P1

- `pending` Approve the minimum-publication structure and final public copy in [`docs/public-site-rewrite-decision-packet.md`](docs/public-site-rewrite-decision-packet.md), then implement the full-site rewrite in guarded batches.
- `pending` Finalize and explicitly approve the master CV before adding any public PDF or downloadable resume link (P-06).
- `pending` Add verified ORCID, LinkedIn, GitHub, or other public profile links only after each destination is current and approved for broad public review (P-05).
- `pending` Decide which project, research, and career-history summaries should return to the public site (P-03/P-04).

### Polish / Visual

- `optional` Reintroduce the legacy timeline animation only if it fits the rewritten content.
- `optional` Add project or research entries as work becomes public.

### Maintenance

- `pending` Keep GitHub Pages deployment manual-only unless the site is ready for routine public updates again.
- `done` Move the public placeholder from the custom domain to the free GitHub Pages project URL.
- `done` Add non-deploy CI for `npm run verify` on pushes, pull requests, and manual dispatches.
- `done` Add local `npm run verify` guards for generated output, public-boundary, repo-contract, tracked-file, runtime metadata, and CSS contract checks.
- `done` Run the local guard suite in the manual GitHub Pages deploy before uploading the Pages artifact.
- `done` Configure Dependabot for npm and GitHub Actions maintenance PRs.
- `done` Reduce active placeholder source, CSS, and public data to what is actually rendered.
- `done` Update Astro to the latest Astro 7 release and resolve the Windows `esbuild` dev-server audit advisory without using `npm audit fix --force`.
- `done` Keep the vulnerable `yaml-language-server` YAML transitive dependency overridden until upstream resolves to a non-vulnerable `yaml` version without it.
- `done` Update GitHub Actions to Node 24-backed major versions and remove the temporary Node 24 force environment override.
- `done` Update TypeScript to 6.x while keeping `@types/node` aligned with the Node 24 runtime.
- `done` Scope npm registry configuration so Dependabot can run npm updates without treating GitHub Packages as the public registry.
- `done` Complete a code-adjacent writing professionalization pass for active public copy, guard expectations, and audit reporting.

## Notes

- Live URL: `https://jerdaw.github.io/cv/`
- Public documentation intentionally excludes deployment runbooks, DNS notes, monitoring details, credentials, and environment-specific paths.
- The GitHub Pages workflow runs `npm run check`, `npm run build`, and `npm run check:guards` when manually dispatched. Browser/Playwright-style checks should stay in GitHub CI if added later.
