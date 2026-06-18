# 0005. One-page template as the default route, full resume at `/full`

**Status:** Superseded in part by [ADR 0006](0006-landing-page-and-resume-namespace.md)
**Date:** 2026-06-15

> **Note (2026-06-17):** The _route placement_ in this ADR is superseded by ADR 0006:
> the one-page resume now lives at `/resume` and the full resume at `/resume/full`,
> with the root (`/`) serving a landing page. The two-content-file model, the
> `OnepageLayout`, and the variant-aware `getResumeEntry` described below remain in force.

## Context

The site already ships two multi-page templates (classic, timeline) rendered from a single markdown file (ADR 0002). A recruiter-facing one-page resume has different constraints: it must fit a single printed page, which means prioritizing recent/impactful experience and dropping secondary sections (hobbies, older roles, long summary, most certifications). The same content file cannot satisfy both "complete history" and "fits one page" — tightening CSS alone does not solve a content-volume problem.

The site also has only ever had one route (`/`) rendering one resume. Offering both a full and a one-page view requires a way to select between two resumes and a way for a reader to switch between them in one click and print whichever they are viewing.

## Decision

**Two curated content files, two routes, with the one-pager as the default.**

- **Content:** a second file, `<name>.onepage.md`, holds hand-trimmed content (`template.name: onepage`). The full resume keeps its own file. The full/onepage split is keyed off `template.name` — the rendering contract — not a filename convention.
- **Routes:** `/` renders the one-page resume (the default landing view); `/full` renders the classic/timeline resume. A `VersionToggle` link sits beside the PDF button in each header and points at the other view; both it and the PDF button are hidden in print. Links are built from `import.meta.env.BASE_URL` so they survive a `base` change.
- **Layout:** a dedicated `OnepageLayout` (two-column, experience-dominant, narrow sidebar) plus a compact `ExperienceList` component. The vertically expensive `Timeline` (dotted rail, large inter-item gaps) is not reused; tech is an inline line rather than chips, and the sidebar markup is rendered inline in the layout rather than reusing the scoped `SidebarCard`/`EducationList`/`Certifications` components, so one consistent heading style applies without fighting Astro scoped-style specificity.

## Alternatives considered

**Per-template frontmatter trim controls (one content file).** Add optional fields (`maxExperience`, `maxHighlights`, `hide: [...]`) the one-page template reads to trim the shared file at render time. Keeps a single source of truth. Rejected because trimming for one page is editorial, not mechanical — which two highlights best represent a role is a judgement call a cap can't make — and the rules would leak template concerns into the content schema.

**CSS density only (one content file).** No schema or content changes; rely on tight typography and trust the author to keep the markdown short. Rejected because the content is shared across all templates: shortening it for the one-pager also strips the full templates, defeating their purpose.

**Single page, client-side toggle.** Render both versions into one document and flip visibility with a class + script, hiding the inactive copy in print. Rejected: it pulls JavaScript into an otherwise static, island-free site (ADR 0001) and complicates print, for no gain over two static routes that each print cleanly.

**Keep full at `/`, one-pager at `/onepage`.** The reverse default. Rejected per the owner's call: the one-pager is the better first impression for the primary (recruiter) audience, so it earns the root URL; the full history is one click away at `/full`.

## Consequences

- **Positive:** Each view prints cleanly on its own route with no JS; the one-pager is content-budgeted for a single page; the full and one-page contents evolve independently; the toggle degrades gracefully (it only renders when the other variant exists).
- **Negative:** Two content files to keep in sync when shared facts change (titles, dates, links); a third set of `@media print` styles to maintain (ADR 0003's per-template print cost now spans three templates).
- **Neutral:** `getResumeEntry` is now variant-aware (`"full" | "onepage"`) rather than "first entry wins"; adding a genuinely new person's resume would still need the slug-based lookup foreseen in ADR 0002.

## Revisit if

- A third+ resume (different person/slug) is added — the variant selector should become a slug-based lookup rather than a `template.name` discriminator.
- The two content files drift painfully — reconsider a single-source model with editorial trim metadata.
- One-page fidelity regresses across content edits — add an automated single-page assertion to the Playwright integration suite.
