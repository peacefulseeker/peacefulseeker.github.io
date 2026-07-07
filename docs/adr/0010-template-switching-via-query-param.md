# 0010. Template switching via `?template=` query param

**Status:** Accepted
**Date:** 2026-07-07
**Amends:** [ADR 0008](0008-theme-and-density-model.md) — `classic` becomes two-column so it fits one page at onepage density

## Context

Users wanted a way to view the resume under a different visual theme (`classic` vs `timeline`)
without the site owner rebuilding and redeploying. The ask was for shareable URLs like
`/resume?template=classic` so a specific look can be linked directly.

A static site cannot serve different HTML per query param, so two approaches were on the table:

1. **Static multi-page** — pre-render `/resume/classic/`, `/resume/timeline/`, etc., and use a
   redirect script on `/resume` to forward `?template=…` to the right pre-rendered page.

2. **Client-side class swap** — serve the same HTML on every URL, and let a small inline script
   swap the `body.theme-*` class when it sees `?template=`.

Approach 2 is viable only because of ADR 0008's key design decision: themes are purely CSS
(`body.theme-classic` vs `body.theme-timeline`), with identical markup across both themes.
Swapping the class is the entirety of a theme change.

## Decision

**A synchronous inline script at the top of `<body>` reads `?template=`, validates it against
the known theme names, and replaces `body.theme-*` before first paint.**

- The script is the first element inside `<body>`, so it runs before the browser paints any
  content — no Flash of Unstyled Content (FOUC).
- `?template=` URLs are the canonical share links; the URL never changes.
- Invalid or absent values are silently ignored; the frontmatter default theme applies.
- No extra static pages, no redirects, no new components.

This iteration is URL-only. A toggle button UI is deferred to a future iteration.

### Every theme must fit one page at onepage density

Because `?template=` lets a visitor view **and print** `/resume` under any theme,
each theme must fit a single page at onepage density — otherwise the one-page PDF
loses its purpose for that theme. Two consequences follow:

- **`classic` became two-column** (this ADR amends ADR 0008). As a single column
  its sidebar stacked full-width and the one-pager overflowed to two pages (126%).
  Sharing the two-column grid with `timeline` brings it back to a single page
  (100%). `classic` keeps its minimal identity by what it drops (no photo, no
  rail, no tick-bars, near-black accent), not by a different column structure.
- **The onepage-fit CI gate iterates over every theme.** `tests/onepage-fit.spec.ts`
  loops `THEME_NAMES`, rendering `/resume?template=<theme>` and asserting a single
  A4 page each. Since deploy is gated on CI success, a theme that overflows blocks
  the deploy. This is the automated single-page assertion of ADR 0005, now
  per-theme.

### Styling tests are theme-agnostic

Tests that assert visual output (background colour, link colour, body classes)
must not hardcode a single theme's values, since `?template=` and the frontmatter
default can each make any theme the active one. They either parametrize over
`THEME_NAMES` with a per-theme expectation map, or assert an invariant (e.g.
"print link colour equals its on-screen colour") rather than a literal value.

## Alternatives considered

**Static multi-page with redirects.** Rejected for this iteration: it multiplies the page
count (two themes × two densities = four pages per route), requires maintaining parallel
content, and gains nothing that the class-swap approach does not already provide — since
themes share identical markup (ADR 0008).

**CSS custom property override.** A `data-theme` attribute on `<html>`, with CSS overriding
the theme tokens. Rejected: more indirection than directly swapping the class, and the
`body.theme-*` selectors already exist as the canonical hook.

## Consequences

- **Positive:** Single-file content model is preserved. No routing changes. The entire feature
  is one 8-line inline script. Shareable theme URLs work out of the box.
- **Negative:** JavaScript must be enabled for the override to apply; without JS, the
  frontmatter theme renders (acceptable — the page is still fully functional).
- **Neutral:** Adding a third theme does not require touching this script beyond adding its
  name to the `THEMES` array (the CSS already uses `body.theme-*` selectors).

## Revisit if

- A toggle button UI is wanted — add a `TemplateToggle` component to `.resume-controls`
  and extend the inline script to update its `href` on `DOMContentLoaded`.
- A theme requires structurally different markup — at that point the class-swap approach
  breaks down and a static multi-page approach becomes necessary.
