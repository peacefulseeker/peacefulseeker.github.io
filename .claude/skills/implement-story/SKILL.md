---
name: implement-story
description: Implement a story using the project's 5-phase workflow — research, plan, build, review with the right specialist agents, commit
---

Implement a story end-to-end using the project's workflow. Invoke the
agents that fit the story's scope, not all of them by default.

## Phase 1 — Preparation & Research

1. State the feature or task to implement.
2. Read every ADR that touches the task's scope. List them by number.
3. Check `git status` and recent `git log` — confirm a clean working tree
   on the right branch. If dirty, STOP and report.
4. **Invoke the `researcher` agent** for any non-trivial external API
   question the task raises (e.g. current Astro content-collections API,
   Zod schema patterns, a CSS feature). Skip this step only when the
   task is implementation of fully-decided behaviour with no API
   uncertainty. Save findings to the working context — do NOT write them
   to disk unless they're worth keeping for future sessions.

## Phase 2 — Planning

1. Draft an implementation plan: files to create/change, the order, and
   what each change does. One paragraph per file.
2. Identify which reviewers Phase 4 will invoke (see Phase 4 routing).
3. Note any ADR-level surprises uncovered in Phase 1. If the story
   actually requires a new architectural decision, STOP and tell the
   user — a new ADR is its own task, not a sub-step of a story.
4. **Show the plan to the user. Wait for explicit approval before
   touching any file.** Use plan mode if available.

## Phase 3 — Implementation

1. Implement only what the plan covers. No drive-by refactors, no
   "while I'm here" changes — those are separate commits or separate
   stories.
2. Add minimum-viable error handling for the failure modes the story
   names. Don't invent failure modes the story doesn't care about.
3. Write tests for all new logic. Unit tests (`src/**/*.test.ts` via
   Vitest) cover pure utilities and functions. Integration tests
   (`tests/*.spec.ts` via Playwright) cover rendered page behaviour
   when a story touches a page or template. Both suites must pass
   before moving to Phase 4 — this is not optional.
4. Run the full local verification sequence and confirm everything
   passes before proceeding:
   ```
   pnpm typecheck && pnpm build && pnpm test
   ```
   If integration tests exist for the story's surface, also run
   `pnpm test:integration`.

## Phase 4 — Quality Gates (route by what changed)

Invoke reviewers based on the surfaces the change touches. Multiple may apply.

| Change touches                                                       | Invoke                     |
| -------------------------------------------------------------------- | -------------------------- |
| `*.astro`, `*.ts`, build config, project structure                   | **tech-lead**              |
| Content schema, frontmatter validation, build-pipeline failure modes | **frontmatter-qa**         |
| Templates, layouts, styles, print CSS, rendered HTML                 | **print-and-a11y-auditor** |

For each invoked reviewer:

1. Run it against the diff.
2. Resolve blocker and should-fix findings before continuing.
3. Note nice-to-have findings in the commit body or a follow-up task.

If a reviewer says NEEDS DISCUSSION, STOP. Do not proceed unilaterally.

## Phase 5 — Completion

1. Stage only the files the plan covered: `git add <specific paths>`.
   Do NOT `git add .` or `git add -A`.
2. Invoke the `commit` skill to draft and create the commit.
   Conventional Commits format applies.
3. Do NOT push. Pushing is the user's decision.
4. Output a summary: story ID, files changed, reviewers invoked,
   notable findings addressed, anything deferred.

## Hard Rules

- Do NOT skip phases. If a phase doesn't apply, explicitly note "Phase X
  skipped because <reason>" in the summary — don't silently omit it.
- Do NOT invent agents. Only `researcher`, `tech-lead`, `frontmatter-qa`,
  and `print-and-a11y-auditor` exist in this project.
- Do NOT propose ADR changes mid-story. If a story exposes an ADR gap,
  STOP and tell the user — ADR work is its own session.
- Do NOT push to remote.
- Do NOT exceed the story's stated scope. If you discover related work,
  surface it as a follow-up, do not absorb it.
