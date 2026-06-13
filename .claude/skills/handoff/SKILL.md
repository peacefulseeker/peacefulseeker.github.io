---
name: handoff
description: Write a session handoff note so the next session can resume from a cold start with no loss of context
---

Summarize the current session into a handoff note that a future session
(or another contributor) can use to resume work without re-reading the
conversation history.

## File Location & Naming

Write to `docs/handoffs/YYYY-MM-DD-<slug>.md` where:

- `YYYY-MM-DD` is today's date — run `date +%Y-%m-%d` to get it, do not guess
- `<slug>` is a lowercase, dash-separated 2–5 word summary of the session's
  main work (e.g. `initial-cleanup`, `template-redesign`, `deploy-fix`)

The `docs/handoffs/` directory will be created if it doesn't exist.
If the file already exists, append a numeric suffix: `-v2`, `-v3`, etc.

## Content Format

```markdown
# Handoff: <one-line session title>

**Date:** YYYY-MM-DD
**Branch:** <current branch>
**Last commit:** <short sha and subject>

## What's done

- <bullets describing what was actually completed this session>

## Key decisions

- <decision> — <why>

## Files touched

- <path> — <one-line note on what changed>

## What's next

- <the exact next task to pick up, specific enough to start cold>

## Open questions

- <anything left undecided that the next session needs to know>
```

## Instructions

1. Run `date +%Y-%m-%d` for today's date — do not infer it.
2. Run `git status --short`, `git log -5 --oneline`, and `git branch --show-current` to ground the note in actual repo state.
3. Generate the slug from the session's real focus. "fixes" or "updates" is not specific enough.
4. Only record what actually happened this session. Do NOT invent decisions, files, or open questions.
5. "Files touched" should match recent commits or `git diff --name-only` — verify, don't recall.
6. "What's next" must be concrete enough that a session with zero context could pick it up.
7. Write the file. Do NOT stage or commit it — leave that to the user.

## Scope Constraints

- Do NOT modify any file other than the new handoff
- Do NOT fabricate progress, decisions, or open questions
- Do NOT write a handoff if nothing material happened this session — say so instead
- Do NOT stage or commit the file
