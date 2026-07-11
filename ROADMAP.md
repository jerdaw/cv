# Site Roadmap

_Last updated: 2026-07-10_

## Current State

- **Phase:** Temporary public placeholder
- **Live URL:** `https://jerdaw.github.io/cv/`
- **Public surface:** Minimal homepage and matching 404 page; no biography, projects, profile links, direct contact route, analytics, social image, or downloadable CV/resume
- **Deployment:** Manual-only GitHub Pages workflow
- **Detailed publication contract:** [`docs/public-site-rewrite-decision-packet.md`](docs/public-site-rewrite-decision-packet.md)

Status key:

- `blocked` — requires owner input, approval, or completion of an earlier batch
- `pending` — ready to implement when it reaches the front of the queue
- `approved` — first-release decision is settled; implementation or sign-off may remain
- `optional` — non-blocking later scope
- `done` — completed and verified

## Next Milestone: Minimum Public Professional Profile

The information architecture and recommended P-03 through P-12 defaults are approved. Final, verbatim P-01/P-02 copy is the only current owner input needed to begin implementation; release still requires Batches A–C, owner review, and separate deployment authorization.

### Required Owner Inputs

- `blocked` **P-01 positioning:** Supply and approve one neutral current-focus sentence.
- `blocked` **P-02 biography:** Supply and approve an 80–120 word professional biography containing only facts intended for unrestricted public indexing.

Response template:

```text
P-01 current-focus sentence (one sentence):
P-02 biography (80–120 words):
```

Do not include private contact details, account-recovery information, unpublished application/admission details, home address, personal phone number, or credentials. Optional content does not block the minimum release.

## Guarded Implementation Path

### Batch A: Content Contract

- `blocked` Add typed profile data containing only approved P-01/P-02 copy.
- `blocked` Add content-readiness checks for required copy, placeholder destinations, contact schemes, and optional-section activation.
- `blocked` Keep omitted optional surfaces absent from active data rather than hiding populated content in CSS.

**Unblocks when:** P-01 and P-02 are supplied and approved verbatim.

### Batch B: Static Accessible Page

- `blocked` Implement the approved single-page hierarchy with existing Astro, TypeScript, and vanilla CSS.
- `blocked` Preserve semantic headings, keyboard focus visibility, responsive behavior, reduced-motion support, canonical metadata, and non-root base paths.
- `blocked` Keep the approved local system-font stack and add no runtime framework or dependency.

**Unblocks when:** Batch A passes its content-readiness checks.

### Batch C: Validation and Sign-Off

- `blocked` Run repository verification, base-path checks, dependency audit, negative public-boundary tests, and localhost review.
- `blocked` Complete desktop and mobile-width browser review of copy, layout, destinations, and social metadata.
- `blocked` Obtain separate explicit authorization before manual deployment.

**Unblocks when:** Batch B is complete and all enabled destinations are current.

## Approved First-Release Defaults

- `approved` **P-03 through P-07:** Omit selected work, chronology, profile links, CV/resume, and direct contact from the minimum release.
- `done` **P-08 fonts/privacy:** Local system-font stack implemented; third-party font requests are guarded against regression.
- `approved` **P-09 through P-11:** Use no analytics, timeline animation, or social preview image in the minimum release.
- `approved` **P-12 deployment:** Keep deployment manual-only with a separate authorization gate.

Generated-output and public-boundary guards enforce the current link/contact, script, social-image, CV/resume, and archived-asset posture. They support these defaults but do not replace factual, privacy, browser, or destination review.

See the [decision matrix](docs/public-site-rewrite-decision-packet.md#decision-matrix) for the exact default and later approval requirement for each P-item.

## Optional Later Surfaces

- `optional` Revisit any omitted P-03 through P-07 or P-10/P-11 surface after its content, destination, privacy, and presentation requirements are approved.
- `optional` Consider P-09 analytics only after a separate provider, collection, retention, consent, and disclosure proposal.
- `optional` Consider routine P-12 deployment only after the site is ready for regular public updates.

Each optional surface requires its own current content and privacy approval. None should delay the minimum release.

## Operating Constraints

- Keep GitHub Pages deployment manual-only until routine public updates are explicitly authorized.
- Do not republish archived timeline, email, project, career, or social-card content without fresh approval.
- Do not add a public CV/resume, profile destination, contact route, analytics, animation, or social image by default.
- Keep Node 24, TypeScript 6, Astro 7, the YAML override, and dependency/runtime policies aligned with `AGENTS.md`.
- Keep `npm run verify`, base-path validation, public-boundary guards, and post-merge CI passing.
- Keep private runbooks, credentials, monitoring configuration, and environment-specific production details out of public documentation.

## Completed Foundation

- `done` Moved the placeholder to the free GitHub Pages project URL and corrected repository homepage metadata.
- `done` Reduced active source and public data to the rendered placeholder; archived prior full-site code and assets outside production output.
- `done` Added push/PR CI, manual-deploy verification, non-root base-path checks, and generated-output, public-boundary, repository, tracked-file, runtime, CSS, font-privacy, and approved-omission guards.
- `done` Removed third-party font requests and retained visible focus and reduced-motion accessibility contracts.
- `done` Configured Dependabot and npm registry scoping; upgraded to Astro 7, Node 24-backed Actions/types, and TypeScript 6 while retaining the required YAML override.
- `done` Resolved known dependency audit findings without forced major upgrades and established the current runtime/dependency maintenance policy.
- `done` Professionalized active public copy and documented the minimum-publication decision contract.
