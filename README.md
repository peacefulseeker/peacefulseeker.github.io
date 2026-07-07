# peacefulseeker.github.io

Personal website — built with Astro, deployed to GitHub Pages. The root is a
small landing page; the resume lives under `/resume`. The site is structured to
grow beyond the resume (e.g. a blog) over time.

Live: [peacefulseeker.github.io](https://peacefulseeker.github.io)

## Pages

| Route          | What it serves                              |
| -------------- | ------------------------------------------- |
| `/`            | Landing page (welcome + link to the CV)     |
| `/resume`      | One-page resume (the default resume view)   |
| `/resume/full` | Full resume (`classic` or `timeline` theme) |

A one-click toggle switches between the one-page and full resume views. See
[ADR 0006](docs/adr/0006-landing-page-and-resume-namespace.md) for the routing
rationale. Append `?theme=classic` or `?theme=timeline` to any resume URL to view
(and share) it under a specific theme without a rebuild — see
[ADR 0010](docs/adr/0010-theme-switching-via-query-param.md).

## Stack

- **Astro** — static site generator with content collections
- **TypeScript** — strict mode throughout
- **Plain CSS** — one `resume.css` scoped by theme + density class, print-first
- **GitHub Actions** — CI runs the test suite; deploy to GitHub Pages is gated on
  CI passing on `main`

## Local dev

Requires [mise](https://mise.jdx.dev) to manage Node and pnpm versions.

```sh
mise install       # pin Node + pnpm versions from mise.toml
pnpm install
pnpm dev           # http://localhost:4321
```

## Themes & density

A resume is rendered along two orthogonal axes ([ADR 0008](docs/adr/0008-theme-and-density-model.md)):

- **theme** — the visual identity: `timeline` (dotted experience rail, accent
  tick-bar headings, profile photo) or `classic` (the same two-column layout
  stripped to a minimal, near-monochrome look — no photo, no rail). Set the
  default in frontmatter; override per-visit with `?theme=` (see above).
- **density** — the content/spacing budget, chosen by route: `/resume` is the
  one-page view, `/resume/full` the full view. One markdown file drives both;
  the one-pager is trimmed via per-entry `onepage_include` /
  `onepage_highlights_num` flags plus `summary_short`, not a separate file.

Set the default theme via `theme.name` in the frontmatter of
`src/content/resumes/alexey-vorobyov.md`:

```yaml
theme:
  name: timeline # or: classic
  sidebarPosition: right # left | right
```

Both themes must fit a single page at one-page density — the `onepage-fit`
integration test enforces this per theme, so a theme that overflows blocks the
deploy.

## Commands

| Command                 | Action                           |
| ----------------------- | -------------------------------- |
| `pnpm dev`              | Start dev server (HMR)           |
| `pnpm build`            | Build static output to `dist/`   |
| `pnpm preview`          | Preview the built site locally   |
| `pnpm typecheck`        | Type-check with `astro check`    |
| `pnpm test`             | Run unit tests (Vitest)          |
| `pnpm test:integration` | Run Playwright integration tests |
| `pnpm format`           | Format with Prettier             |

## PDF export

Open a resume page in a browser and use the **Download PDF** button — it triggers
the browser print dialog. Print to PDF from there.

## Architecture decisions

Key technical decisions are recorded as ADRs in [`docs/adr/`](docs/adr/):

- [ADR 0001 — Use Astro as the static site generator](docs/adr/0001-tech-stack.md)
- [ADR 0002 — Markdown files with YAML frontmatter as the single source of truth](docs/adr/0002-content-data-model.md)
- [ADR 0003 — Use the browser's native print dialog for PDF export](docs/adr/0003-pdf-export-strategy.md)
- [ADR 0004 — Structured content model and component-based multi-template architecture](docs/adr/0004-structured-content-model-and-component-templates.md) _(template architecture superseded by 0008)_
- [ADR 0005 — One-page template + default route (route placement superseded by 0006, density model by 0008)](docs/adr/0005-onepage-template-and-default-route.md)
- [ADR 0006 — Landing page + `/resume` namespace](docs/adr/0006-landing-page-and-resume-namespace.md)
- [ADR 0007 — Template CSS isolation via `body.tpl-<name>`](docs/adr/0007-template-css-isolation.md) _(superseded by 0008)_
- [ADR 0008 — Theme × density model: one layout, one stylesheet](docs/adr/0008-theme-and-density-model.md)
- [ADR 0009 — Cookieless analytics via Umami](docs/adr/0009-analytics.md)
- [ADR 0010 — Theme switching via `?theme=` query param](docs/adr/0010-theme-switching-via-query-param.md)

## Roadmap

Planned and shipped work is tracked on the [Resume roadmap project board](https://github.com/users/peacefulseeker/projects/5).
