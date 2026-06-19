# Backlog

## Planned

- **Template switching via `?template=` query param** — allow switching between `classic` and `timeline` (and the planned one-pager) on the fly without rebuilding. Static multi-page approach: pre-render `/` (classic) and `/timeline`, client-side script reads the param and redirects/rewrites the URL so `/?template=timeline` and `/?template=classic` work as canonical share links. A button could complement the query param.

- **One-page fill gauge (`pnpm onepage:fit`)** — a CLI helper for the CV author that renders the one-pager to A4 under print CSS (Playwright → PDF, reusing the page-count check) and reports how full the page is, e.g. `page used: 86% · fits 1 page`, warning when content spills to a second page. Must measure under print conditions, not the screen DOM — on-screen font/padding/gaps differ from print, so a screen-side measurement misreports true fit. Lives in `scripts/utils/` per the build-helper convention. Optionally wire into CI as a gate that fails the build if the one-pager exceeds a single page (ties into ADR 0005's "add an automated single-page assertion").

## TODO

- **Consolidate the two contact models (and fix the classic-header gap)** — the schema carries both a legacy `contact: [{ value }]` field (rendered by `ResumeHeader` via `contactHref`, used by `ClassicLayout`/`BaseLayout`) and the newer `profile.links[]` + `profile.location` (rendered by Onepage/Timeline headers and `ContactLinks`). The current resume only populates `profile`, but `ClassicLayout` reads only `contact` and never `profile.links` — so the full/classic resume header shows **no LinkedIn/GitHub/location**, only name + role + buttons. Preferred fix: migrate `ClassicLayout` to `profile.links` like the other layouts, then delete `contact` from the schema, `ResumeHeader`, the `contactHref` util, and their tests — single contact model, DRY, fixes the missing-links bug. See ADR 0004 (`ContactLinks` renders `profile.links[]`).
