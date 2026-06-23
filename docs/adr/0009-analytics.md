# 0009. Cookieless analytics via Umami

**Status:** Accepted
**Date:** 2026-06-23

## Context

The site shipped with no visitor analytics. The owner wants to answer a small,
concrete set of questions:

- How many visits did the site get over a given period?
- How many visitors clicked the **Download PDF** button?
- How many switched between the one-page (`/resume`) and full
  (`/resume/full`) versions?
- How many clicked outbound links (LinkedIn, GitHub, certification/education
  links)?

Hard constraints: **no cookies** in the visitor's browser, **anonymized data
only** (no PII), and therefore **no consent banner**. The script must be light
(static site on GitHub Pages, performance matters) and trivially embeddable.

The owner previously used **Umami Cloud** for an older version of the resume and
it satisfied these needs. A research pass (comparing Umami, Plausible,
Cloudflare Web Analytics, Fathom, Pirsch) confirmed Umami still meets every
requirement at $0 on its free Hobby tier, and that the only functionally
equal alternative (Plausible) has no free tier ($9/mo minimum) — no reason to
switch for a personal site.

## Decision

**Use Umami Cloud, reusing the existing website-id**
(`334171e2-2119-466d-a803-cc4468fed467`) and the hosted tracker at
`https://cloud.umami.is/script.js`.

- **Single source of truth** — the tracker URL, website-id, and the enable
  decision live in [src/utils/analytics.ts](../../src/utils/analytics.ts). The
  website-id is a public identifier (it ships in page source regardless), so
  committing it as a constant is fine; there is no secret.
- **One injector component** — [AnalyticsScript.astro](../../src/components/AnalyticsScript.astro)
  renders the `<script is:inline defer …>`. The site has no single shared
  layout (the landing page and the resume layout each own their `<head>`), so
  the component is rendered in both [index.astro](../../src/pages/index.astro)
  and [ResumeLayout.astro](../../src/layouts/ResumeLayout.astro) — mirroring the
  existing `FaviconLinks` pattern. This covers all three routes (`/`, `/resume`,
  `/resume/full`). `is:inline` keeps Astro from bundling/hoisting the
  third-party script.
- **Flag-controlled injection** — `analyticsEnabled()` decides whether the
  script renders, with this precedence:

  | `PUBLIC_UMAMI_ENABLED` | Behaviour                                               |
  | ---------------------- | ------------------------------------------------------- |
  | `"true"`               | always load (e.g. opt a local/dev server in)            |
  | `"false"`              | never load                                              |
  | unset                  | load only in production builds (`import.meta.env.PROD`) |

  This keeps local dev traffic out of the dashboard by default while leaving a
  one-env-var escape hatch to test the tracker (or instrument a dev server)
  without code changes. See `.env.example` for the variable name.

- **Event taxonomy** — Umami auto-binds click handlers to any element carrying a
  `data-umami-event` attribute, so no client JS is needed. Three event names:

  | Event            | Where                                   | Notes                                            |
  | ---------------- | --------------------------------------- | ------------------------------------------------ |
  | `pdf-download`   | PDF button                              | —                                                |
  | `version-toggle` | version toggle link                     | carries `data-umami-event-to` (the target label) |
  | `outbound-link`  | profile, education, certification links | carries `data-umami-event-label` (which link)    |

  Umami records the page URL with every event, so onepage-vs-full breakdowns
  come from filtering by URL — the version is not re-encoded on each event.

## Alternatives considered

- **Plausible** — functionally equal (cookieless, GDPR-clean, custom events,
  auto outbound links, ~2.5 KB). Rejected: no free tier ($9/mo minimum); no gain
  over Umami for a personal site.
- **Cloudflare Web Analytics** — free and cookieless, but no arbitrary
  custom-event / button-click tracking, so it fails the PDF/toggle requirement.
- **Fathom / Pirsch** — paid-only, no advantage over Plausible.
- **Hardcoded `import.meta.env.PROD`** (no flag) — rejected per the owner's
  request to be able to opt a local/dev server in later without code changes.

## Consequences

- **Positive:** Meets every requirement at $0; cookieless and anonymized, so no
  consent banner; ~2 KB script; one component, one config module. Disabled-state
  `data-umami-event` attributes are inert, harmless HTML.
- **Negative:** Reused website-id means data continuity assumes the same Umami
  property; if the property is ever rotated, update the constant in
  `analytics.ts`. Event attributes on inline links in `ResumeLayout` must be
  added per-spot (three places) since those links are not a shared component.
- **Neutral:** Pageview counting is automatic once the script loads; the event
  names above are the only custom instrumentation.

## Revisit if

- The free Hobby tier limits (events/month, retention) become binding — upgrade
  to Umami Pro or reconsider Plausible.
- More granular funnels are needed than event-name + URL filtering provides.
