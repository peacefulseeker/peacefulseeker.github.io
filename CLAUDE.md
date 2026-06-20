# Project Instructions

## Project

A personal resume site — Alexey Vorobyov's resume rendered from markdown via Astro. The site ships three templates (classic, timeline, and a one-page variant), a PDF download via the browser print dialog, and full mobile responsiveness. The root (`/`) is a minimal landing page; the one-page resume lives at `/resume` and the full resume at `/resume/full`, with a one-click toggle switching between them (see ADR 0006, which supersedes the route placement in ADR 0005). Deployed to GitHub Pages via GitHub Actions.

## Stack

- **Runtime toolchain:** Node + pnpm versions pinned in `mise.toml`, managed via [mise](https://mise.jdx.dev)
- **Framework:** Astro (static output, content collections) + TypeScript strict mode
- **Formatting:** Prettier with prettier-plugin-astro (`pnpm format` / `pnpm format:check`)
- **Type checking:** `astro check` via `@astrojs/check` (no eslint at this scale)
- **CSS:** No framework — plain CSS; print styles handled at the template level
- **Deployment:** GitHub Actions → GitHub Pages (`peacefulseeker.github.io`)

## Layout

```text
src/
  pages/        # Astro page routes
  layouts/      # Resume layout components (one per template)
  components/   # Shared UI components
  styles/       # Global and shared CSS
  content/      # Markdown resume files + schema (src/content.config.ts)
  utils/        # Pure TypeScript utilities shared across components
public/         # Static assets served as-is
scripts/
  utils/        # Build-time helper scripts (TypeScript, run via tsx/node)
docs/
  adr/
```

## References

- ADR 0001 — Tech stack (Astro + TypeScript): [docs/adr/0001-tech-stack.md](docs/adr/0001-tech-stack.md)
- ADR 0002 — Content data model (markdown + YAML frontmatter): [docs/adr/0002-content-data-model.md](docs/adr/0002-content-data-model.md)
- ADR 0003 — PDF export strategy (browser print dialog): [docs/adr/0003-pdf-export-strategy.md](docs/adr/0003-pdf-export-strategy.md)
- ADR 0005 — One-page template + default route (route placement superseded by 0006): [docs/adr/0005-onepage-template-and-default-route.md](docs/adr/0005-onepage-template-and-default-route.md)
- ADR 0006 — Landing page + `/resume` namespace: [docs/adr/0006-landing-page-and-resume-namespace.md](docs/adr/0006-landing-page-and-resume-namespace.md)
- ADR 0007 — Template CSS isolation (`body.tpl-<name>` root class): [docs/adr/0007-template-css-isolation.md](docs/adr/0007-template-css-isolation.md)

## Commands

| Script                  | What it does                                          |
| ----------------------- | ----------------------------------------------------- |
| `pnpm dev`              | Start Astro dev server with HMR                       |
| `pnpm build`            | Produce fully static output in `dist/`                |
| `pnpm preview`          | Serve the `dist/` build locally                       |
| `pnpm typecheck`        | Run `astro check` (TypeScript + Astro template types) |
| `pnpm test`             | Run unit tests with Vitest                            |
| `pnpm test:integration` | Run Playwright integration tests                      |
| `pnpm format`           | Format all files with Prettier                        |
| `pnpm format:check`     | Check formatting without writing (CI-safe)            |

## Conventions

- **TypeScript strict mode** everywhere — no `any`, no implicit nulls.
- **Content lives in `src/content/`** per ADR 0002; each resume is one `.md` file with YAML frontmatter. The one-page variant is a separate, hand-trimmed `<name>.onepage.md` with `template.name: onepage` (see ADR 0005).
- **Build-time helpers go in `scripts/`** — anything that runs at build or CI time but is not an Astro component belongs there.
- **One template = one layout** in `src/layouts/`; switching templates is a one-line frontmatter change (see ADR 0001).
- **Print CSS is first-class** — every template must ship `@media print` styles alongside screen styles (see ADR 0003).
- **File placement follows the layout above strictly** — CSS goes in `src/styles/`, never co-located with pages or components.
