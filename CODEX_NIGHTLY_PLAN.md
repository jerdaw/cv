# Autonomous Work Plan

## Artifact Location

- Path: `CODEX_NIGHTLY_PLAN.md`
- Reason: the repo already uses root-level reviewable planning with `ROADMAP.md`, there is no `docs/` or tracked task folder, and `.claude/` is intentionally ignored. A root-level plan is reviewable without touching protected, generated, dependency, secret, or local tooling locations.

## 1. Repo Facts

### Stack and Shape

- Static Astro site using Astro 7, TypeScript strict mode, vanilla CSS, and archived plain JavaScript for legacy browser enhancements.
- Active public output is intentionally minimal: temporary homepage, temporary 404 page, favicon assets, and `public/CNAME`.
- Active content source is `src/data/profile.ts`.
- Active pages are `src/pages/index.astro` and `src/pages/404.astro`.
- Shared HTML metadata and global CSS are in `src/layouts/BaseLayout.astro` and `src/styles/global.css`.
- Prior full-site components, animation code, and social-card assets are archived under `src/legacy-public/` and excluded from TypeScript checking.
- Deployment is GitHub Pages, manual only, through `.github/workflows/deploy.yml`.
- Non-deploy CI is `.github/workflows/ci.yml`, which runs `npm run verify`.

### Important Project Rules

- Edit `src/data/profile.ts` first for active placeholder copy.
- Keep active CSS scoped to live placeholder pages until the rewrite resumes.
- Do not move archived legacy code/assets back into active source or `public/` unless the full-site rewrite requires it.
- Do not add dependencies without discussion.
- Do not introduce utility-class frameworks, new bundlers, or test frameworks without explicit agreement.
- Browser scripts should remain plain vanilla ES2020+.
- Any animation must respect `prefers-reduced-motion`.
- Run `npm run check` before committing.
- Keep Node types aligned with the Node 24 runtime.
- Deployment should remain manual-only until public updates are intentionally routine.
- Do not publish CV/resume downloads or public profile links until the destinations/files are current and approved for broad public review.
- Use WSL Git for source-control operations because `CLAUDE.md` and `GEMINI.md` are tracked as relative symlinks to `AGENTS.md`.
- Do not commit `.env` files, secrets, credentials, `.claude/`, generated output, or local tool configuration.

### Discovered Commands

| Purpose | Command | Notes |
| --- | --- | --- |
| Install | `npm install` | Local development install. |
| Clean CI install | `npm ci` | Used by GitHub Actions. |
| Dev server | `npm run dev` | Astro dev server on `localhost:4321`. |
| Type-check | `npm run check` | Runs `astro check`. |
| Build | `npm run build` | Static production build to ignored `dist/`. |
| Combined verify | `npm run verify` | Runs `npm run check && npm run build`. |
| Preview | `npm run preview` | Local static preview after build. |
| Security audit | `npm audit --audit-level=moderate` | No script exists, but command is safe and non-mutating. |
| Lint | Not available | No lint script or lint dependency is configured. |
| Unit/integration tests | Not available | No test script or test framework is configured. |

## 2. Baseline State

### Source-Control State

- Branch: `main`
- Tracking: `origin/main`
- Baseline tracked status: clean
- Post-validation ignored directories present: `.astro/`, `dist/`, `node_modules/`
- Recent commits:
  - `722cfea Document maintenance closeout`
  - `6142803 Document Dependabot npm registry scope`
  - `88bc726 Scope npm registry for Dependabot`
  - `84b9f81 Upgrade to TypeScript 6`
  - `6812063 Update GitHub Actions runtimes`

### Environment Assumptions

- Repository path inspected through WSL: `/home/jer/repos/jeremydawson-site`
- Node reported locally: `v24.17.0`
- npm reported locally: `11.13.0`
- `packageManager` metadata: `npm@11.17.0`
- `.node-version`: `24`
- `package.json` engine: `node >=22.12.0`
- GitHub Actions use Node 24.
- Top-level installed packages reported by `npm ls --depth=0`:
  - `astro@7.0.3`
  - `@astrojs/check@0.9.9`
  - `@types/node@24.13.2`
  - `typescript@6.0.3`

### Commands Run Before Writing This Plan

| Command | Result |
| --- | --- |
| `rg --files --hidden -g "!.git/**" -g "!node_modules/**" -g "!dist/**"` | Passed. Confirmed minimal repo file set. |
| `sed -n ... AGENTS.md README.md ROADMAP.md package.json astro.config.mjs tsconfig.json .npmrc .github/workflows/*.yml .github/dependabot.yml` | Passed. Inspected instructions, docs, scripts, config, and CI. |
| `find src public -maxdepth 3 -type f -print` | Passed. Confirmed active source, public assets, and legacy archive layout. |
| `git branch --show-current` | Passed. Output: `main`. |
| `git status --short --branch` | Passed. Output: `## main...origin/main`. |
| `git log --oneline -5` | Passed. Recent commits listed above. |
| `node -v && npm -v` | Passed. Output: `v24.17.0` and `11.13.0`. |
| `npm run check` | Passed. Astro checked 6 files with 0 errors, 0 warnings, 0 hints. |
| `npm run build` | Passed. Built 2 pages: `/404.html` and `/index.html`. |
| `npm audit --audit-level=moderate` | Passed. Output: `found 0 vulnerabilities`. |
| `npm run verify` | First attempt blocked by transient WSL service error `Wsl/Service/E_UNEXPECTED`; retry passed with `check` and `build` both successful. |
| `git status --short --branch --ignored=matching` | Passed. No tracked changes at that point; ignored `.astro/`, `dist/`, and `node_modules/` present. |
| `npm ls --depth=0` | Passed. Listed the top-level package versions above. |
| `rg -n "TODO|FIXME|HACK|XXX"` | Passed with no matches. |
| `find dist -maxdepth 2 -type f -print` | Passed after build. Output: `dist/404.html`, `dist/CNAME`, `dist/favicon.ico`, `dist/favicon.svg`, `dist/index.html`. |

### Baseline Blockers and Cautions

- WSL produced `Wsl/Service/E_UNEXPECTED` during one parallel discovery batch and on the first `npm run verify` attempt. A retry passed. For unattended work, avoid parallel WSL invocations and retry once before treating this as a repo failure.
- There are no configured lint or test commands. Do not invent a new test framework overnight.
- Dependency updates should remain conservative. Dependabot already covers npm and GitHub Actions, and project instructions say not to add dependencies without discussion.

## 3. Candidate Work Inventory

| ID | Objective | Likely Files/Areas | Risk | Acceptance Criteria | Validation Commands | Rollback Plan | Blocker If Not Safe |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AW-001 | Add a generated-site smoke check that verifies the built placeholder output exists and has expected metadata. | `scripts/check-dist.mjs`, `package.json` | Low | After `npm run build`, the check confirms `dist/index.html`, `dist/404.html`, `dist/CNAME`, `dist/favicon.svg`, and `dist/favicon.ico` exist; homepage title/description/canonical are present; 404 has `noindex`; no legacy assets are emitted. | `npm run build`; new smoke script; `npm run verify` if wired. | Remove the script file and package script entry. | None. |
| AW-002 | Add a public-boundary guard for files that should not be shipped. | `scripts/check-public-boundary.mjs`, `package.json` | Low | Guard fails if tracked or public output includes plaintext `.env`, private notes, downloadable CV/resume PDFs, or `src/legacy-public` assets under `public/` or `dist/`. | New boundary script; `npm run build`; new boundary script again. | Remove the script file and package script entry. | None. |
| AW-003 | Add a repo-contract guard for symlinks and documented project invariants. | `scripts/check-repo-contract.mjs`, `package.json` | Low | Guard confirms `CLAUDE.md` and `GEMINI.md` are symlinks to `AGENTS.md`, `.node-version` is `24`, `tsconfig.json` excludes `src/legacy-public`, and deploy remains manual-only. | New contract script; `npm run verify`. | Remove the script file and package script entry. | None. |
| AW-004 | Wire safe guard scripts into the existing verification path without changing CI entrypoints. | `package.json`, possibly `.github/workflows/ci.yml` only if needed | Low to Medium | `npm run verify` still performs Astro check and build, then runs the added guards. CI can continue invoking `npm run verify`; no deploy workflow behavior changes. | `npm run verify`; `npm audit --audit-level=moderate`. | Restore the previous `verify` script and remove added script references. | Do not proceed if guard scripts are brittle or produce false positives on a clean build. |
| AW-005 | Update README command documentation to match any added local validation scripts. | `README.md` | Low | README lists the new scripts, explains there are still no lint or test framework commands, and keeps deployment/private-boundary language intact. | `npm run verify`; manual diff review. | Revert the README changes. | None. |
| AW-006 | Update the roadmap maintenance section after validation guards are added. | `ROADMAP.md` | Low | ROADMAP records the added local validation guard as maintenance, without changing P1 product/content decisions. | `npm run verify`; manual diff review. | Revert the ROADMAP changes. | Only do this after the guard scripts actually exist and pass. |
| AW-007 | Add explicit typing for the placeholder copy object. | `src/data/profile.ts` | Low | `comingSoon` has an explicit type or `satisfies` check; generated HTML content remains unchanged. | `npm run check`; `npm run build`; compare rendered text in `dist/index.html`. | Revert the type-only source change. | Do not proceed if the change alters public copy or forces a broader content model. |
| AW-008 | Extend generated HTML smoke checks to assert active placeholder copy remains rendered as intended. | `scripts/check-dist.mjs`, possibly `src/data/profile.ts` if type export is needed | Low | Smoke check verifies the homepage contains the expected active title/message/note and the 404 page contains its expected title/message/home link. | `npm run build`; smoke script; `npm run verify`. | Remove the added assertions or script. | Do not import TypeScript directly unless using existing runtime support; prefer checking built HTML. |
| AW-009 | Validate base-path behavior with a non-root build scenario and document or guard the result. | `scripts/check-dist.mjs`, `README.md` if documentation is useful | Low | A build with `BASE_PATH=/preview/ SITE_URL=https://example.invalid` has correct favicon and homepage links; any issue is documented instead of silently changed. | `BASE_PATH=/preview/ SITE_URL=https://example.invalid npm run build`; smoke script if extended; normal `npm run verify` afterward. | Revert documentation or smoke-script additions. | Do not change routing/canonical behavior unless the intended public behavior is explicit and validated. |
| AW-010 | Add a lightweight CSS accessibility guard for existing global affordances. | `scripts/check-css-contract.mjs`, `package.json` | Low | Guard confirms `global.css` still contains `:focus-visible` styling and a `prefers-reduced-motion: reduce` block. | New CSS guard script; `npm run verify` if wired. | Remove the script file and package script entry. | Do not broaden this into visual regression testing or Playwright. |
| AW-011 | Add tracked-file hygiene checks for generated output and private files. | `scripts/check-tracked-files.mjs`, `package.json` | Low | Guard fails if `git ls-files` includes `dist/`, `.astro/`, `node_modules/`, `.env*`, ignored local plans, or plaintext private notes. | New hygiene script; `npm run verify`. | Remove the script file and package script entry. | None. |
| AW-012 | Add runtime metadata consistency checks for the Node 24 contract. | `scripts/check-runtime-contract.mjs`, `package.json` | Low | Guard confirms `.node-version`, GitHub Actions Node versions, `@types/node` major, and docs all align with Node 24. | New runtime guard script; `npm run verify`. | Remove the script file and package script entry. | Do not auto-upgrade npm, Node, TypeScript, or `@types/node`. |
| AW-013 | Document dependency-update posture for maintainers without changing dependencies. | `README.md` or `ROADMAP.md` | Low | Docs clarify that Dependabot handles npm and Actions updates, Node type semver-major updates are intentionally ignored, and manual dependency changes should avoid `npm audit fix --force`. | `npm run verify`; `npm audit --audit-level=moderate`; manual diff review. | Revert documentation changes. | Do not change `package.json` versions or `package-lock.json` for this item. |
| AW-014 | Add an archive note near legacy code explaining that it is not active public output. | `src/legacy-public/README.md` | Low | Note states the directory is archived, excluded from active type-check/build output, and should not be moved into `public/` without full rewrite work. | `npm run verify`; manual diff review. | Delete the new README. | Do not edit legacy component or animation behavior. |
| AW-015 | Rewrite the full professional site around the medical school transition. | `src/pages/`, `src/data/`, new components/styles | High | Requires approved content, information architecture, design direction, and public profile decisions. | Would require `npm run verify` plus content/design review. | Revert broad source changes. | Blocked by human product and content decisions; do not do overnight. |
| AW-016 | Publish a downloadable CV/resume or link to one. | `public/`, `src/data/profile.ts`, pages | High | Requires finalized master CV and explicit approval that the file/link is public-ready. | `npm run verify`; manual file/content review. | Remove file/link and rebuild. | Blocked by ROADMAP P1 item; do not do overnight. |
| AW-017 | Add ORCID, LinkedIn, GitHub, or other public profile links. | `src/data/profile.ts`, active pages | Medium to High | Each destination is verified current, polished, and approved for broad public review. | `npm run verify`; manual link review. | Remove links and rebuild. | Blocked by public profile verification; do not do overnight. |
| AW-018 | Reintroduce legacy timeline animation. | `src/legacy-public/`, active components, CSS, browser JS | High | Requires rewritten content fit, accessibility review, reduced-motion behavior, and likely browser testing. | `npm run verify`; future browser/visual checks if introduced in CI. | Revert source/CSS/JS changes. | Blocked by full-site rewrite and design decision; do not do overnight. |

## 4. Safe Overnight Work Queue

### A. Core Queue

Do these first, in order. Stop and document the blocker if any item cannot pass its validation without weakening checks.

1. `AW-001` - Add generated-site smoke check.
2. `AW-002` - Add public-boundary guard.
3. `AW-003` - Add repo-contract guard.
4. `AW-011` - Add tracked-file hygiene checks.
5. `AW-012` - Add runtime metadata consistency checks.
6. `AW-004` - Wire passing guards into `npm run verify`.
7. `AW-005` - Update README commands and validation docs.
8. `AW-006` - Update ROADMAP maintenance note after guards pass.

### B. Extension Queue

Continue only after the Core Queue passes and the working tree diff remains small and reviewable.

1. `AW-007` - Add explicit typing for placeholder copy.
2. `AW-008` - Extend generated HTML smoke checks for rendered placeholder copy.
3. `AW-009` - Validate base-path behavior and document or guard the result.
4. `AW-010` - Add lightweight CSS accessibility guard.
5. `AW-013` - Document dependency-update posture without changing dependencies.
6. `AW-014` - Add a legacy archive note without changing legacy behavior.

### Queue Boundaries

- Keep each item as a separate, reviewable diff group where practical.
- Do not stage or commit unless explicitly asked.
- Do not change active public copy except for type-only checks that preserve generated HTML.
- Do not add dependencies.
- Do not update package versions.
- Do not run deployment, publish, or production commands.
- Do not use destructive cleanup commands. If ignored generated directories become noisy, leave them ignored and report them in final status.

## 5. Do Not Do Overnight

- Do not rewrite the full public site or make broad design/content changes.
- Do not add, generate, link, or publish a CV/resume.
- Do not add ORCID, LinkedIn, GitHub, email, or other public profile links.
- Do not deploy to GitHub Pages or change deployment from manual to automatic.
- Do not use credentials, secrets, production access, DNS, monitoring, or private operational notes.
- Do not add dependencies, utility CSS frameworks, bundlers, test frameworks, or local Playwright/browser test runs.
- Do not run `npm audit fix --force`.
- Do not upgrade Node, npm, TypeScript, Astro, GitHub Actions, or `@types/node` unless specifically asked.
- Do not move legacy assets back into `public/` or active components.
- Do not reactivate timeline animation or browser enhancements.
- Do not delete or rewrite archived legacy code.
- Do not change the authorship, symlink, or attribution rules.
- Do not weaken `npm run check`, `npm run build`, `npm run verify`, CI, or any new guard to make a failure pass.
- Do not commit `.claude/`, `.env*`, `dist/`, `.astro/`, `node_modules/`, coverage, build output, or scratch files.

## 6. Final Completion Checklist

Run these checks before handing work back:

1. `git status --short --branch --ignored=matching`
2. `git diff --stat`
3. `git diff --check`
4. `npm run check`
5. `npm run build`
6. `npm run verify`
7. `npm audit --audit-level=moderate`
8. `git ls-files -s CLAUDE.md GEMINI.md`
9. `git grep -n -I -E "password|passwd|secret|token|api[_-]?key|PRIVATE KEY" -- .`
10. `find public dist -maxdepth 3 -type f -print | sort`

Final review requirements:

- Confirm branch and tracking state.
- Confirm tracked files changed and why each belongs to the completed queue items.
- Confirm no source changes outside the selected queue.
- Confirm no generated, dependency, local tool, private, or secret files are tracked.
- Confirm `CLAUDE.md` and `GEMINI.md` remain relative symlinks to `AGENTS.md`.
- Confirm deployment workflow remains manual-only.
- Confirm no public CV/resume/profile links were introduced.
- Confirm legacy archive files were not moved into active source or `public/`.
- Confirm all validation commands passed, or record exact command output and blocker.
- If WSL returns `Wsl/Service/E_UNEXPECTED`, retry once serially; if it repeats, stop and report it as an environment blocker rather than changing project checks.

## 7. Implementation Status

Status artifact path: `CODEX_NIGHTLY_PLAN.md`

### Current Run Notes

- Work started from branch `main` tracking `origin/main`.
- Initial tracked status before implementation: only untracked `CODEX_NIGHTLY_PLAN.md`; ignored `.astro/`, `dist/`, and `node_modules/` present.
- WSL parallel command execution timed out at the start of the run; serial WSL execution recovered and is being used for the rest of the run.
- Local commit handling: the active goal explicitly allows local commits when the worktree is safe and the git identity is human-authored. `git config user.name` is `Jeremy Dawson`; `git config user.email` is `jeremyjdawson@gmail.com`. A single logical checkpoint commit was created after final validation; no push was performed.

### Item Status

| ID | Status | Files Changed | Commands Run | Validation Results | Risks | Rollback Notes | Follow-ups |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AW-001 | Done | `scripts/check-dist.mjs`; `package.json` | `sed -n "1,260p" AGENTS.md`; `sed -n "1,320p" CODEX_NIGHTLY_PLAN.md`; `git status --short --branch --ignored=matching`; `git diff --stat`; `git diff --check`; `sed -n "1,120p" package.json`; `find dist -maxdepth 2 -type f -print`; `sed -n "1,80p" dist/index.html`; `sed -n "1,100p" dist/404.html`; `npm run build && npm run check:dist` | First validation attempt hit transient `Wsl/Service/E_UNEXPECTED`; serial retry passed. `npm run build` built 2 pages and `check:dist` reported `Generated-site smoke check passed.` | Low; checks generated output only. | Remove `scripts/check-dist.mjs` and `check:dist` package script. | None. |
| AW-002 | Done | `scripts/check-public-boundary.mjs`; `package.json` | `sed -n "1,140p" .gitignore`; `git ls-files`; `find public dist -maxdepth 3 -type f -print`; `sed -n "1,80p" package.json`; `npm run build && npm run check:public-boundary` | Passed. Fresh build succeeded and `check:public-boundary` reported `Public-boundary check passed.` | Low; guard is read-only and checks tracked/public output paths. | Remove `scripts/check-public-boundary.mjs` and `check:public-boundary` package script. | None. |
| AW-003 | Done | `scripts/check-repo-contract.mjs`; `package.json` | `git ls-files -s CLAUDE.md GEMINI.md`; `sed -n "1,20p" .node-version`; `sed -n "1,80p" tsconfig.json`; `sed -n "1,180p" .github/workflows/deploy.yml`; `sed -n "1,90p" package.json`; `npm run check:repo-contract && npm run verify` | Passed. `check:repo-contract` reported `Repo-contract check passed.` Current `npm run verify` passed with 0 Astro diagnostics and 2 built pages. | Low; guard is read-only and checks explicit invariants. | Remove `scripts/check-repo-contract.mjs` and `check:repo-contract` package script. | None. |
| AW-011 | Done | `scripts/check-tracked-files.mjs`; `package.json` | `sed -n "1,140p" .gitignore`; `git ls-files`; `sed -n "1,100p" package.json`; `npm run check:tracked-files && npm run verify` | Passed. `check:tracked-files` reported `Tracked-file hygiene check passed.` Current `npm run verify` passed with 0 Astro diagnostics and 2 built pages. | Low; guard is read-only and checks tracked files only. | Remove `scripts/check-tracked-files.mjs` and `check:tracked-files` package script. | None. |
| AW-012 | Done | `scripts/check-runtime-contract.mjs`; `package.json` | `sed -n "1,40p" .node-version`; `sed -n "1,120p" package.json`; `rg -n "node-version|Node 24|@types/node|node >=|node >=" .github package.json README.md AGENTS.md ROADMAP.md .node-version`; `npm run check:runtime-contract && npm run verify` | Passed. `check:runtime-contract` reported `Runtime-contract check passed.` Current `npm run verify` passed with 0 Astro diagnostics and 2 built pages. | Low; guard is read-only and checks runtime metadata only. | Remove `scripts/check-runtime-contract.mjs` and `check:runtime-contract` package script. | None. |
| AW-004 | Done | `package.json` | `sed -n "1,120p" package.json`; `npm run verify && npm audit --audit-level=moderate` | Passed. Updated `verify` ran `check`, `build`, and `check:guards`; all core guards passed. Audit reported `found 0 vulnerabilities`. | Low to Medium; `verify` is stricter but uses only passing read-only guards after build. | Restore previous `verify` script and remove `check:guards` reference. | None. |
| AW-005 | Done | `README.md` | `sed -n "1,180p" README.md`; `sed -n "1,120p" package.json`; `npm run verify`; `git diff -- README.md` | Passed. `npm run verify` passed with all guards. README diff only documents `check:guards`, updated `verify`, and notes no lint/test framework is configured. | Low; documentation-only. | Revert README changes. | None. |
| AW-006 | Done | `ROADMAP.md` | `sed -n "1,140p" ROADMAP.md`; `sed -n "1,120p" package.json`; `npm run verify`; `git diff -- ROADMAP.md` | Passed. `npm run verify` passed with all core guards. ROADMAP diff is a single maintenance entry for local `verify` guards. | Low; documentation-only. | Revert ROADMAP changes. | None. |
| AW-007 | Done | `src/data/profile.ts` | `sed -n "1,120p" src/data/profile.ts`; `sed -n "1,90p" src/pages/index.astro`; `sed -n "1,100p" src/pages/404.astro`; `npm run check`; `npm run build`; `rg -n "Rewriting|Jeremy Dawson|This site is down while I rewrite it|Back when it&#39;s ready" dist/index.html` | Passed. Astro check reported 0 diagnostics, build succeeded, and rendered homepage text remained unchanged. | Low; type-only source change. | Revert the `ComingSoonContent` type and `comingSoon` annotation. | None. |
| AW-008 | Done | `scripts/check-dist.mjs` | `sed -n "1,240p" scripts/check-dist.mjs`; `sed -n "1,80p" src/data/profile.ts`; `sed -n "1,80p" src/pages/404.astro`; `npm run build`; `npm run check:dist`; `npm run verify` | Passed. Fresh build succeeded, direct `check:dist` passed, and full `verify` passed with rendered-copy assertions included. | Low; checks generated HTML only. | Remove the added body-copy assertions from `scripts/check-dist.mjs`. | None. |
| AW-009 | Done | `scripts/check-base-path.mjs`; `package.json`; `README.md` | First context read hit `Wsl/Service/E_UNEXPECTED`; serial retry succeeded. `sed -n "1,120p" astro.config.mjs`; `rg -n "BASE_URL|canonical|new URL" src astro.config.mjs scripts/check-dist.mjs`; `sed -n "1,130p" package.json`; `npm run check:base-path`; `npm run verify` | Passed. `check:base-path` built with `BASE_PATH=/preview/` and `SITE_URL=https://example.invalid`; `check-dist` passed against those expected values. Normal `verify` then rebuilt and passed root output checks. | Low; adds optional validation script and docs, leaves normal `verify` root-based. | Remove `scripts/check-base-path.mjs`, `check:base-path` package script, and README command text. | None. |
| AW-010 | Done | `scripts/check-css-contract.mjs`; `package.json`; `README.md`; `ROADMAP.md` | First CSS context read hit `Wsl/Service/E_UNEXPECTED`; serial retry succeeded. `sed -n "1,240p" src/styles/global.css`; `sed -n "1,140p" package.json`; `npm run check:css-contract`; `npm run verify` | Passed. Direct CSS contract check passed, and full `verify` now includes the CSS contract guard and passed. README/ROADMAP wording updated to include CSS guard. | Low; guard checks existing CSS affordances only. | Remove `scripts/check-css-contract.mjs`, `check:css-contract` package script, and the CSS entry in `check:guards`; revert docs wording. | None. |
| AW-013 | Done | `README.md` | `sed -n "1,180p" README.md`; `sed -n "1,130p" ROADMAP.md`; `sed -n "1,140p" package.json`; `sed -n "1,120p" .github/dependabot.yml`; `npm run verify`; `npm audit --audit-level=moderate`; `git diff -- README.md` | Passed. `npm run verify` passed with all guards. Audit reported `found 0 vulnerabilities`. README now documents targeted manual dependency changes and avoiding `npm audit fix --force`. | Low; documentation-only, no dependency versions changed. | Revert dependency posture README sentence. | None. |
| AW-014 | Done | `src/legacy-public/README.md` | `find src/legacy-public -maxdepth 3 -type f -print`; `sed -n "1,80p" tsconfig.json`; `rg -n "legacy-public|Legacy archive|Prior full-site" AGENTS.md README.md ROADMAP.md`; `npm run verify` | Passed. Full `verify` passed with all guards. Added documentation only; no legacy component, asset, or enhancement code changed. | Low; documentation-only under archived source. | Delete `src/legacy-public/README.md`. | None. |

### Final Inventory

- Done: `AW-001`, `AW-002`, `AW-003`, `AW-011`, `AW-012`, `AW-004`, `AW-005`, `AW-006`, `AW-007`, `AW-008`, `AW-009`, `AW-010`, `AW-013`, `AW-014`.
- Partially Done: none.
- Blocked: none.
- Not Started: none in the Safe Overnight Work Queue.
- Files changed for queued work: `CODEX_NIGHTLY_PLAN.md`, `README.md`, `ROADMAP.md`, `package.json`, `src/data/profile.ts`, `src/legacy-public/README.md`, and `scripts/*.mjs`.
- Generated/ignored directories present after validation: `.astro/`, `dist/`, and `node_modules/`; these remain ignored and untracked.
- No dependencies, package versions, workflow triggers, deployment settings, CV/resume links, public profile links, legacy behavior, or generated public assets were added.
- `CLAUDE.md` and `GEMINI.md` remain tracked symlinks with git mode `120000`.
- Final checklist evidence before commit:
  - `git status --short --branch --ignored=matching`: branch `main...origin/main`; queued files modified/untracked; ignored `.astro/`, `dist/`, `node_modules/`.
  - `git diff --stat`: tracked modifications in `README.md`, `ROADMAP.md`, `package.json`, and `src/data/profile.ts`; untracked review files listed separately with `git ls-files --others --exclude-standard`.
  - `git diff --check`: passed.
  - `npm run check`: passed with 0 errors, 0 warnings, 0 hints.
  - `npm run build`: passed and built 2 pages.
  - `npm run verify`: passed with generated-site, public-boundary, repo-contract, tracked-file, runtime-contract, and CSS-contract guards.
  - `npm audit --audit-level=moderate`: passed with `found 0 vulnerabilities`.
  - `git ls-files -s CLAUDE.md GEMINI.md`: both entries mode `120000`.
  - Secret keyword scan: only policy/config/package-name matches (`id-token`, documentation text, package-lock dependency names); no credential material found.
  - `find public dist -maxdepth 3 -type f -print | sort`: only `CNAME`, favicon files, `dist/index.html`, and `dist/404.html`.
  - Post-staging checks: `git diff --cached --check` passed; post-staging `npm run verify` and `npm audit --audit-level=moderate` passed before the checkpoint commit.
