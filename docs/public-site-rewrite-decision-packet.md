# Public Site Rewrite Decision Packet

**Status:** Ready for owner decisions; no public-content change authorized
**Prepared:** 2026-07-10
**Current live posture:** Temporary placeholder only

## Objective

Turn the broad full-site rewrite roadmap into a small, privacy-safe publication contract. This packet deliberately separates information architecture from personal copy: structure can be approved now, while every factual statement, destination, contact method, and downloadable file remains unpublished until it is verified by the owner.

## Baseline confirmed from the repository

- The active site renders only the placeholder homepage and matching 404 page.
- `src/data/profile.ts` contains no biography, career timeline, project list, contact route, or public-profile link.
- The prior full-site components and email enhancement are archived under `src/legacy-public/` and are not emitted by the production build.
- Archived content is historical implementation material, not current consent to republish any fact or contact detail.
- No CV or resume is currently emitted from `public/`.
- The active layout loads Montserrat and Open Sans from Google Fonts; no analytics or tracking script is present.
- Deployment is manual-only and remains outside this packet.

## Recommended minimum-publication bundle

The safest useful first release is a single-page professional profile with progressive disclosure:

1. Name and an owner-supplied current-focus sentence.
2. An owner-supplied 80–120 word biography.
3. Up to three selected-work entries, but only when each entry already has a current public destination and an approved two-sentence summary.
4. A small verified-links footer, but only for destinations reviewed immediately before publication.
5. No detailed chronology, downloadable CV, direct email address, analytics, animation, or claims about application/admission status in the first release.

This keeps the page useful while limiting staleness, identity correlation, spam exposure, and accidental disclosure. Additional sections can be approved independently later.

## Decision matrix

| ID | Surface | Recommended default | Owner decision needed before implementation |
| --- | --- | --- | --- |
| P-01 | Positioning | Neutral current-focus sentence; no unverified title, affiliation, admission status, or availability claim | Approve final sentence verbatim |
| P-02 | Biography | 80–120 words, professional and present-tense, limited to facts intended for unrestricted public indexing | Approve final paragraph verbatim |
| P-03 | Selected work | Maximum three entries; omit until the destination and summary are both current | Name each approved entry, URL, summary, and display order |
| P-04 | Experience/education timeline | Omit from the first release | Approve exact organizations, roles/programs, date precision, location precision, and summaries before adding |
| P-05 | Public profile links | Omit by default | Confirm account control, current destination, preferred label, and permission to publish each link |
| P-06 | CV/resume | Omit until the master document is final, intentionally public, and scrubbed for unnecessary contact/location data | Approve the exact reviewed file and public filename |
| P-07 | Contact | No direct email in the first release; archived email code is not publication approval | Choose no contact, a verified profile route, or a deliberately public email alias |
| P-08 | Fonts/privacy | Use a local system-font stack in the rewrite to remove third-party font requests | Approve the system-font direction or explicitly retain Google Fonts |
| P-09 | Analytics | None | A later analytics proposal must specify provider, data collected, retention, cookie/consent behavior, and public privacy disclosure |
| P-10 | Timeline animation | Omit from the first release; preserve reduced-motion support if restored later | Approve only after static content and mobile layout are accepted |
| P-11 | Social preview image | Use no personal photo by default; create only from approved public text/graphics | Approve the image contents and alt text |
| P-12 | Deployment | Keep manual-only | Separate explicit deployment authorization after local and browser validation |

## Fast owner response

The information architecture can be approved independently of the copy with this line:

> Approve the minimum-publication site bundle in `docs/public-site-rewrite-decision-packet.md`, including the recommended defaults for P-03 through P-12. P-01 and P-02 remain blocked on final copy.

Then provide only the two required copy fields:

```text
P-01 current-focus sentence (one sentence):
P-02 biography (80–120 words):
```

Optional entries can be supplied later without blocking the first release:

```text
P-03 selected work: none | title / public URL / two-sentence summary / order
P-05 verified links: none | label / public URL / order
P-07 contact: none | verified profile route | deliberately public alias
```

Do not include private notes, credentials, account-recovery information, unpublished application/admission details, home address, personal phone number, or a private email address in the response.

## Implementation plan after approval

### Batch A: content contract

1. Add typed profile data only for verbatim approved fields.
2. Add a content-readiness guard that rejects placeholder URLs, empty required copy, unexpected contact schemes, and unapproved section activation.
3. Keep every optional section disabled by data rather than hiding populated private content in CSS.

### Batch B: static accessible page

1. Implement the approved single-page hierarchy using existing Astro, TypeScript, and vanilla CSS.
2. Preserve the current base-path/canonical metadata contract, keyboard focus visibility, semantic headings, responsive layout, and reduced-motion behavior.
3. Use the approved font direction without adding a framework or runtime dependency.

### Batch C: validation and manual sign-off

1. Run `npm run verify`, `npm run check:base-path`, dependency audit, syntax checks, and negative public-boundary tests.
2. Build a localhost-only review packet at the Pages base path.
3. Require owner browser review of copy, destinations, responsive layout, and social metadata.
4. Keep deploy, publication, domain, monitoring, and analytics work separately authorization-gated.

## Publication checklist

- [ ] P-01 positioning approved verbatim.
- [ ] P-02 biography approved verbatim.
- [ ] Every enabled optional item has an approval record and was re-verified immediately before sign-off.
- [ ] Generated output contains no archived timeline, archived email enhancement, CV/resume, placeholder URL, private path, or environment-specific note.
- [ ] Local automated checks pass with recorded output.
- [ ] Owner completes desktop and mobile-width browser review.
- [ ] All external destinations are opened and confirmed current by the owner.
- [ ] Deployment receives a separate explicit authorization.

Until these checks are complete, the current placeholder remains the correct public site.
