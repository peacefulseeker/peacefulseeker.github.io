# 0007. Template CSS isolation via a `body.tpl-<name>` root class

**Status:** Superseded by [ADR 0008](0008-theme-and-density-model.md)
**Date:** 2026-06-20

> **Note (2026-06-22):** [ADR 0008](0008-theme-and-density-model.md) collapses the
> three template stylesheets into one `resume.css`, so there is no longer a
> co-load collision to isolate against: the `body.tpl-<name>` scheme is replaced
> by `body.theme-<name>` / `body.density-<density>` classes within a single
> stylesheet. **The core lesson stands and is still honoured:** bare element
> selectors collide, so template rules must be class-scoped; and `@page` cannot
> be class-scoped, so it lives in per-route files (`page-onepage.css` /
> `page-full.css`) — one `@page` per module graph.

## Context

`/resume/full` renders one of several full-route templates (today `classic` or
`timeline`), chosen at build time from the resume's `full_template.name`
frontmatter. The route previously tried to load **only** the selected
template's stylesheet by selecting the layout through a runtime ternary over
`await import("../../layouts/ClassicLayout.astro")` vs `TimelineLayout.astro`.

That never isolated the CSS. Astro collects a page's styles from its **static
module graph**, not from runtime execution. Both layout specifiers are literal
strings, so Vite pulls both layouts — and their `import "../styles/*.css"`
side effects — into the page graph regardless of which branch runs. The ternary
only decides what _renders_; it cannot prune what _bundles_. The build proved
it: `dist/resume/full/` shipped both `classic.css` and `timeline.css`, producing
two competing bare `body { … }` rules (Georgia/#f5f5f0 vs system-ui/#f3f4f6).
Whichever lost the cascade broke the layout.

The root cause was that `classic.css` styled **bare global element selectors**
(`body`, `main`, `h1`–`h4`, `p`, `a`, `ul`, `li`), and `base.css` shipped a
global `@media print` block over `body`/`main`/`h2`/`h3`/`li`/`main a`. Timeline
and onepage already namespaced their rules under unique classes (`.resume-*`,
`.section`, `.op-*`); only their `body` rule was global.

## Decision

**Each template scopes its entire stylesheet under a `body.tpl-<name>` root
class, and the full route loads layouts through a static map rather than a
dynamic import.**

- Every layout sets the class on `<body>`: `tpl-classic`, `tpl-timeline`,
  `tpl-onepage`.
- Every template stylesheet scopes its rules under that class
  (`body.tpl-classic`, `.tpl-classic h2`, …), including its `@media print` and
  `@media (max-width: …)` blocks. Collisions are then impossible no matter how
  many template stylesheets co-load on a page.
- `base.css` keeps **only** genuinely template-agnostic rules: the `*` reset and
  the default `@page` margin. The bare-selector print rules that `classic.css`
  relied on moved into `classic.css` under `.tpl-classic`, since they are
  classic-specific (classic renders bare `<main>`/`<h2>`/`<li>`).
- **`@page` is the one rule that cannot be class-scoped** — it targets the page
  box, not an element. A single rendered route can therefore honour only one
  `@page`. `classic` and `timeline` co-load on `/resume/full`, so they share the
  15mm default in `base.css` (timeline's former 14mm/12mm override was dropped).
  `onepage` is a separate route (`/resume`) and keeps its 10mm override for the
  one-page fit budget.
- `full.astro` selects the layout from a `Record<FullTemplate, Layout>` map,
  which makes adding a template to the schema a compile error until its layout
  is wired up. Both full-route layouts share a `FullLayoutProps` type so the
  page can spread one prop object into a runtime-chosen layout type-safely.

## Alternatives considered

**Astro scoped `<style>` blocks.** Astro auto-hashes scoped styles, which would
isolate them for free. Rejected: scoped styles do not reach `<slot />`-injected
markdown (the summary prose) or shared child components, so almost every rule
would need `:global()` — at which point scoping buys nothing. This is the
existing pain noted in `OnepageLayout` (ADR 0005) and visible in `onepage.css`'s
`.op-summary :global(p)`.

**Separate page files per template** (`full/classic.astro`, …). Each page is its
own module graph, so CSS would isolate naturally. Rejected: it breaks the
"template choice is one frontmatter field" contract (ADR 0001) and needs routing
logic to pick a file.

**Keep the dynamic import.** Rejected: it never isolated CSS (see Context) and
implied code-splitting that did not exist on a static, island-free site.

## Consequences

- **Positive:** The full route is genuinely template-agnostic — adding a fourth
  template cannot leak styles onto another. Both stylesheets co-loading is
  harmless (~1.5 KB of inert CSS). The route frontmatter shrank to wiring, with
  the testable logic (`assertFullTemplate`, `resolveOtherVersion`) extracted to
  `src/utils/resumeView.ts`.
- **Negative:** Every template rule must carry its `.tpl-<name>` prefix — a new
  unprefixed bare selector silently reintroduces the collision. A Playwright
  test guards the active route's `body` background against cross-template leak.
- **Neutral:** Timeline now prints at 15mm rather than 14mm/12mm; verified to
  still reflow cleanly. `@page` per-template differences are not possible on a
  shared route — accepted.

## Revisit if

- A future full-route template genuinely needs a different `@page` margin than
  its co-loaded siblings — it would need its own route (its own module graph),
  not a shared one.
- The `.tpl-<name>` prefixing proves error-prone across edits — reconsider
  generating scoped wrappers or a lint rule that rejects bare element selectors
  in template stylesheets.
