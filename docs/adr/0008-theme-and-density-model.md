# 0008. Theme × density model: one layout, one stylesheet, one contact model

**Status:** Accepted
**Date:** 2026-06-22
**Supersedes:** the single "template" axis introduced in [ADR 0004](0004-structured-content-model-and-component-templates.md) and the per-template CSS isolation of [ADR 0007](0007-template-css-isolation.md); amends [ADR 0005](0005-onepage-template-and-default-route.md)

> **Amendment (2026-07-07, ADR 0010):** `classic` is **no longer single-column.**
> It now shares the two-column body grid with `timeline` (and honours
> `sidebarPosition`), so its structure is identical across full and onepage
> densities. This was required so `classic` fits a single page at onepage density
> — as a single column its sidebar stacked full-width below experience and
> overflowed to two pages (126%), defeating the one-page PDF once `?theme=`
> made any theme printable at `/resume`. `classic`'s minimal identity now comes
> purely from what it drops (no profile photo, no timeline rail, no accent
> tick-bars, near-black accent instead of blue), not from a different column
> structure. The description below of `classic` as "single column" is superseded.

## Context

The site rendered three "templates" (`classic`, `timeline`, `onepage`) as a
single axis. `/resume` rendered `OnepageLayout`; `/resume/full` rendered
`ClassicLayout` or `TimelineLayout` chosen from `full_template.name`. Two
problems followed from collapsing two independent concerns onto one axis:

- **The version toggle was a brand jump.** `/resume` and `/resume/full` were
  different layouts with different headers, sidebars and accent treatment, so
  switching read as "different document" rather than "same document, more
  detail" — the opposite of what a one-page/full toggle should feel like.
- **Two contact models, one of them broken.** The schema carried both a legacy
  `contact: [{ value }]` field (rendered by `ResumeHeader` via the `contactHref`
  util, used only by `ClassicLayout`/`BaseLayout`) and the structured
  `profile.links[]` + `profile.location` (used by the timeline/onepage headers).
  The resume only populated `profile`, so the classic/full header showed no
  LinkedIn/GitHub/location at all.

The real design intent is two **orthogonal** axes: _what it looks like_ and
_how much it shows_. One layout can serve both routes if those axes are
separated.

## Decision

**Replace the single template axis with two orthogonal axes — `theme` and
`density` — rendered by one layout and one stylesheet, on one contact model.**

- **`theme`** (`classic` | `timeline`) — the visual identity, chosen in
  frontmatter (`theme: { name, sidebarPosition }`, renamed from `full_template`).
  `timeline` shows the dotted experience rail, accent tick-bar headings, the
  profile photo and a two-column body; `classic` is the same markup styled plain
  and strict — single column, plain underlined headings, no rail, no photo.
  `onepage` is **no longer a theme**.
- **`density`** (`onepage` | `full`) — the content/spacing budget, chosen by
  route, not frontmatter. `/resume` renders `density="onepage"`, `/resume/full`
  renders `density="full"`. Density drives (a) content volume — already handled
  by `getResumeEntry("onepage")`'s `onepage_include`/`onepage_highlights_num`
  trim (ADR 0005) plus a few layout-level "full only" choices (hobbies, the
  heaviest education/cert detail, full markdown summary vs `summary_short`) —
  and (b) spacing/type, expressed entirely as `--r-*` CSS custom properties.
- **One layout.** `ResumeLayout.astro` replaces `ClassicLayout`,
  `TimelineLayout` and `OnepageLayout`. Both routes pass it the same prop shape
  (`ResumeLayoutProps`) with `theme` + `density` scalars; nothing structural
  branches on the theme, only on density.
- **One stylesheet.** `resume.css` replaces `classic.css`/`timeline.css`/
  `onepage.css`. Rules are class-scoped under `body.theme-<name>` and
  `body.density-<density>`; the density tokens are CSS variables so the full
  view is literally the same rules with a larger scale. The timeline rail is a
  pure-CSS `::before` decoration on the shared `ExperienceList` markup, so the
  markup stays theme-agnostic and `Timeline.astro` is gone.
- **One contact model.** The unified header reads `profile.links` +
  `profile.location`. The legacy `contact[]` field, `ResumeHeader`, `BaseLayout`
  and the `contactHref` util (and their tests) are deleted — this fixes the
  missing-links bug as a side effect of consolidation.
- **`@page` stays per-route.** It is the one rule that cannot be class-scoped
  (it targets the page box, not an element), and the two densities need
  different margins (onepage 10mm to fit a page, full 15mm). Each route imports
  a one-line file (`page-onepage.css` / `page-full.css`) so its module graph
  carries exactly one `@page` — the same lesson ADR 0007 learned the hard way,
  now the only thing that needs route-level handling.

## Alternatives considered

**Keep three templates, just restyle them to look alike.** Rejected: it keeps
the brand-jump risk (three stylesheets drifting) and does not address that
"onepage" was conflating density with identity. The toggle would still cross
two independent layouts.

**Make `density` a frontmatter field too.** Rejected: density is inherent to the
route (`/resume` is the one-pager, `/resume/full` is the full view), not an
authoring choice. Routing already encodes it; duplicating it in frontmatter
invites the two disagreeing.

**Keep `Timeline.astro` and branch the layout on theme.** Rejected: a CSS-only
rail keeps the experience markup identical across themes and densities, so the
layout has exactly one experience renderer. Themes stay (almost) pure CSS.

## Consequences

- **Positive:** The toggle reads as "same document, more detail." One layout and
  one stylesheet to maintain instead of three of each; adding a theme is a CSS
  block, not a layout. Single contact model, single source of truth, and the
  classic-header bug is fixed. The `pnpm onepage:fit` gate still guards the
  one-page budget (ADR 0005).
- **Negative:** `classic` now surfaces skills/languages it previously dropped
  (it shares the body markup, just single-column) — intended, but a content
  change for that theme. The onepage budget is tighter now that the timeline
  identity (photo, rail) is shared into it; print uses tighter density tokens to
  hold a single page. A theme that needs structurally different markup (not just
  different CSS) would not fit this model without reintroducing a branch.
- **Neutral:** `assertFullTemplate` and the `Record<FullTemplate, Layout>` map
  are gone — there is no per-template layout to pick. `resolveOtherVersion` and
  the variant-aware `getResumeEntry` are unchanged.

## Revisit if

- A future theme needs different markup, not just different CSS — reintroduce a
  per-theme layout branch (or a second layout) rather than overloading
  `ResumeLayout`.
- A third density is wanted (e.g. a print-only ultra-dense variant) — it is
  another `body.density-*` token set plus a route, not a new layout.
- The single `resume.css` grows unwieldy across themes — consider splitting per
  theme again, but keep them scoped under `body.theme-*` (never bare selectors)
  so they can co-load without the ADR 0007 collision.
