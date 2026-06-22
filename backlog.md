# Backlog

## Planned

- **Template switching via `?template=` query param** — allow switching between `classic` and `timeline` (and the planned one-pager) on the fly without rebuilding. Static multi-page approach: pre-render `/` (classic) and `/timeline`, client-side script reads the param and redirects/rewrites the URL so `/?template=timeline` and `/?template=classic` work as canonical share links. A button could complement the query param.

## Done

- **Unify one-page and full under a `theme` × `density` model (folded in the contact-model consolidation)** — done in [PR #13](https://github.com/peacefulseeker/peacefulseeker.github.io/pull/13). Replaced the single `template` axis with two orthogonal axes — `theme` (`classic` | `timeline`, frontmatter) × `density` (`onepage` | `full`, route). Both routes now render one `ResumeLayout` + one `resume.css`; density is expressed via `--r-*` CSS vars, so the toggle reads as "same document, more detail." Default theme `timeline`; `classic` is true single-column. Per-route `@page` modules (`page-onepage.css` 10mm / `page-full.css` 15mm) keep the one un-scopable rule split. Controls became an icon-only stack attached to the paper's top-right corner. **Subsumed the contact-model consolidation:** the unified header reads `profile.links` + `profile.location`; the legacy `contact[]`, `ResumeHeader`, and `contactHref` were deleted (fixes the classic-header gap). Old per-template layouts/components/styles removed. See ADR 0008 (theme × density), amending ADRs 0004/0005/0007.

## TODO

- introduce package namespaces to avoid loading imports relatively

- **Finish hardening the GitHub Actions workflows** — remaining least-privilege/security items on `ci.yml` and `deploy.yml`. (The `build`-job move into CI and the pnpm-store cache are **done** — see below.)

  > **Done**
  >
  > - [x] `build` moved into `ci.yml` so it runs on every PR — the required `build` check always reports, unblocking content/config-only PRs that previously stalled on a skipped path-filtered deploy build.
  > - [x] `deploy.yml` now triggers on `main` push (+ `workflow_dispatch`) only; PR trigger and `paths:` filters removed.
  > - [x] pnpm store cached (keyed on `pnpm-lock.yaml`) across all jobs in both workflows.
  >
  > **Remaining problem area**
  >
  > - **No Playwright browser cache** — `ci.yml` re-downloads Chromium on every run via `playwright install chromium --with-deps`.
  > - **Over-broad permissions** — `deploy.yml` sets `pages: write` + `id-token: write` at workflow scope; the `build` job inherits them needlessly.
  > - **Unpinned third-party action** — `jdx/mise-action@v4` is a mutable tag, not a commit SHA.
  > - **Credentials persisted & no job timeouts** — checkout leaves `GITHUB_TOKEN` in `.git/config` though nothing pushes; jobs have no `timeout-minutes` (default 6h can silently burn Actions minutes on a hung run).
  >
  > **Acceptance criteria**
  >
  > - [ ] Playwright Chromium binary is cached in `ci.yml` (keyed on the Playwright version); only system deps re-run on a cache hit.
  > - [ ] `pages: write` and `id-token: write` are scoped to the `deploy` job only; workflow default stays `contents: read`.
  > - [ ] `jdx/mise-action` is pinned to a full commit SHA with a trailing version comment.
  > - [ ] `actions/checkout` uses `persist-credentials: false` in both workflows.
  > - [ ] Every job sets a sensible `timeout-minutes` (≈15 for `quality`/`build`, ≈5 for `deploy`).
  > - [ ] All existing checks (`format:check`, `typecheck`, `test`, `test:integration`, `build`) and the Pages deploy still pass; the mise version pin and owner guard are preserved.

- consider GH projects instead of backlog.md https://github.com/peacefulseeker/peacefulseeker.github.io/projects
