import { getCollection, render } from "astro:content";

import type { ResumeData } from "@content";
import { applyOnepageVariant } from "@utils/onepageVariant";

type Variant = "full" | "onepage";

/**
 * Returns the single resume entry, sorted by id for deterministic CI output.
 *
 * Single-author assumption: this repo hosts one person's resume. If a second
 * .md file is ever added, this function will silently serve whichever sorts
 * first alphabetically. Add a slug-based filter at that point.
 */
async function selectEntry() {
  const entries = await getCollection("resumes");
  return entries.sort((a, b) => a.id.localeCompare(b.id))[0];
}

/**
 * Resolves the resume entry to display and returns its data together with the
 * rendered Content component.
 *
 * `variant` selects which view to render: "full" returns all experience with
 * every highlight; "onepage" drops entries marked onepage_include: false and
 * truncates each remaining entry's highlights to onepage_highlights_num (served at
 * /resume; see ADR 0006). Highlights are authored most-impactful-first so the
 * truncation reads well without a separate condensed copy.
 *
 * Throws loudly when no file exists so the build fails with a clear message
 * rather than rendering a blank page.
 */
export async function getResumeEntry(variant: Variant = "full") {
  const entry = await selectEntry();

  if (!entry) {
    throw new Error(
      "No resume found in src/content/resumes/. Add a .md file to build the site.",
    );
  }

  const { Content } = await render(entry);
  const data: ResumeData =
    variant === "onepage" ? applyOnepageVariant(entry.data) : entry.data;

  return { Content, ...data };
}

/**
 * Whether a resume variant exists. Used to decide whether to show the
 * cross-link toggle between the full and one-page views.
 *
 * With a single-file content model both variants are always present together,
 * so the `variant` argument is intentionally unused — the answer is the same
 * for "full" and "onepage". The parameter is kept so call sites remain
 * self-documenting ("does the full version exist?").
 */
export async function resumeVariantExists(_variant: Variant): Promise<boolean> {
  return (await selectEntry()) !== undefined;
}
