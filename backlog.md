# Backlog

## Planned

- **Template switching via `?template=` query param** — allow switching between `classic` and `timeline` (and the planned one-pager) on the fly without rebuilding. Static multi-page approach: pre-render `/` (classic) and `/timeline`, client-side script reads the param and redirects/rewrites the URL so `/?template=timeline` and `/?template=classic` work as canonical share links. A button could complement the query param.

- **One-page fill gauge (`pnpm onepage:fit`)** — a CLI helper for the CV author that renders the one-pager to A4 under print CSS (Playwright → PDF, reusing the page-count check) and reports how full the page is, e.g. `page used: 86% · fits 1 page`, warning when content spills to a second page. Must measure under print conditions, not the screen DOM — on-screen font/padding/gaps differ from print, so a screen-side measurement misreports true fit. Lives in `scripts/utils/` per the build-helper convention. Optionally wire into CI as a gate that fails the build if the one-pager exceeds a single page (ties into ADR 0005's "add an automated single-page assertion").

- **Revamp content** — improve the resume content based on inspirational examples.

## TODO

- **Shareable .yml resume** — create a shareable .yml resume so there's no content duplication between full and onepage template and the content can be maintained in one place. The .yml file would be parsed and rendered into both templates, with template-specific adjustments as needed (e.g. onepage may need more concise descriptions). This would eliminate the risk of content drift between the two versions and simplify maintenance. The .yml format is human-friendly and can be easily edited without needing to touch HTML/JSX.
