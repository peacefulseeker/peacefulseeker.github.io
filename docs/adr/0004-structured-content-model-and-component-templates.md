# 0004. Structured content model and component-based multi-template architecture

**Status:** Accepted
**Date:** 2026-06-13

## Context

ADR 0002 identified "resume content grows beyond what YAML frontmatter can comfortably express" as a revisit trigger. That threshold has been reached: the site needs to render rich visual elements (an employment timeline, per-role tech chips, credential links, sidebar cards for technologies/languages/hobbies, a profile photo, and LinkedIn/GitHub links) that cannot be expressed as prose without coupling rendering logic to markdown heading levels and fragile CSS selectors.

Additionally, a third template ("timeline") was requested that requires a two-column layout with structured sidebar content — data that has no natural representation in a markdown body.

## Decision

### 1. Structured frontmatter fields

Extend `resumeSchema` with typed optional fields:

- `profile` — `{ photo, location, email, links[] }` (links = `{ label, url }`)
- `skills`, `languages`, `hobbies` — `string[]` sidebar lists
- `experience[]` — `{ role, company, location, start, end, highlights[], tech[] }`
- `education[]` — `{ degree, institution, location, start, end, note, url }`
- `certifications[]` — `{ name, issuer, start, end, credentialId, url }`

All fields are optional for backward compatibility; existing classic resumes without structured data continue to validate and render.

The markdown body is narrowed to prose-only content (the summary). This is intentional: it keeps structured data in structured fields while keeping prose as prose.

### 2. Shared presentational components

Introduce `src/components/` components that are data-driven and template-agnostic:

- `Timeline.astro` — renders `experience[]` as a visual timeline (gradient line + dots + tech chips)
- `EducationList.astro` — renders `education[]`
- `Certifications.astro` — renders `certifications[]` with clickable credential links
- `SidebarCard.astro` — renders a titled list (skills, languages, hobbies)
- `ContactLinks.astro` — renders `profile.links[]` as external icon links
- `ProfilePhoto.astro` — renders the profile photo
- `PdfButton.astro` — print trigger button, rendered inside the paper (not floating outside it)

### 3. Template architecture

Each template is a full layout that composes the shared components differently. Templates accept the full `ResumeData` (minus `template`) as props:

- **`timeline`** — two-column (photo + sidebar | header + main). Introduced by this ADR. Closest to the original Pelican site visually.
- **`classic`** — single-column, continues to render `<Content />` (the summary prose) and ignores structured fields it does not need, remaining fully functional with or without the new frontmatter fields.

Switching templates remains a one-line frontmatter change (`template: timeline | classic`).

### 4. PDF button placement

The PDF button moved from a `position:fixed` overlay in `BaseLayout` to inside the paper (`PdfButton.astro` rendered in the header of each template). It is hidden via `@media print`. This was the original behavior from the Pelican site.

## Alternatives considered

**Keep experience as markdown prose, add sidebar-only structured fields.** Faster to implement, but credential links stay embedded in prose, the timeline CSS has to target `h3/h4/ul` hierarchy (fragile — breaks on heading-level changes), and per-role tech chips are impossible to render cleanly.

**Keep `<Content />` rendering everything (no structured experience).** Rules out the timeline template entirely, since the two-column sidebar requires knowing what content goes where at the component level, not just the CSS level.

## Consequences

- **Positive:** All lost content from the original Pelican site (photo, languages, tech stack, hobbies, LinkedIn, credential URLs) is restored as first-class data. Timeline and tech chips render robustly from data, not from CSS fragility. Both templates are interchangeable with a one-line change.
- **Negative:** The frontmatter of a resume file is now significantly larger; editing a full structured resume requires more YAML authoring effort than editing prose.
- **Neutral:** New content fields are optional — a minimal resume file can still be three YAML lines and a paragraph of markdown.

## Revisit if

- The site adds a non-engineer authoring audience and needs a structured editor — at that point the YAML frontmatter approach should be replaced with a headless CMS (ADR 0002 revisit trigger).
- The number of templates grows to the point where each needs dramatically different data shapes — consider a template-specific schema variant at that point.
