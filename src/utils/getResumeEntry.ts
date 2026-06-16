import { getCollection, render } from "astro:content";
import type { ResumeData } from "../content.config";

type Variant = "full" | "onepage";

/**
 * A resume is the "onepage" variant when its template is the onepage layout.
 * Everything else (classic, timeline) is treated as the "full" variant. This
 * keeps the full/onepage split keyed off the rendering contract rather than a
 * filename convention.
 */
const isOnepage = (entry: { data: ResumeData }) =>
  entry.data.template.name === "onepage";

async function selectEntry(variant: Variant) {
  const entries = await getCollection("resumes");
  const pool = entries.filter((e) =>
    variant === "onepage" ? isOnepage(e) : !isOnepage(e),
  );

  // Sort by id so selection is deterministic across OS/CI filesystem ordering.
  return pool.sort((a, b) => a.id.localeCompare(b.id))[0];
}

/**
 * Resolves the resume entry to display and returns its data together with the
 * rendered Content component.
 *
 * `variant` selects which file to render: "full" picks the classic/timeline
 * resume (the default landing is the one-pager, with /full serving this), and
 * "onepage" picks the trimmed one-page resume.
 *
 * Throws loudly when no matching file exists so the build fails with a clear
 * message rather than rendering a blank page.
 */
export async function getResumeEntry(variant: Variant = "full") {
  const entry = await selectEntry(variant);

  if (!entry) {
    throw new Error(
      `No "${variant}" resume found in src/content/resumes/. ` +
        (variant === "onepage"
          ? "Add a .md file with `template.name: onepage` to build the /onepage view."
          : "Add a .md file with a classic or timeline template to build the site."),
    );
  }

  const { Content } = await render(entry);
  const data: ResumeData = entry.data;

  return { Content, ...data };
}

/**
 * Whether a resume of the given variant exists. Used to decide whether to show
 * the cross-link toggle between the full and one-page views, so we never render
 * a link to a route that wasn't generated.
 */
export async function resumeVariantExists(variant: Variant): Promise<boolean> {
  return (await selectEntry(variant)) !== undefined;
}
