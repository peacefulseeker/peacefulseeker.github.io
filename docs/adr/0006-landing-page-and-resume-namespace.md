# 0006. Root becomes a landing page; resume namespaced under `/resume`

**Status:** Accepted
**Date:** 2026-06-17
**Supersedes:** [ADR 0005](0005-onepage-template-and-default-route.md) (route decision only)

## Context

ADR 0005 put the one-page resume at the root (`/`) and the full resume at `/full`. That decision optimised the root URL for the recruiter audience when the site was resume-only.

Two facts changed the calculus:

- **An older resume already lives at `https://peacefulseeker.github.io/resume`** (a separate `peacefulseeker/resume` GitHub Pages _project_ repo) and that URL has been shared externally — on LinkedIn and elsewhere — so it must keep resolving to a resume.
- **The site is growing beyond a single resume.** The root should become a small personal landing page (welcome now, blog later), not a resume.

GitHub Pages serves a _user_ site (`peacefulseeker.github.io`) at the root, but a _project_ repo named `resume` shadows the `/resume/` subpath for as long as that project has Pages enabled. Once the project's Pages is unpublished, the user site owns `/resume/` and can serve it from its own build output (a `resume/` directory).

## Decision

**The root is a landing page; the resume moves under a `/resume` namespace.**

- **Routes:** `/` renders a minimal landing page (`src/pages/index.astro`, styled by `src/styles/landing.css`, both importing `base.css` per ADR 0003's print-first convention). `/resume` renders the one-page resume; `/resume/full` renders the classic/timeline resume. The `VersionToggle` cross-links and the landing CTA are all built from `import.meta.env.BASE_URL`, so they survive a `base` change.
- **Page layout:** the two resume pages are unchanged in content and layout — they simply moved from `src/pages/{index,full}.astro` to `src/pages/resume/{index,full}.astro`, with the cross-version links repointed to `/resume/` and `/resume/full`.
- **Landing content:** name and role are read from the resume entry (`getResumeEntry`) so the landing stays in sync with the single source of truth rather than hardcoding identity.
- **Old project repo:** Pages on `peacefulseeker/resume` is unpublished by the owner so the user site can serve `/resume/`. The repo is kept (not deleted) — disabling Pages is reversible.

What ADR 0005 still governs: the two-curated-content-files model (`<name>.md` + `<name>.onepage.md` keyed on `template.name`), the `OnepageLayout`, and the variant-aware `getResumeEntry`. Only the _route placement_ is superseded here.

## Alternatives considered

**Redirect the old `/resume` project page to the root.** Replace the old repo's content with a meta-refresh/JS redirect to `/`. Rejected by the owner: the goal is to keep a resume living at `/resume` permanently and free the root for other content, not to funnel everything to the root.

**Keep the resume at `/` and make the old `/resume` repo redirect there.** Same shape as above; rejected for the same reason — the root is wanted for a landing/blog, so the resume should not own it.

**Serve `/resume` from the root repo while the old project repo keeps Pages on.** Impossible while both exist: the `resume` project repo shadows `/resume/` on the user site. Unpublishing the project's Pages is the prerequisite, not an optional extra.

## Consequences

- **Positive:** The externally-shared `/resume` URL keeps resolving to a resume; the root is freed for a landing page / future blog; the resume content and layouts are otherwise untouched.
- **Negative:** A propagation/caching window exists after the old project's Pages is unpublished before `/resume/` flips to the new build; external links to the bare `/full` route (if any were shared) now 404 and would need a redirect.
- **Neutral:** A fourth set of screen/print styles (`landing.css`) joins the three resume templates; the root route no longer prints a resume (it was never meant to).

## Revisit if

- The root grows into a blog — introduce a content collection for posts and a real index, per the ADR 0002 content model.
- Bare `/full` links turn out to have been shared — add a redirect stub from `/full` to `/resume/full`.
- A third+ person's resume is added — the slug-based lookup foreseen in ADR 0002/0005 still applies, now under `/resume`.
