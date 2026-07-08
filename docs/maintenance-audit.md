# Maintenance Audit

## Audit Metadata

- Audit date: 2026-07-05
- Target repo root: `/home/jer/repos/jeremydawson-site`
- User-supplied prompt-pack path: `/mnt/c/Users/jer/Downloads/codex-repo-health-goal-prompts-entrypoint-v5-deep-evidence`
- Resolved prompt-pack root: `/mnt/c/Users/jer/Downloads/codex-repo-health-goal-prompts-entrypoint-v5-deep-evidence/codex-repo-health-goals-entrypoint-v5-deep-evidence`
- Prompt-pack version: v5 deep-evidence sequential edition, from `MANIFEST.md`
- Branch/status at audit start: `main...origin/main` with existing uncommitted maintenance changes in `.github/workflows/deploy.yml`, `.gitignore`, `AGENTS.md`, `README.md`, `ROADMAP.md`, `scripts/check-base-path.mjs`, `scripts/check-repo-contract.mjs`, and untracked `docs/`
- Repo purpose/type: public static Astro personal site serving a temporary placeholder while a full professional site is rewritten
- Stack: Astro 7, TypeScript, vanilla CSS, plain JavaScript archived under `src/legacy-public`
- Package manager/runtime: npm with `package-lock.json`; `.node-version` is `24`; `package.json` requires Node `>=22.12.0` and declares `packageManager: npm@11.17.0`
- Local verification runtime used: `/home/jer/.cache/codex-node-v24.14.0-linux-x64/bin` with Node `v24.14.0` and npm `11.9.0`
- Risk level: low runtime complexity, moderate public/privacy sensitivity because the repository and generated site are public

## Prompt-Pack And Repo Instructions Read

Prompt-pack files read and followed:

- `RUN_THIS_FIRST.md`
- `MANIFEST.md`
- `codex-goals/00-shared-repo-native-autonomous-safety-contract.md`
- `codex-goals/00A-deep-evidence-and-coverage-gates.md`
- `codex-goals/12-single-goal-sequential-repo-health-suite.md`
- `codex-goals/01-general-code-quality-docs-maintenance.md`
- `codex-goals/04-test-coverage-regression.md`
- `codex-goals/03-security-privacy-secrets.md`
- `codex-goals/05-ci-automation-developer-workflow.md`
- `codex-goals/06-dependency-package-hygiene.md`
- `codex-goals/07-documentation-onboarding.md`
- `codex-goals/02-architecture-maintainability.md`
- `codex-goals/09-performance-scalability.md`
- `codex-goals/10-database-data-migration-health.md`
- `codex-goals/08-release-readiness.md`
- `codex-goals/11-public-repo-presentation.md`

Repo-local instructions and conventions considered:

- `AGENTS.md`: keep the site minimal, edit active placeholder copy in `src/data/profile.ts`, keep legacy public code archived under `src/legacy-public`, avoid new dependencies/tooling without discussion, preserve Node 24 runtime policy, keep deployment manual-only, preserve `CLAUDE.md` and `GEMINI.md` as symlinks, and preserve the repo authorship policy.
- `README.md`: public documentation boundary, current placeholder status, commands, deployment notes, Windows/WSL symlink note, and dependency-maintenance guidance.
- `ROADMAP.md`: temporary-placeholder status, full-site rewrite roadmap, no public CV/resume yet, manual-only deployment policy, and dependency/runtime maintenance notes.
- Requested `documentation-guidelines.md`, `testing-guidelines.md`, and `roadmap-process.md` files were not present in maintained repo paths during final maintenance.
- Existing package scripts and guard scripts are the repo-native verification layer. There is no standalone formatter, linter, browser test, database check, or application test framework.

## Reviewable-File Inventory And Coverage Tier

Inventory evidence:

- `git rev-parse --show-toplevel`: `/home/jer/repos/jeremydawson-site`
- `git ls-files | wc -l`: 41 tracked files
- `rg --files --hidden -g '!node_modules' -g '!dist' -g '!.git' -g '!.astro'`: 39 visible review surfaces including the untracked report
- Reviewable text count, excluding lockfile, binary assets, and symlinks: 36 text files, 2,898 lines
- Generated/dependency/cache exclusions: `.git/`, `node_modules/`, `dist/`, `.astro/`
- Binary/asset files checked by metadata rather than text review: `public/favicon.ico`, `src/legacy-public/og/jeremy-dawson-social.png`
- Lockfile checked for presence, direct dependency consistency, install dry run, audit/outdated results, and top-level package metadata rather than manual line-by-line review

Coverage tier: **Small repo**. The maintained source, docs, config, scripts, CI, and archived reviewable source files were swept directly. The only non-manual-review exclusions were generated/dependency/cache directories, binary assets, symlinks, and the lockfile bulk contents.

Inventory groups:

- Active source/application code: `src/data/profile.ts`, `src/pages/index.astro`, `src/pages/404.astro`, `src/layouts/BaseLayout.astro`, `src/styles/global.css`
- Archived legacy source/assets: `src/legacy-public/README.md`, `src/legacy-public/enhancements.js`, `src/legacy-public/components/*.astro`, `src/legacy-public/og/jeremy-dawson-social.svg`, `src/legacy-public/og/jeremy-dawson-social.png`
- Static public assets: `public/CNAME`, `public/favicon.svg`, `public/favicon.ico`
- Scripts/automation: `scripts/check-base-path.mjs`, `scripts/check-css-contract.mjs`, `scripts/check-dist.mjs`, `scripts/check-public-boundary.mjs`, `scripts/check-repo-contract.mjs`, `scripts/check-runtime-contract.mjs`, `scripts/check-tracked-files.mjs`
- Package/runtime/config: `package.json`, `package-lock.json`, `.node-version`, `.npmrc`, `astro.config.mjs`, `tsconfig.json`, `.gitattributes`, `.gitignore`
- CI/dependency automation: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `.github/dependabot.yml`
- Docs/instructions/planning: `README.md`, `AGENTS.md`, `ROADMAP.md`, `docs/maintenance-audit.md`
- Tracked symlinks: `CLAUDE.md`, `GEMINI.md`, both mode `120000` pointing to `AGENTS.md`
- Tests: no `test`, `tests`, `spec`, fixture, snapshot, or `*.test.*` files found; test confidence comes from repo-specific guard scripts and build/type checks
- Database/infrastructure/container files: none found in maintained paths
- Public release files: no `LICENSE`, `CHANGELOG`, `CONTRIBUTING`, `SECURITY`, `.env.example`, Docker, Makefile, taskfile, or pre-commit config found in maintained paths

## Baseline Verification

Baseline checks were run against the current working tree after resolving the v5 prompt pack and inspecting the repo status.

| Command or probe | Result | Evidence and notes |
| --- | --- | --- |
| `sed -n '1,260p' /mnt/c/.../v5-deep-evidence/RUN_THIS_FIRST.md` | Failed as path-resolution probe | The user-supplied path was the extracted parent. It did not contain `RUN_THIS_FIRST.md`; the nested directory had exactly one valid prompt-pack root and was used. |
| `git status --short --branch` | Passed | `## main...origin/main` with seven modified tracked files and untracked `docs/`. |
| `git ls-files` | Passed | 41 tracked files, including the two symlinks. |
| `find . -maxdepth 3 ...` | Passed | Confirmed untracked `docs/maintenance-audit.md` and maintained top-level surfaces; deeper tracked files were covered by `git ls-files`. |
| `PATH=... npm run verify` | Passed | `astro check` returned 0 errors, 0 warnings, 0 hints; production build generated 2 pages; all guard scripts passed. |
| `PATH=... npm run check:base-path` | Passed | Built with `/preview/`; generated-site smoke check passed. |
| `PATH=... npm audit --audit-level=low` | Passed | `found 0 vulnerabilities`. |
| `PATH=... npm ls --depth=0` | Passed | Direct packages: `astro@7.0.3`, `@astrojs/check@0.9.9`, `@types/node@24.13.2`, `typescript@6.0.3`. |
| `PATH=... npm ci --dry-run` | Passed | Dry-run install plan completed without tracked lockfile/package changes. |
| `PATH=... npm outdated --long` | Non-zero by design | Reported `astro` `7.0.3 -> 7.0.6`; `@types/node` latest `26.1.0` but wanted remains `24.13.2` under Node 24 policy. |
| `PATH=... node --check astro.config.mjs scripts/*.mjs` | Passed | No syntax errors. |
| YAML parse of `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `.github/dependabot.yml` using existing `yaml` package | Passed | All parsed successfully. |
| `rg --files --hidden -g '!node_modules' -g '!dist' -g '!.git' -g '!.astro'` | Passed | Inventory produced maintained and untracked review surfaces. |
| Broad `rg` for `TODO`, `FIXME`, debug logs, secret/auth/db terms, dangerous operations, env vars, and database markers | Passed with expected hits | Hits were guard messages, docs wording, GitHub Pages `id-token`, archived SVG DOM `innerHTML` clearing, env var references, and transitive lockfile package names. No actionable secret or data-layer issue found. |
| `find` for `.env`, `.env.*`, key/cert/credential/secret filenames excluding generated/dependency trees | Passed | No files found. |
| `find` for migration/schema/seed/SQL/sqlite/db filenames excluding generated/dependency trees | Passed | No files found. |
| `find` for OS/editor/log/temp junk excluding generated/dependency trees | Passed | No files found. |
| `git ls-files | rg` for tests/specs/fixtures/snapshots | No matches | No standalone test files exist. |
| `find` and `git ls-files | rg` for Docker/Makefile/taskfile/pre-commit/license/changelog/contributing/security/env example files | No matches | These surfaces are absent in maintained paths. |
| Temporary-copy negative guard checks | Passed | Missing symlink, missing deploy guard, public `.env.local`, and tracked `.codex/config.json` all failed with expected guard messages. |
| Missing-`npm` base-path simulation | Passed | `PATH=/tmp/nonexistent... node scripts/check-base-path.mjs` failed with `Failed to run npm run build: spawnSync npm ENOENT`. |
| `git ls-remote --tags` for configured GitHub Actions | Passed | Configured major tags are current for `actions/checkout@v7`, `actions/setup-node@v6`, `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5`, and `actions/deploy-pages@v5`. |

One discovery command initially walked `node_modules` because the prune expression was wrong. Its output was discarded for repo-surface conclusions and the corrected pruned command was rerun.

## Pass Sequence

The v5 sequential-suite order was followed without reordering:

1. `01-general-code-quality-docs-maintenance.md`
2. `04-test-coverage-regression.md`
3. `03-security-privacy-secrets.md`
4. `05-ci-automation-developer-workflow.md`
5. `06-dependency-package-hygiene.md`
6. `07-documentation-onboarding.md`
7. `02-architecture-maintainability.md`
8. `09-performance-scalability.md`
9. `10-database-data-migration-health.md`
10. `08-release-readiness.md`
11. `11-public-repo-presentation.md`

## Pass Completion Table

| Pass | Status | Summary |
| --- | --- | --- |
| 01 General code quality/docs/maintenance | Fixed changes | Kept targeted guard-script diagnostics, ignore hygiene, and report update; no active placeholder behaviour changed. |
| 04 Test coverage/regression | Fixed changes | Extended repo-contract guard coverage and verified negative cases; no new test framework added. |
| 03 Security/privacy/secrets | Fixed changes | Strengthened ignored env/tool-local boundaries and deploy guard coverage; no secrets found. |
| 05 CI/automation/developer workflow | Fixed changes | Manual deploy now runs guard suite after build and before Pages artifact upload; docs and contract guard align with it. |
| 06 Dependency/package hygiene | No dependency changes | Minimal direct dependencies verified; audit clean; patch drift documented rather than upgraded. |
| 07 Documentation/onboarding | Fixed changes | README/AGENTS/ROADMAP updated for deploy guard and build-time env vars; report updated to v5 evidence standard. |
| 02 Architecture/maintainability | No-op with evidence | Current tiny Astro placeholder boundaries are clear; no restructuring justified. |
| 09 Performance/scalability | No-op with evidence | Static two-page placeholder has no active client bundle, request handlers, DB queries, or hot server paths. |
| 10 Database/data/migrations | Skipped as irrelevant | Inventory and searches found no data-layer, migration, schema, seed, ORM, SQL, or database surfaces. |
| 08 Release readiness | Fixed changes | Deploy gate now verifies generated output/public-boundary contracts before artifact upload; no release policy decisions made. |
| 11 Public repo presentation | Fixed changes | Public docs more accurately describe status, commands, env vars, and deployment checks; no marketing or license choices added. |

## 01 General Code Quality, Documentation, And Maintenance

Scope decision:

- Applicable to the small active Astro placeholder, repo-specific guard scripts, docs, package/config, and CI.
- Archived prior-site code under `src/legacy-public` was reviewed for obvious health/security issues but left archived because repo instructions explicitly keep it out of active source.
- Non-app areas such as database, Docker, release automation, and broad formatting/linting were not applicable or owner-dependent.

Surfaces inspected:

- Active source: `src/data/profile.ts`, `src/pages/index.astro`, `src/pages/404.astro`, `src/layouts/BaseLayout.astro`, `src/styles/global.css`
- Archived source: `src/legacy-public/README.md`, `src/legacy-public/enhancements.js`, `src/legacy-public/components/*.astro`, `src/legacy-public/og/jeremy-dawson-social.svg`
- Guard scripts: every file in `scripts/check-*.mjs`
- Config/docs/CI: `package.json`, `package-lock.json`, `.gitignore`, `.npmrc`, `.node-version`, `astro.config.mjs`, `tsconfig.json`, `.github/workflows/*.yml`, `.github/dependabot.yml`, `README.md`, `AGENTS.md`, `ROADMAP.md`
- Public assets: `public/CNAME`, `public/favicon.svg`, `public/favicon.ico`

Searches/probes:

- `git status --short --branch`, `git ls-files`, `rg --files --hidden ...`
- Broad `rg` for TODO/FIXME/HACK/XXX, debug markers, dangerous operations, env/security terms, database terms, and env var references
- `node --check astro.config.mjs scripts/*.mjs`
- `npm run verify`, `npm run check:base-path`

Candidate findings considered:

- `scripts/check-base-path.mjs` could silently exit when `spawnSync` failed before `status` was set: fixed.
- Missing `CLAUDE.md`/`GEMINI.md` symlink produced a raw `ENOENT` stack rather than a normal guard failure: fixed.
- `.gitignore` ignored only `.env` and `.env.production` while repo guards forbid any `.env.*`: fixed.
- `.gitignore` did not mention `.codex/` or `.agents/` even though tracked-file guard disallows them: fixed.
- Active placeholder source and CSS are short, readable, and covered by generated-output/CSS guards: no code churn.
- Legacy `enhancements.js` is large, but archived and not imported by the active site: no refactor.

Change-gate decisions:

- The implemented changes are evidence-backed by guard-script error paths, repo-native because they extend existing scripts/docs/ignore rules, local/reversible, behaviour-preserving for the public site, and verifiable with positive and negative guard checks.
- No formatter, linter, test framework, or architecture change was added because repo instructions explicitly avoid new tools without discussion.

Verification:

- `npm run verify`: passed.
- `npm run check:base-path`: passed.
- `node --check astro.config.mjs scripts/*.mjs`: passed.
- Temporary negative guard checks: passed with expected failures.

## 04 Test Coverage And Regression Confidence

Scope decision:

- Applicable as a guard-script regression-confidence pass. The repo has no standalone test framework, and adding one would violate local instructions without a stronger need.
- Important behaviours are generated output, base path handling, public output boundary, symlink/runtime contracts, tracked-file hygiene, and CSS accessibility affordances.

Surfaces inspected:

- `package.json` scripts: `check`, `build`, `check:guards`, `check:base-path`, `verify`
- Guard scripts in `scripts/`
- `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`
- Generated output from `dist/` after `npm run verify` and `npm run check:base-path`
- Search result showing no test/spec/fixture/snapshot files

Searches/probes:

- `git ls-files | rg` for tests/specs/fixtures/snapshots: no matches.
- `npm run verify`, `npm run check:base-path`
- Temporary-copy negative cases for `check-repo-contract`, `check-public-boundary`, and `check-tracked-files`
- Missing-`npm` simulation for `check-base-path`

Candidate findings considered:

- Manual deploy could upload a Pages artifact without running the full guard suite: fixed by adding deploy guard step and contract check.
- `check-repo-contract` did not fail gracefully when a required symlink was missing: fixed.
- `check-base-path` did not report spawn errors clearly: fixed.
- Full browser/Playwright tests would be disproportionate for the placeholder and conflict with AGENTS guidance: deferred/no-op.

Change-gate decisions:

- The added regression confidence stays in the existing guard-script pattern, requires no dependencies, and directly protects documented repo contracts.
- No test framework or browser test was added; remaining gaps are better revisited when the full site rewrite introduces interactive behaviours.

Verification:

- Positive guard suite: passed through `npm run verify`.
- Non-root base-path smoke: passed through `npm run check:base-path`.
- Negative checks failed as expected for missing deploy guard, missing symlink, public env file, and tracked local tool config.

## 03 Security, Privacy, And Secrets Hygiene

Scope decision:

- Applicable to public documentation, public/generated assets, repo ignore rules, GitHub Pages workflow permissions, package scripts, env var handling, and archived legacy client code.
- Authn/authz, cookies, CORS, sessions, server/client secret separation, data access, and production credential rotation are not applicable because this is a static Astro site with no server-side app or data layer in the repo.

Surfaces inspected:

- `.gitignore`, `.npmrc`, `package.json`, `package-lock.json`
- `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `.github/dependabot.yml`
- `README.md`, `AGENTS.md`, `ROADMAP.md`
- `public/`, `src/layouts/BaseLayout.astro`, active pages, and archived legacy source
- Guard scripts `check-public-boundary.mjs`, `check-tracked-files.mjs`, `check-runtime-contract.mjs`, `check-repo-contract.mjs`

Searches/probes:

- Broad `rg` for secret/token/password/api key/private key/credential/bearer/jwt/cookie/csrf/cors/auth/session terms.
- `find` for `.env`, `.env.*`, key/cert/credential/secret filenames excluding generated/dependency trees.
- `npm audit --audit-level=low`.
- `check-public-boundary` and `check-tracked-files` positive and negative checks.

Candidate findings considered:

- Broader env-file ignore coverage was missing relative to existing guards: fixed with `.env.*`.
- Local tool directories `.codex/` and `.agents/` were not ignored although tracked-file guard rejects them: fixed.
- GitHub Pages `id-token: write` looked like a token hit but is expected Pages permission: not an issue.
- Archived `innerHTML = ""` operations clear owned SVG groups before adding generated SVG nodes: no active XSS surface found.
- Google-hosted fonts create third-party requests on the public site: documented as an owner/design/privacy tradeoff, not changed.

Change-gate decisions:

- Ignore-rule and deploy-guard changes are local, verifiable, and align with existing public-boundary controls.
- No secrets were found, so no secret redaction, history rewrite, or rotation action was needed or attempted.

Verification:

- `npm audit --audit-level=low`: passed with 0 vulnerabilities.
- `npm run verify`: passed, including public-boundary and tracked-file guards.
- Negative public-boundary/tracked-file checks: failed as expected.

Security/privacy notes:

- No committed env files, private keys, credential files, sensitive logs, or obvious hardcoded secrets were found.
- Public docs intentionally exclude DNS, monitoring, credentials, production runbooks, and environment-specific paths.
- No external secret-scanning service was used.

## 05 CI, Automation, And Developer Workflow

Scope decision:

- Applicable to npm scripts, GitHub Actions workflows, Dependabot, Node runtime metadata, docs for commands/env vars, and guard scripts.
- Not applicable to Docker, Makefiles, pre-commit hooks, release automation, or new CI providers because the repo has none and explicitly avoids new tooling/process without discussion.

Surfaces inspected:

- `package.json` scripts and `package-lock.json`
- `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `.github/dependabot.yml`
- `.node-version`, `.npmrc`
- `README.md`, `AGENTS.md`, `ROADMAP.md`
- All `scripts/check-*.mjs`

Searches/probes:

- YAML parse for workflow/dependabot files.
- `git ls-remote --tags` for all configured GitHub Actions.
- `npm run verify`, `npm run check:base-path`, `npm ci --dry-run`.
- `rg` for env var references and documented command names.

Candidate findings considered:

- Deploy workflow ran `npm run check` and `npm run build` but not `npm run check:guards` before upload: fixed.
- Deployment docs in `README.md`, `AGENTS.md`, and `ROADMAP.md` did not include the new guard step: fixed.
- `check-repo-contract` did not protect the deploy guard step/order: fixed.
- The default shell in this environment lacked `node` and `npm` on `PATH`: documented; not a repo change because `.node-version` and CI Node setup are already present.

Change-gate decisions:

- Adding an existing script to an existing manual deploy workflow is repo-native and lower-risk than inventing a new CI process.
- The added contract assertion protects the workflow from drifting back.

Verification:

- YAML parse: passed.
- GitHub Actions tag checks: configured major versions are current.
- `npm run verify`: passed locally with explicit Node path.

Command matrix:

| Command | Defined in | Run | Result |
| --- | --- | --- | --- |
| `npm install` | `README.md` | Not run | `npm ci --dry-run` was safer for lockfile/install validation. |
| `npm run dev` | `package.json`, README/AGENTS | Not run | Dev server launch not needed for static verification. |
| `npm run check` | `package.json` | Yes via `npm run verify` | Passed. |
| `npm run build` | `package.json` | Yes via `npm run verify` and `check:base-path` | Passed. |
| `npm run check:guards` | `package.json` | Yes via `npm run verify` | Passed. |
| `npm run check:base-path` | `package.json` | Yes | Passed. |
| `npm run verify` | `package.json`, CI | Yes | Passed. |
| `npm run preview` | `package.json` | Not run | Requires a built site and starts a local server; build/output checks covered static artifact validity. |

## 06 Dependency And Package Hygiene

Scope decision:

- Applicable to npm manifest/lockfile, direct dependency usage, runtime metadata, npm registry config, Dependabot, audit/outdated status, and package scripts.
- Not applicable to workspaces, alternate package managers, containers, publishing, or package exports.

Surfaces inspected:

- `package.json`, `package-lock.json`, `.npmrc`, `.node-version`
- `.github/dependabot.yml`, `.github/workflows/*.yml`
- Imports/usages in `astro.config.mjs`, active Astro files, guard scripts, docs, and lockfile top-level package section

Searches/probes:

- `npm ls --depth=0`
- `npm audit --audit-level=low`
- `npm outdated --long`
- `npm ci --dry-run`
- `rg` for direct dependency names, runtime/env references, and package-script usage

Candidate findings considered:

- `astro` patch update `7.0.3 -> 7.0.6` is available: deferred to a focused dependency update because current audit/build/guards pass and the repo avoids broad/risky dependency churn.
- `@types/node` latest is `26.1.0`, but repo policy intentionally stays on the Node 24 line: not changed.
- Direct dependencies align with usage: `astro` for build/runtime, `@astrojs/check` for diagnostics, `typescript` and `@types/node` for type/script support.
- npm registry config is scoped and matches Dependabot docs: no change.

Change-gate decisions:

- No dependency or lockfile changes were made. Available updates are either patch drift better handled separately or intentionally outside runtime policy.

Verification:

- `npm audit --audit-level=low`: passed.
- `npm ls --depth=0`: passed.
- `npm ci --dry-run`: passed.
- `npm run verify`: passed.

Dependency-change table:

| Package/config | Changed | Reason | Risk | Verification |
| --- | --- | --- | --- | --- |
| `package.json` dependencies/devDependencies | No | Current direct dependencies match repo usage. | None introduced | `npm ls`, `npm audit`, `npm run verify` passed. |
| `package-lock.json` | No | No dependency action required. | None introduced | `npm ci --dry-run` passed. |
| `.npmrc` | No | Registry scoping already matches docs/Dependabot expectations. | None introduced | Static inspection. |
| Dependabot Node-types policy | No | Semver-major ignore for `@types/node` is intentional while runtime is Node 24. | None introduced | Runtime-contract guard passed. |

## 07 Documentation And Onboarding

Scope decision:

- Applicable to README commands, env var docs, deployment docs, repo instructions, roadmap maintenance notes, legacy archive note, and report.
- Not applicable to docs site, generated API docs, contribution process, code of conduct, security policy, badges, or marketing copy.

Surfaces inspected:

- `README.md`, `AGENTS.md`, `ROADMAP.md`, `src/legacy-public/README.md`
- `package.json` scripts, `astro.config.mjs`, `scripts/check-dist.mjs`, `.github/workflows/*.yml`
- Active source entry points and public assets for docs/code consistency

Searches/probes:

- `rg` for `SITE_URL`, `BASE_PATH`, `REPO_NAME`, `GITHUB_ACTIONS`, `GITHUB_REPOSITORY`
- Cross-check of documented commands against `package.json`
- `npm run verify`, `npm run check:base-path`

Candidate findings considered:

- Build-time env vars were used by config/guards but not documented in README: fixed.
- Deploy docs did not mention the guard-suite step after the workflow change: fixed in README/AGENTS/ROADMAP.
- The report was v4-specific and too thin for v5 evidence gates: replaced with this v5 report.
- No `.env.example` exists. Because env vars are optional build-time overrides and repo guards reject `.env.*`, README documentation is the least intrusive fit.

Change-gate decisions:

- Documentation changes are factual, short, and tied to actual scripts/config. No new docs system or public process was added.

Verification:

- Commands documented as verification commands were run and passed.
- `node --check` and YAML parse passed for referenced config/script files.

Documentation inventory:

| Doc | Role | Changed |
| --- | --- | --- |
| `README.md` | Public overview, status, commands, env vars, deployment notes | Yes |
| `AGENTS.md` | Repo instructions for coding agents | Yes |
| `ROADMAP.md` | Site rewrite and maintenance status | Yes |
| `src/legacy-public/README.md` | Explains archived legacy source | No |
| `docs/maintenance-audit.md` | Maintenance audit report | Yes |

## 02 Architecture And Maintainability

Scope decision:

- Applicable as a documentation/evidence-backed architecture review of the current tiny Astro placeholder and guard-script structure.
- Broad refactors are not justified: the active site is intentionally minimal, the legacy site is archived, and repo instructions discourage speculative refactoring.

Surfaces inspected:

- `src/data/profile.ts`
- `src/pages/index.astro`, `src/pages/404.astro`
- `src/layouts/BaseLayout.astro`
- `src/styles/global.css`
- `src/legacy-public/*`
- `scripts/check-*.mjs`
- `astro.config.mjs`, `tsconfig.json`, README/AGENTS/ROADMAP

Searches/probes:

- Manual file sweep of active source and archived legacy source.
- `rg` for imports, `Astro.props`, `import.meta.env`, `process.env`, and dependency names.
- `wc -l` on reviewable text files to identify unusually large units.
- `npm run verify`, `node --check`.

Candidate findings considered:

- `src/legacy-public/enhancements.js` is large at 1,208 lines but intentionally archived, excluded from `tsconfig`, and not emitted in production: no change.
- Base-path derivation exists in both `astro.config.mjs` and `scripts/check-dist.mjs`: left as a deliberate cross-check between config and generated-output guard.
- Active placeholder copy/data separation is clear and matches AGENTS guidance: no change.
- Guard scripts are separate by contract and small enough to keep local: no restructuring.

Change-gate decisions:

- No architecture change passed the value-vs-churn gate. The only maintainability changes kept are focused guard diagnostics and contract checks.

Architecture map:

- `src/data/profile.ts`: source of active placeholder metadata/copy.
- `src/pages/index.astro`: live homepage placeholder.
- `src/pages/404.astro`: live temporary 404 page.
- `src/layouts/BaseLayout.astro`: shared document shell, metadata, canonical URL, icon/font links, global CSS import.
- `src/styles/global.css`: global placeholder styles and accessibility affordances.
- `scripts/check-*.mjs`: repo-specific guard suite for generated output, public boundary, repo contract, runtime metadata, tracked-file hygiene, CSS affordances, and base-path behaviour.
- `src/legacy-public`: archived prior-site code/assets, intentionally inactive.

Verification:

- `npm run verify`: passed.
- `node --check astro.config.mjs scripts/*.mjs`: passed.

## 09 Performance And Scalability

Scope decision:

- Applicable as a static-site performance sanity review.
- No backend, database, request handler, background job, CLI batch path, large runtime dataset, or active client bundle exists in the current generated site.

Surfaces inspected:

- `src/pages/index.astro`, `src/pages/404.astro`, `src/layouts/BaseLayout.astro`, `src/styles/global.css`
- `astro.config.mjs`
- `scripts/check-dist.mjs` generated-output expectations
- `src/legacy-public/enhancements.js` and legacy assets for inactive-heavy-code risk
- Build output logs from `npm run verify` and `npm run check:base-path`

Searches/probes:

- `rg` for `fetch(`, `XMLHttpRequest`, database terms, unbounded data terms, and dependency imports.
- Manual review of active pages/layout/styles.
- Production build through `npm run verify`.

Candidate findings considered:

- Active site has two static pages and no active client script: no code performance issue found.
- Google Fonts are external requests: documented as a possible future privacy/performance owner decision, not changed because it affects visual/design choices.
- Archived legacy animation code is heavy but not active, not type-checked, and not emitted: no change.

Change-gate decisions:

- No performance code change was evidence-backed. Speculative micro-optimizing the placeholder or archived code would add churn without measurable benefit.

Verification:

- `npm run verify`: passed; Astro build generated 2 pages.
- `npm run check:base-path`: passed.

## 10 Database, Data, And Migration Health

Scope decision:

- Not applicable. The repo contains no database/data layer.

Surfaces inspected:

- Full tracked-file inventory.
- `package.json` dependencies/scripts.
- `astro.config.mjs`, active source, guard scripts, docs, CI.

Searches/probes:

- `find` for migration/schema/seed/SQL/sqlite/db filenames excluding generated/dependency trees: no files.
- `rg` for `postgres`, `supabase`, `prisma`, `drizzle`, `sqlite`, `migration`, `seed`, `database`, `sql`: no maintained data-layer surfaces; only transitive lockfile text and report text.
- `git ls-files | rg` for database-style paths: no matches.

Candidate findings considered:

- No migrations, schema files, seed files, ORM configs, database env vars, SQL files, or query code exist: no-op.

Change-gate decisions:

- No database changes were possible or appropriate.

Data safety notes:

- No database was connected to.
- No migrations were created or run.
- No data was modified.

Verification:

- Static inventory and searches prove the pass is irrelevant to this repo.
- `npm run verify` still passed.

## 08 Release Readiness

Scope decision:

- Applicable to the repository's actual release surface: manual GitHub Pages deployment of a static placeholder and public repository handoff.
- Not applicable to package publishing, tagging, version bumping, changelog policy, license choice, or release automation.

Surfaces inspected:

- `README.md`, `ROADMAP.md`, `AGENTS.md`
- `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`
- `package.json`, `package-lock.json`, `.node-version`, `.npmrc`
- `public/CNAME`, active pages/layout/styles, guard scripts, generated output checks

Searches/probes:

- `npm run verify`, `npm run check:base-path`, `npm audit --audit-level=low`, YAML parse.
- `find`/`git ls-files | rg` for `LICENSE`, `CHANGELOG`, `CONTRIBUTING`, `SECURITY`, `.env.example`: no matches.
- GitHub Actions tag checks.

Candidate findings considered:

- Manual deploy lacked guard-suite gate before upload: fixed.
- Docs did not reflect deploy gate: fixed.
- No license exists: owner decision, not chosen.
- No changelog/release policy exists: not needed for this minimal personal site unless owner wants it.
- No public CV/resume/link expansion should be added until content is ready: left as ROADMAP owner decision.

Change-gate decisions:

- Adding existing guard checks to manual deploy improves readiness without changing deployment target or release policy.
- No publishing, versioning, license, deploy, or GitHub settings actions were taken.

Verification:

- `npm run verify`: passed.
- `npm run check:base-path`: passed.
- YAML parse: passed.
- Deploy guard negative check: failed as expected when the guard step was removed in a temporary copy.

Release-readiness checklist:

| Item | Status | Notes |
| --- | --- | --- |
| Install/build commands documented | Ready | README lists npm commands and Node 24 runtime policy. |
| Typecheck/build/guard verification | Ready | `npm run verify` passed. |
| Non-root base-path output | Ready | `npm run check:base-path` passed. |
| Manual Pages deploy gate | Fixed | Deploy now runs `npm run check:guards` after build and before upload. |
| Public output boundary | Ready | Positive and negative guard checks passed. |
| Dependency audit | Ready | `npm audit --audit-level=low` found 0 vulnerabilities. |
| Dependency patch drift | Owner decision | Astro patch update available; not applied in this pass. |
| License/public reuse posture | Owner decision | No license exists and none was chosen. |
| Full public-site content | Owner decision | ROADMAP keeps rewrite/profile/CV work pending. |

## 11 Public Repo Presentation

Scope decision:

- Applicable because this is a public personal-site repository.
- Public presentation should stay conservative because the live site is intentionally a temporary placeholder and the full professional content is not ready.

Surfaces inspected:

- `README.md`, `ROADMAP.md`, `AGENTS.md`, `package.json`
- Active pages and copy: `src/data/profile.ts`, `src/pages/index.astro`, `src/pages/404.astro`
- Public assets: `public/CNAME`, favicon files, legacy social card archive
- Absence of license/changelog/contributing/security/public templates

Searches/probes:

- Cross-check README/ROADMAP claims against active source and package scripts.
- `rg` for CV/resume/public profile mentions.
- `find` for public-facing process/license files.
- `npm run verify` and generated-output smoke check.

Candidate findings considered:

- Public docs should clearly state placeholder status and no public CV/resume: already present, left intact.
- Deployment and env-var docs were incomplete for current workflow/config: fixed.
- Adding badges/screenshots/marketing/contribution/security policy/license would impose owner/public-posture decisions: not done.
- Package name `site`, private `true`, and version `0.0.1` are acceptable for a non-published personal site: no change.

Change-gate decisions:

- Public-facing docs were updated only where they directly reflect real scripts/config/workflows.
- No claims were added about production readiness, security posture, support, licensing, or mature public contribution process.

Verification:

- `npm run verify`: passed.
- README command claims were cross-checked against `package.json`.

Inferred audience/status:

- Audience: maintainer and external readers reviewing the source for the public personal site.
- Status: temporary placeholder while the full site is rewritten.
- Owner decisions before broader public promotion: full site content, public profile links, CV/resume availability, license/public reuse posture, optional self-hosted fonts.

## Changes Applied

Tracked changes retained/updated during this maintenance campaign:

- `.github/workflows/deploy.yml`: added `npm run check:guards` after build and before `actions/upload-pages-artifact`.
- `.gitignore`: broadened env-file ignore to `.env.*`; added `.codex/` and `.agents/` local tool config ignores.
- `scripts/check-base-path.mjs`: report spawn errors and termination signals before checking status.
- `scripts/check-repo-contract.mjs`: report missing symlinks through the normal failure list and enforce deploy guard-suite order.
- `README.md`: document optional `SITE_URL`, `BASE_PATH`, `REPO_NAME`, and GitHub Actions env var inference; document deploy guard suite.
- `AGENTS.md`: document deploy guard suite and local tool config ignore guidance.
- `ROADMAP.md`: document deploy guard suite in the manual Pages workflow note.
- `docs/maintenance-audit.md`: replace the old v4 report with this v5 deep-evidence combined report.

No dependency, lockfile, runtime, active public copy, public asset, package-manager, deployment target, framework, or architecture changes were made.

## Security And Privacy Notes

- No likely real secrets were found.
- No committed env/key/credential files were found.
- No sensitive generated artifacts are tracked.
- Public-boundary and tracked-file guards passed and were negative-tested.
- The deploy workflow's `id-token: write` permission is expected for GitHub Pages and remains explicit.
- Public docs intentionally exclude private deployment runbooks, DNS notes, monitoring details, credentials, and environment-specific production paths.
- Google-hosted fonts remain an owner/design/privacy tradeoff to revisit only if third-party request minimization becomes a requirement.

## Deferred Or Rejected Recommendations

| Recommendation | Status | Reason |
| --- | --- | --- |
| Upgrade `astro` from `7.0.3` to `7.0.6` | Deferred | Patch update is available, but current audit/build/guards pass; better handled as a focused dependency-maintenance change. |
| Move `@types/node` to latest major | Rejected for now | Latest is Node 26; repo policy intentionally keeps Node types on the Node 24 line. |
| Add a test framework | Rejected for now | Existing repo-native guard scripts cover current placeholder risks; AGENTS says not to add test frameworks without discussion. |
| Add Playwright/browser checks | Deferred | AGENTS says browser-style checks should stay in GitHub CI if introduced later; no current interactive active site behaviour. |
| Refactor archived legacy animation code | Rejected for now | It is archived, excluded from active checks, and not emitted in production. |
| Add license/changelog/contributing/security policy | Owner decision | These are public-posture/process/legal decisions, not safe autonomous maintenance. |
| Self-host fonts | Owner decision | Could reduce third-party requests but affects design/asset workflow; not required for current placeholder. |

## Risks, Assumptions, And Compatibility Notes

- The active placeholder page behaviour and public copy are intentionally unchanged.
- The manual deploy workflow now has one extra guard step before artifact upload. It may add a small amount of CI time but uses existing repo-native checks.
- Report evidence is based on local static/build checks, package-manager registry responses, and GitHub tag queries available during the run.
- No production deploy, publish, tag, commit, push, cloud-resource change, credential rotation, or migration was performed.
- The prompt pack was treated as read-only and was not copied into the repository.

## Final Verification

Final verification was run after replacing the v4 report with this v5 report.

| Command | Result | Evidence |
| --- | --- | --- |
| `PATH=... npm run check:base-path` | Passed | Built with `/preview/`; `Generated-site smoke check passed.`; `Base-path build check passed.` |
| `PATH=... npm run verify` | Passed | `astro check`: 0 errors, 0 warnings, 0 hints; Astro build produced 2 pages; `check:dist`, `check:public-boundary`, `check:repo-contract`, `check:tracked-files`, `check:runtime-contract`, and `check:css-contract` passed. |
| `PATH=... npm audit --audit-level=low` | Passed | `found 0 vulnerabilities`. |
| `PATH=... npm ci --dry-run` | Passed | Dry-run install completed without tracked package or lockfile changes. |
| `PATH=... node --check astro.config.mjs scripts/*.mjs` | Passed | No syntax-check output and exit code 0. |
| YAML parse for `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `.github/dependabot.yml` | Passed | All three files printed `valid YAML`. |
| `git diff --check` | Passed | No whitespace errors. |

Final self-audit:

- Every required pass from the v5 sequential suite has a report section.
- Each pass section includes concrete scope, surfaces inspected, searches/probes, candidate findings, change-gate decisions, and verification or no-op evidence.
- No pass is marked complete solely from a generic summary.
- No remaining recommendation was implemented when it required a dependency upgrade, new framework/tool, release/legal/public-posture decision, production action, or broader refactor.

Final git status:

- `git status --short --branch`: `## main...origin/main`
- Modified tracked files: `.github/workflows/deploy.yml`, `.gitignore`, `AGENTS.md`, `README.md`, `ROADMAP.md`, `scripts/check-base-path.mjs`, `scripts/check-repo-contract.mjs`
- Untracked: `docs/`
- Ignored generated outputs `.astro/` and `dist/` were removed after final local verification; `node_modules/` remains ignored as the local dependency install.

Final diff summary:

- Tracked diff: 7 files changed, 54 insertions, 12 deletions.
- New report: `docs/maintenance-audit.md`.
- Combined review shape: focused workflow/guard/docs/config changes plus one audit report; no dependency or lockfile changes.

## Professionalization Pass - 2026-07-05

### Scope And Instructions

- Objective: make code-adjacent writing more professional, durable, and suitable for public review without overstating the repo's maturity or changing its process/tooling.
- Audience/maturity assessment: public personal-site repository, currently serving a deliberately minimal temporary Astro placeholder while the full professional site is rewritten.
- Current prompt source: `/mnt/c/Users/jer/.codex/attachments/7e875883-99f0-4c17-a6ac-e80ffbfb8788/pasted-text.txt`.
- External prompt-pack status: `PROMPT_PACK_ROOT` was unset during this run. The previously recorded prompt-pack path under `/mnt/c/Users/jer/Downloads/` was no longer present, so the separate shared safety and deep-evidence files could not be re-read. The attached prompt's repo-native safety constraints and deep-evidence requirements were followed directly.
- Report location decision: this existing `docs/maintenance-audit.md` file is the least intrusive repo-appropriate report location; no new documentation system or top-level documentation file was added.

### Surfaces Inspected

- Public docs and planning: `README.md`, `ROADMAP.md`, `AGENTS.md`, `docs/maintenance-audit.md`, `src/legacy-public/README.md`.
- Active source and public copy: `src/data/profile.ts`, `src/pages/index.astro`, `src/pages/404.astro`, `src/layouts/BaseLayout.astro`, `src/styles/global.css`.
- Guard scripts and command/output text: every `scripts/check-*.mjs` file.
- CI, dependency, and package metadata: `package.json`, `.npmrc`, `.gitignore`, `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `.github/dependabot.yml`, `astro.config.mjs`, `tsconfig.json`.
- Archived maintained source/assets: `src/legacy-public/components/*.astro`, representative sections of `src/legacy-public/enhancements.js`, and public text in `src/legacy-public/og/jeremy-dawson-social.svg`.
- Binary/generated/dependency surfaces: `public/favicon.ico`, `src/legacy-public/og/jeremy-dawson-social.png`, `dist/`, `.astro/`, `node_modules/`, and `package-lock.json` were not manually prose-edited. Generated/dependency/cache directories were excluded from wording decisions; lockfile and binary assets were treated as metadata/artifacts rather than prose.

### Searches And Probes Run

- `rg --files -uu -g '!node_modules' -g '!dist' -g '!.git' -g '!.astro'`
- `rg -n <prompt-provided casual/profanity/excuse/temporary-personal-context terms> ...`
- `rg -n <automation/session/provenance terms> ...`
- `rg -n "TODO|FIXME|HACK|XXX|NOTE|BUG" ...`
- `rg -n "Jeremy|author|I |my |personal|private" README* docs src tests .github . ...`
- `rg -n "console\.|debugger|alert\(|throw new Error|console\.error|process\.exit|fail\(" src scripts astro.config.mjs ...`
- `rg -n "description|title|message|note|error|failed|Missing|must|should|Return|Page not found|Rewriting|temporary|private|public|legacy|guard|check" src scripts README.md ROADMAP.md AGENTS.md .github package.json ...`
- Manual reads of primary docs, active Astro source, guard scripts, workflows, legacy component markup, and relevant legacy animation comments.

### Candidate Wording Ledger

| Surface | Candidate | Decision | Rationale |
| --- | --- | --- | --- |
| `src/data/profile.ts` | Homepage placeholder used first-person downtime wording and a casual readiness note. | Fixed | The new copy keeps the temporary rewrite status truthful while removing unnecessary personal phrasing. |
| `src/pages/404.astro` | 404 message said the page was unavailable in a casual temporary way. | Fixed | The replacement is neutral error text with the same meaning. |
| `scripts/check-dist.mjs` | Generated-output guard asserted the old public-copy strings. | Fixed | Guard expectations must track the intended public copy. |
| `ROADMAP.md` | "medical school transition" matched a suggested personal-context probe. | Left unchanged | In this repo, that is a legitimate professional content direction for the personal-site rewrite, not private diary context. |
| `AGENTS.md` | Authorship policy names automation tools. | Left unchanged | This is an intentional repo policy, not stale session attribution. |
| `src/legacy-public/enhancements.js` | Comments refer to "the user" in scroll/viewport explanations. | Not an issue | These comments describe site visitors and interaction mechanics, not session notes. |
| `src/legacy-public/components/*` and social-card SVG text | Archived public-facing copy and labels. | Left unchanged | The archive is inactive, neutral, and retained for reference; changing it would be unnecessary churn. |
| Guard-script failure messages | Error/output strings. | Left unchanged | They are factual, specific, and useful for maintainers. |
| Existing maintenance audit text | Historical report statements about prior pass results. | Left unchanged with this appended update | The earlier sections remain historical evidence; this section records the subsequent professionalization edits. |

### Changes Made

- `src/data/profile.ts`: replaced first-person/chattier placeholder copy with neutral site-rewrite copy.
- `src/pages/404.astro`: replaced the casual 404 unavailable message with neutral error text.
- `scripts/check-dist.mjs`: updated generated-site assertions for the revised homepage and 404 copy.
- `ROADMAP.md`: recorded the completed professionalization pass in the existing maintenance checklist.
- `docs/maintenance-audit.md`: added this professionalization-pass report.

Rewrite patterns applied:

- Personal downtime phrasing -> neutral project/site status.
- Casual temporary error wording -> stable unavailable-page wording.
- Guard expectations -> exact generated output after the copy change.

### Intentionally Unchanged Items

- The site remains clearly described as a temporary placeholder; no marketing claims or production-readiness claims were added.
- No roadmap, contribution, license, security-policy, ADR, or governance artifact was added.
- Archived legacy source remains archived and inactive.
- Public profile/CV/resume decisions remain owner-controlled roadmap items.
- No dependencies, package metadata, workflow triggers, API surfaces, routes, or styling were changed.

### Verification

- `PATH=/home/jer/.cache/codex-node-v24.14.0-linux-x64/bin:$PATH npm run verify`: passed. Astro diagnostics reported 0 errors, 0 warnings, and 0 hints; production build generated 2 pages; all guard scripts passed.
- `PATH=/home/jer/.cache/codex-node-v24.14.0-linux-x64/bin:$PATH npm run check:base-path`: passed. The non-root `/preview/` build completed and the generated-site smoke check passed.
- `PATH=/home/jer/.cache/codex-node-v24.14.0-linux-x64/bin:$PATH node --check astro.config.mjs scripts/*.mjs`: passed with no syntax-check output.
- `git diff --check`: passed with no whitespace errors.
- `node` and `npm` are not available on the default shell `PATH` in this environment, so the known local Node 24 runtime path was used for verification.

### Risks And Assumptions

- The public copy change is intentionally small but visible on the placeholder homepage and 404 page.
- The 404 link still says "temporary homepage" because that remains accurate and matches the repo's current public posture.
- The external prompt-pack contract files were unavailable in the current environment; this is documented above rather than hidden or replaced with invented instructions.

## GitHub Pages Free URL Maintenance - 2026-07-08

### Scope And Instructions

- Objective: close out the repository maintenance for moving the public placeholder from the retired custom-domain path to the free GitHub Pages project URL.
- Current public URL: `https://jerdaw.github.io/cv/`.
- Current repository: `jerdaw/cv`.
- The requested `documentation-guidelines.md`, `testing-guidelines.md`, and `roadmap-process.md` files were not present in the repository during this pass.
- Public documentation continues to exclude private DNS, registrar, monitoring, credential, and environment-specific production details.

### Surfaces Inspected

- Repo instructions and public docs: `AGENTS.md`, `README.md`, `ROADMAP.md`, and this audit file.
- Runtime and verification config: `package.json`, `package-lock.json`, `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `.github/dependabot.yml`, `astro.config.mjs`, and `scripts/check-*.mjs`.
- GitHub state: default branch, local remote, open pull requests, branch list, Pages configuration, and latest workflow runs.
- Local generated artifacts: ignored `.astro/`, `dist/`, and `node_modules/` directories.

### Changes Made

- `AGENTS.md`: recorded the current public GitHub Pages URL.
- `ROADMAP.md`: replaced the retired custom-domain public URL with `https://jerdaw.github.io/cv/` and marked the free GitHub Pages project URL move as done.
- `package.json` and `package-lock.json`: updated Astro to the current Astro 7 patch release, superseding the stale open Dependabot patch PR.
- `docs/maintenance-audit.md`: added this focused maintenance entry.

### Cleanup

- Ignored generated output directories `.astro/` and `dist/` were removed after verification.
- `node_modules/` remains ignored and installed as the local dependency tree.
- No `.gitignore` change was needed; generated output, dependencies, env files, and local tool configuration directories are already ignored.

### Verification

- `npm run verify`: passed.
- `npm run check:base-path`: passed.
- Production-style `GITHUB_ACTIONS=true GITHUB_REPOSITORY=jerdaw/cv SITE_URL=https://jerdaw.github.io npm run build && npm run check:guards`: passed.
- `npm install astro@^7.0.7`: passed with `found 0 vulnerabilities`.
- GitHub `Check` workflow on `main`: passed.
- Manual GitHub Pages deploy on `main`: passed.
- Live URL `https://jerdaw.github.io/cv/`: returned `200 OK` and emitted `/cv/` canonical and asset paths.

### Follow-Ups

- Dependabot PR #16 should be closed and its branch deleted after this commit lands because the dependency update is superseded here.
- Optional account-side cleanup is intentionally not documented here because public docs exclude private DNS and registrar details.
