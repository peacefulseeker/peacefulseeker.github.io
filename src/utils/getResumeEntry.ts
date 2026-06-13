import { getCollection, render } from "astro:content";
import type { ResumeData } from "../content.config";

/**
 * Resolves the resume entry to display on the page and returns its data
 * together with the rendered Content component.
 *
 * Why sorting by id:
 *   `getCollection()` does not guarantee a stable ordering — it reflects
 *   filesystem enumeration, which varies by OS and CI environment. Sorting
 *   alphabetically by the entry id (the filename without extension) makes the
 *   selection deterministic.
 *
 * Why picking the first entry:
 *   The site currently has exactly one resume in `src/content/resumes/`.
 *   If multiple resumes are added later, this utility would be replaced by
 *   a slug-based lookup — not extended with filtering here.
 *
 * Throws loudly when the directory is empty so the build fails with a clear
 * message rather than rendering a blank page.
 */
export async function getResumeEntry() {
  const entries = await getCollection("resumes");

  if (entries.length === 0) {
    throw new Error(
      "No resume file found in src/content/resumes/. Add a .md file there to build the site.",
    );
  }

  const [entry] = entries.sort((a, b) => a.id.localeCompare(b.id));
  const { Content } = await render(entry);
  const data: ResumeData = entry.data;

  return { Content, ...data };
}
