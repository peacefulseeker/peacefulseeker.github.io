# Backlog

## Planned

- **Template switching via `?template=` query param** — allow switching between `classic` and `timeline` (and the planned one-pager) on the fly without rebuilding. Static multi-page approach: pre-render `/` (classic) and `/timeline`, client-side script reads the param and redirects/rewrites the URL so `/?template=timeline` and `/?template=classic` work as canonical share links. A button could complement the query param.

- **One-page fill gauge (`pnpm onepage:fit`)** — a CLI helper for the CV author that renders the one-pager to A4 under print CSS (Playwright → PDF, reusing the page-count check) and reports how full the page is, e.g. `page used: 86% · fits 1 page`, warning when content spills to a second page. Must measure under print conditions, not the screen DOM — on-screen font/padding/gaps differ from print, so a screen-side measurement misreports true fit. Lives in `scripts/utils/` per the build-helper convention. Optionally wire into CI as a gate that fails the build if the one-pager exceeds a single page (ties into ADR 0005's "add an automated single-page assertion").

- **Revamp content** — improve the resume content based on inspirational examples.

- **Favicon** — add a proper favicon to replace the default.

## TODO

- **CI quality gate (pre-merge)** — block merging on a failing PR check: run `pnpm typecheck`, `pnpm test`, `pnpm test:integration`, and `pnpm format:check` on pull requests so regressions can't land on `main`.

- **Trim integration-test devices** — pare the Playwright project/viewport matrix down to the essential set (drop redundant device profiles) to cut integration-test runtime in CI and locally.
