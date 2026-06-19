import type { ResumeData } from "./resumeSchema";

/**
 * Adapts full-resume data for the one-page view.
 *
 * Two per-entry frontmatter controls drive the trim (see ADR 0005, 2026-06-18
 * amendment):
 * - `onepage_include: false` drops the entry from the one-pager entirely.
 * - `onepage_highlights_num: <n>` keeps only the first `n` highlights. Bullets
 *   are authored most-impactful-first, so truncation reads well without a
 *   separate condensed copy.
 *
 * Returns a new object; the input is never mutated.
 */
export function applyOnepageVariant(data: ResumeData): ResumeData {
  return {
    ...data,
    experience: data.experience
      .filter((e) => e.onepage_include !== false)
      .map((e) => ({
        ...e,
        highlights:
          e.onepage_highlights_num != null
            ? e.highlights.slice(0, e.onepage_highlights_num)
            : e.highlights,
      })),
  };
}
