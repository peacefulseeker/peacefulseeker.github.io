# Backlog

## Planned

- **Template switching via `?template=` query param** — allow switching between `classic` and `timeline` (and the planned one-pager) on the fly without rebuilding. Static multi-page approach: pre-render `/` (classic) and `/timeline`, client-side script reads the param and redirects/rewrites the URL so `/?template=timeline` and `/?template=classic` work as canonical share links. A button could complement the query param.

- **Unify one-page and full under a `theme` × `density` model (folds in the contact-model consolidation)** — the one-pager (`/resume`) and the full view (`/resume/full`) currently render different layouts (`OnepageLayout` vs `ClassicLayout`/`TimelineLayout`), so the toggle is a brand/style jump rather than a density change. Replace the single `template` axis (`classic`/`timeline`/`onepage`) with **two orthogonal axes**:
  - **`theme`** (`classic` | `timeline`) — chosen in frontmatter; the visual identity (dotted rail, accent tick-bars, profile photo, heading style). `onepage` stops being a template.
  - **`density`** (`onepage` | `full`) — chosen by route; content volume (already handled by `getResumeEntry`'s `onepage_include`/`onepage_highlights_num` trim) **plus** spacing/font-size/line-height (new, via CSS custom properties).

  Both routes then render **one `ResumeLayout` + one stylesheet (`resume.css`)**, so the toggle reads as "same document, more detail." Adopt the current one-page look as the base (it ≈ the timeline theme; add the missing profile photo); the `classic` theme is the same shared markup styled plain/strict (no rail, no accent bars, plain headings). The experience rail becomes a CSS `::before` decoration on shared `ExperienceList` markup (so `Timeline.astro` is deleted).

  **This subsumes "Consolidate the two contact models (and fix the classic-header gap)":** the unified header reads `profile.links` + `profile.location` (the model the other layouts already use), which fixes the missing-links bug on the classic/full header. The legacy `contact[]` field, `ResumeHeader`, and `contactHref` are then deleted, not migrated — single contact model, DRY (see ADR 0004).

  **Scope:** rename `full_template` → `theme` (drop `onepage` from the enum, drop `contact`) in the schema + content file; build `ResumeLayout` + `resume.css` (density CSS vars + `body.theme-<name> density-<density>` classes; keep `@page` per-route — 10mm on `/resume`, 15mm on `/resume/full` — the one rule that can't be class-scoped, per ADR 0007); delete `ClassicLayout`/`TimelineLayout`/`OnepageLayout`/`BaseLayout`/`ResumeHeader`/`Timeline`/`contactHref` + the three template stylesheets; retarget the schema/header/template-switching/onepage specs and drop `assertFullTemplate`; keep the `pnpm onepage:fit` gate green (top regression risk — the photo eats vertical budget). New ADR 0008 (theme × density, supersedes the template model); amend ADR 0005 (onepage is a density now), 0007 (`tpl-*` co-load isolation replaced by theme classes in one stylesheet), and 0004 (`contact[]` removed). **Default theme: `timeline`** (set `theme: timeline` in the content file during Phase 1). **`classic` is true single-column** — shared `main`+`aside` markup, but the `classic` theme collapses the grid to one column so the `aside` sections (skills, languages, education, certs) stack full-width below experience (vs. `timeline`'s two-column sidebar). Note this surfaces skills/languages in classic, which today's `ClassicLayout` silently omits — consistent with "same document"; tune section order via CSS `order`.

## TODO

- introduce package namespaces to avoid loading imports relatively

- **Harden & speed up the GitHub Actions workflows** — add dependency/browser caching and tighten security on `ci.yml` and `deploy.yml`. See the ticket below.

  > **Problem area**
  > Both workflows (`.github/workflows/ci.yml`, `deploy.yml`) are functional but leave performance and least-privilege on the table:
  >
  > - **No pnpm store cache** — every run does a cold `pnpm install`; `jdx/mise-action` caches the toolchain but not the dependency store.
  > - **No Playwright browser cache** — `ci.yml` re-downloads Chromium on every run via `playwright install chromium --with-deps`.
  > - **Over-broad permissions** — `deploy.yml` sets `pages: write` + `id-token: write` at workflow scope, so the `build` job (which runs untrusted PR code) inherits them needlessly.
  > - **Unpinned third-party action** — `jdx/mise-action@v4` is a mutable tag, not a commit SHA.
  > - **Credentials persisted & no job timeouts** — checkout leaves `GITHUB_TOKEN` in `.git/config` though nothing pushes; jobs have no `timeout-minutes` (default 6h can silently burn Actions minutes on a hung run).
  >
  > **Acceptance criteria**
  >
  > - [ ] pnpm store is cached (keyed on `pnpm-lock.yaml`) in both `ci.yml` and `deploy.yml`; warm runs skip re-download of dependencies.
  > - [ ] Playwright Chromium binary is cached in `ci.yml` (keyed on the Playwright version); only system deps re-run on a cache hit.
  > - [ ] `pages: write` and `id-token: write` are scoped to the `deploy` job only; workflow default stays `contents: read`.
  > - [ ] `jdx/mise-action` is pinned to a full commit SHA with a trailing version comment.
  > - [ ] `actions/checkout` uses `persist-credentials: false` in both workflows.
  > - [ ] Every job sets a sensible `timeout-minutes` (≈15 for `quality`/`build`, ≈5 for `deploy`).
  > - [ ] All existing CI checks (`format:check`, `typecheck`, `test`, `test:integration`) and the Pages deploy still pass; the mise version pin and owner guard are preserved.

- **Consolidate the two contact models (and fix the classic-header gap)** — _folded into the "Unify one-page and full under a `theme` × `density` model" item under Planned._ The unified header reads `profile.links` + `profile.location`, fixing the missing-links bug on the classic/full header, and the legacy `contact[]` / `ResumeHeader` / `contactHref` path is deleted. See ADR 0004 (`ContactLinks` renders `profile.links[]`).

- consider GH projects instead of backlog.md https://github.com/peacefulseeker/peacefulseeker.github.io/projects
