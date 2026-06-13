# 0002. Markdown files with YAML frontmatter as the single source of truth

**Status:** Accepted
**Date:** 2026-05-29

## Context

The resume site needs a content format that is easy to write in an IDE, diffable in git, and free of any runtime dependency or external service. Structured fields (name, role, contact, template) must coexist with prose body content.

## Decision

Each resume is a single markdown file with a YAML frontmatter block that holds structured fields (e.g. `name`, `role`, `contact`, `template`, `published`); the markdown body holds the human-readable resume content. This file is the only source of truth — no parallel database, CMS, or export pipeline.

## Alternatives considered

**JSON content files.** Machine-friendly but hostile to prose editing — every paragraph break becomes a quoted escape sequence, and rich formatting (bullets, emphasis) has to be reinvented in custom keys. Loses the lightweight readability that makes markdown work as a resume format in the first place.

**Headless CMS (e.g. Contentful, Sanity).** Introduces a runtime service, account management, and an API key the build depends on. Contradicts the project's static-only constraint (no user accounts, no persistent state outside git, no runtime API dependencies) and means content no longer lives in the repo.

**Small database (SQLite, JSON store).** Same objection as a CMS but worse: persistent state outside git contradicts the static-only constraint, and editing a database requires tooling instead of just editing a file.

## Consequences

- **Positive:** Content is fully diffable and PR-reviewable; contributors edit one file; no runtime secrets and no network access at request time; the author owns their content as plain text forever.
- **Negative:** Schema enforcement must happen at build time (frontmatter validation in code) rather than via a CMS UI; there's no rich WYSIWYG editing path for non-technical users — explicitly accepted, since they are out of scope.
- **Neutral:** Couples the project to whatever frontmatter parser the chosen build tool ships (Astro's content collections schema validation, in practice).

## Revisit if

- A non-engineer audience needs to author content (currently explicitly out of scope).
- Resume content grows beyond what YAML frontmatter can comfortably express (e.g. deeply nested structured data, localized variants).
- Multi-language or richly structured-data requirements (job-history graphs, machine-readable export to a standard schema) become first-class needs.
