# Backlog

## Planned

- **Template switching via `?template=` query param** — allow switching between `classic` and `timeline` (and the planned one-pager) on the fly without rebuilding. Static multi-page approach: pre-render `/` (classic) and `/timeline`, client-side script reads the param and redirects/rewrites the URL so `/?template=timeline` and `/?template=classic` work as canonical share links. A button could complement the query param.

## TODO

- **Harden & speed up the GitHub Actions workflows** — add dependency/browser caching and tighten security on `ci.yml` and `deploy.yml`. See the ticket below.

  > **Problem area**
  > Both workflows (`.github/workflows/ci.yml`, `deploy.yml`) are functional but leave performance and least-privilege on the table:
  > - **No pnpm store cache** — every run does a cold `pnpm install`; `jdx/mise-action` caches the toolchain but not the dependency store.
  > - **No Playwright browser cache** — `ci.yml` re-downloads Chromium on every run via `playwright install chromium --with-deps`.
  > - **Over-broad permissions** — `deploy.yml` sets `pages: write` + `id-token: write` at workflow scope, so the `build` job (which runs untrusted PR code) inherits them needlessly.
  > - **Unpinned third-party action** — `jdx/mise-action@v4` is a mutable tag, not a commit SHA.
  > - **Credentials persisted & no job timeouts** — checkout leaves `GITHUB_TOKEN` in `.git/config` though nothing pushes; jobs have no `timeout-minutes` (default 6h can silently burn Actions minutes on a hung run).
  >
  > **Acceptance criteria**
  > - [ ] pnpm store is cached (keyed on `pnpm-lock.yaml`) in both `ci.yml` and `deploy.yml`; warm runs skip re-download of dependencies.
  > - [ ] Playwright Chromium binary is cached in `ci.yml` (keyed on the Playwright version); only system deps re-run on a cache hit.
  > - [ ] `pages: write` and `id-token: write` are scoped to the `deploy` job only; workflow default stays `contents: read`.
  > - [ ] `jdx/mise-action` is pinned to a full commit SHA with a trailing version comment.
  > - [ ] `actions/checkout` uses `persist-credentials: false` in both workflows.
  > - [ ] Every job sets a sensible `timeout-minutes` (≈15 for `quality`/`build`, ≈5 for `deploy`).
  > - [ ] All existing CI checks (`format:check`, `typecheck`, `test`, `test:integration`) and the Pages deploy still pass; the mise version pin and owner guard are preserved.

- **Consolidate the two contact models (and fix the classic-header gap)** — the schema carries both a legacy `contact: [{ value }]` field (rendered by `ResumeHeader` via `contactHref`, used by `ClassicLayout`/`BaseLayout`) and the newer `profile.links[]` + `profile.location` (rendered by Onepage/Timeline headers and `ContactLinks`). The current resume only populates `profile`, but `ClassicLayout` reads only `contact` and never `profile.links` — so the full/classic resume header shows **no LinkedIn/GitHub/location**, only name + role + buttons. Preferred fix: migrate `ClassicLayout` to `profile.links` like the other layouts, then delete `contact` from the schema, `ResumeHeader`, the `contactHref` util, and their tests — single contact model, DRY, fixes the missing-links bug. See ADR 0004 (`ContactLinks` renders `profile.links[]`).
