---
name: migrate-sessions
description: Move recent Claude Code session files for this project from one config directory to another (e.g. ~/.claude → ~/.claude-zartis) after a wrong-account mishap
---

Move recent session JSONL files for the current project from a source Claude
Code config directory to a destination one. Used when sessions were
accidentally recorded under the wrong account.

## Default parameters

- Source config dir: `~/.claude`
- Destination config dir: `$CLAUDE_CONFIG_DIR` (must be set; abort if empty)
- Recency window: last 24 hours (configurable per invocation)
- Project: the current working directory

Confirm these with the user before doing anything destructive. The user may
override any of them.

## Path encoding

Claude Code encodes the project path into the subdirectory name by replacing
`/` with `-` and prefixing with `-`. Example: `/Users/john/code/zartis-resume`
→ `-Users-john-code-zartis-resume`.

Do NOT compute this string from `pwd` and hope for the best. Instead:

1. List `<source>/projects/` and find the directory whose name, when
   decoded (replace `-` with `/`, strip leading `-`), matches the current
   working directory.
2. If no match: list candidates and ask the user to pick.

## Instructions

1. Verify `$CLAUDE_CONFIG_DIR` is set and points to a real directory. If
   empty, abort and tell the user to set it before retrying.
2. Resolve source (`~/.claude`) and destination (`$CLAUDE_CONFIG_DIR`) to
   absolute paths. If they are the same path, abort — nothing to migrate.
3. Locate the encoded project directory under `<source>/projects/` matching
   the current cwd (see "Path encoding" above).
4. List `.jsonl` files in that directory modified within the recency window
   (default 24h). Use `find <dir> -name '*.jsonl' -mtime -1` or equivalent.
5. Show the user the full list (filename, size, last-modified) and ask for
   confirmation before moving anything.
6. Ensure the destination project directory exists:
   `mkdir -p <dest>/projects/<same-encoded-name>/`.
7. For each file to migrate: if a same-named file already exists at the
   destination, SKIP it and report the conflict — do not overwrite.
8. Move with `mv` (atomic on the same filesystem). Do NOT use `cp` + `rm`.
9. After moving, list what was moved, what was skipped, and what remains
   in the source.

## Scope Constraints

- Do NOT touch `history.jsonl` (the global prompt index at the top of each
  config dir) — too risky for too little value.
- Do NOT touch `settings.json`, `settings.local.json`, `commands/`, or any
  other config files — only session JSONLs under `projects/`.
- Do NOT modify file contents — move only.
- Do NOT delete source files except via `mv` (which moves, not deletes).
- Do NOT proceed without explicit user confirmation of the file list.
- If source and destination are on different filesystems, warn the user
  before proceeding (`mv` falls back to copy-then-unlink, no longer atomic).
