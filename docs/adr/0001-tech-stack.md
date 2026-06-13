# 0001. Use Astro as the static site generator

**Status:** Accepted
**Date:** 2026-05-29

## Context

The project is a markdown-driven resume site that must build to fully static output (no server endpoints, no runtime dependencies) and render cleanly on desktop, mobile, and print. The core content model is "one resume = one markdown file + one layout", which calls for a generator whose primitives are markdown content, YAML frontmatter, and HTML templates.

## Decision

Build the site with **Astro + TypeScript**, producing a fully static bundle.

## Alternatives considered

**Eleventy (11ty).** The closest JS-toolchain competitor — same Node ecosystem, mature, deliberately simple. Rejected because it lacks first-class typed frontmatter (Astro's content collections give schema-validated YAML with TS types) and has no built-in component model — the template-switching feature from the PRD would require more glue code, and frontmatter validation would have to be hand-rolled.

**Hugo.** Extremely fast and very mature. Rejected on toolchain fit: introduces Go to an otherwise JS/TS project, and Go templates are less ergonomic for the component-shaped layouts the two launch templates need than Astro's `.astro` components.

**Next.js.** A React-first framework optimized for dynamic, server-rendered apps. Static export works, but the default surface (server actions, API routes, middleware) is machinery this project will never use, and the React-per-page model is heavier than the markdown-first layout needed here.

**Vanilla static HTML/CSS (no generator).** Would require hand-rolling markdown→HTML, frontmatter parsing, template inheritance, and dev-server live-reload — duplicated work for no payoff at this scale, since Astro provides all of these as primitives.

## Consequences

- **Positive:** First-class markdown + content-collections support; typed frontmatter; static output deployable to any static host; single JS/TS toolchain.
- **Negative:** Astro learning curve — accepted as a known cost.
- **Neutral:** Locks the project into the Astro ecosystem and its release cadence; commits to Node-based tooling for local dev and CI.

## Revisit if

- Astro pivots away from static-first or its content-collections API regresses.
- The site needs interactive client-side behaviour (e.g. in-page editing, auth-gated views) that Astro's islands model handles awkwardly compared to a React-first framework.
- Frontmatter validation needs grow beyond what content collections express, such that the schema layer becomes a fight rather than a benefit.
