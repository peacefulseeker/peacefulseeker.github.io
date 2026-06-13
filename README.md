# resume

Personal resume site — built with Astro, deployed to GitHub Pages.

Live: [peacefulseeker.github.io](https://peacefulseeker.github.io)

## Stack

- **Astro** — static site generator with content collections
- **TypeScript** — strict mode throughout
- **Plain CSS** — two interchangeable templates (`classic` / `minimal`)
- **GitHub Actions** — builds and deploys on push to `main`

## Local dev

Requires [mise](https://mise.jdx.dev) to manage Node and pnpm versions.

```sh
mise install       # pin Node + pnpm versions from mise.toml
pnpm install
pnpm dev           # http://localhost:4321
```

## Templates

Switch template by changing `template:` in the frontmatter of `src/content/resumes/alexey-vorobyov.md`:

```yaml
template: classic # or: minimal
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

Open the site in a browser and use the **Download PDF** button — it triggers the browser print dialog. Print to PDF from there.
