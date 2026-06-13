---
name: feedback-chrome-tab-cleanup
description: "Always close chrome-devtools tabs immediately after use, not at end of session"
metadata:
  node_type: memory
  type: feedback
  originSessionId: abb37cc5-6cbb-45fc-96af-8767057201fe
---

Always call `close_page` on any tab opened via `mcp__chrome-devtools__new_page` as soon as the work on that tab is done — not at the end of the conversation.

**Why:** `close_page` fails if the target is the last open tab. Holding tabs open across turns means by the time cleanup happens, there may be no other page left, making the close impossible without killing the whole browser process.

**How to apply:** The moment screenshots/evaluations are done, call `close_page(pageId=N)` before responding to the user. Page 1 (about:blank) is typically always present as a baseline, so a tab opened with `new_page` can always be closed immediately after use.
