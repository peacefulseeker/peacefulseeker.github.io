# peacefulseeker.github.io

Personal website — built with Astro, deployed to GitHub Pages. The root is a
small landing page; the resume lives under `/resume`. The site is structured to
grow beyond the resume (e.g. a blog) over time.

Live: [peacefulseeker.github.io](https://peacefulseeker.github.io)

## Pages

| Route          | What it serves                                 |
| -------------- | ---------------------------------------------- |
| `/`            | Landing page (welcome + link to the CV)        |
| `/resume`      | One-page resume (the default resume view)      |
| `/resume/full` | Full resume (`classic` or `timeline` template) |

A one-click toggle switches between the one-page and full resume views. See
[ADR 0006](docs/adr/0006-landing-page-and-resume-namespace.md) for the routing
rationale.

## Stack

- **Astro** — static site generator with content collections
- **TypeScript** — strict mode throughout
- **Plain CSS** — per-template stylesheets in `src/styles/`, print-first
- **GitHub Actions** — builds and deploys on push to `main`

## Local dev

Requires [mise](https://mise.jdx.dev) to manage Node and pnpm versions.

```sh
mise install       # pin Node + pnpm versions from mise.toml
pnpm install
pnpm dev           # http://localhost:4321
```

## Resume templates

The full resume ships two interchangeable templates: `classic` (single-column)
and `timeline` (two-column with sidebar). The one-page resume is a separate,
hand-trimmed variant (`alexey-vorobyov.onepage.md`).

Switch the full-resume template by changing `template.name` in the frontmatter of
`src/content/resumes/alexey-vorobyov.md`:

```yaml
template:
  name: classic # or: timeline
```

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
- [ADR 0004 — Structured content model and component-based multi-template architecture](docs/adr/0004-structured-content-model-and-component-templates.md)
- [ADR 0005 — One-page template + default route (route placement superseded by 0006)](docs/adr/0005-onepage-template-and-default-route.md)
- [ADR 0006 — Landing page + `/resume` namespace](docs/adr/0006-landing-page-and-resume-namespace.md)

## Backlog

Planned work is tracked in [backlog.md](backlog.md).
