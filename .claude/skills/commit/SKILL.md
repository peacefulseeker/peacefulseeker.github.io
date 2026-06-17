---
name: commit
description: Inspect staged changes, draft a Conventional Commits message, and create the commit after confirmation
---

Draft a commit message for the currently staged changes and create the commit
once approved.

## Output Format

A Conventional Commits message:

```
<type>(<scope>): <subject>

<body — optional, wrapped at 72 chars, explains what and why>

<footer — optional, e.g. story refs or breaking-change notes>
```

Where:

- **type** is one of: feat, fix, docs, chore, refactor, test, build, ci, perf, style, revert
- **scope** is inferred from the changed file paths (e.g. content, layout, build, docs, deps, config). Omit if unclear or cross-cutting.
- **subject** is imperative mood, lowercase, no trailing period, ≤ 72 chars
- **body** explains _what_ and _why_, not _how_. Skip for trivial changes.
- **footer** is optional — use for breaking-change notes or notable references

## Instructions

1. Run `git status --short` to confirm something is staged. If nothing is staged, stop and tell the user to stage explicitly with `git add <paths>`. Do NOT run `git add` yourself.
2. Run `git diff --cached` to read the full staged changes.
3. If the user explicitly asked for a single commit (e.g. "single commit", "one commit", "don't split", "commit all as one"), skip this step entirely. Otherwise, if the staged changes span unrelated concerns (e.g. a docs fix mixed with a feature change), STOP, explain the split you would suggest, and do not commit.
4. Run `pnpm format:check` (or the project's equivalent lint/format check). If it fails, run `pnpm format` to fix, then report which files were reformatted. These formatting changes should be staged alongside the feature changes (or as a separate commit if the user prefers clean separation). This prevents formatting drift from becoming a separate churn commit later.
5. Run `pnpm typecheck` as a quick pre-commit sanity check. If it fails, STOP and report the errors to the user — do not commit until the user decides how to proceed. Do NOT run `pnpm test` or `pnpm test:integration` — the CI quality gate runs the full test suite on every PR, so there is no need to duplicate it locally.
6. Draft the message per the format above. Reference actual file names and identifiers where it sharpens the message.
7. Show the proposed message to the user and ask for confirmation. Do NOT commit before confirmation.
8. On confirmation, commit. For a subject-only commit use `git commit -m "<subject>"`. For a commit with a body, write the full message to a temp file (e.g. `.git/COMMIT_DRAFT`) and use `git commit -F .git/COMMIT_DRAFT`, then delete the temp file. This avoids shell-escaping bugs on multi-line bodies.
9. After committing, run `git log -1 --stat` to show the result.

## Scope Constraints

- Do NOT run `git add` — staging is the user's responsibility
- Do NOT run `git push` — pushing is a separate decision
- Do NOT `git commit --amend` unless the user explicitly asks
- Do NOT invent story references or fabricate context that isn't in the diff
- Do NOT add a `Co-authored-by` trailer unless the user has configured one
