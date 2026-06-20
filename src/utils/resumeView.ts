import { resumeVariantExists } from "./getResumeEntry";
import { TEMPLATE_NAMES } from "./resumeSchema";
import type { FullTemplate, TemplateName } from "./resumeSchema";

type Variant = "full" | "onepage";

const VARIANT_LABEL: Record<Variant, string> = {
  full: "Full version",
  onepage: "One-page version",
};

/** Path of each variant, relative to the site base. */
const VARIANT_PATH: Record<Variant, string> = {
  full: "resume/full/",
  onepage: "resume/",
};

/**
 * Builds the cross-link to the *other* resume variant, or `undefined` when that
 * variant does not exist (so the toggle is hidden).
 *
 * `base` is passed in rather than read from `import.meta.env` here so the
 * function stays a pure, unit-testable mapping. Call sites pass
 * `import.meta.env.BASE_URL`.
 */
export async function resolveOtherVersion(
  variant: Variant,
  base: string,
): Promise<{ href: string; label: string } | undefined> {
  if (!(await resumeVariantExists(variant))) return undefined;
  return {
    href: `${base}${VARIANT_PATH[variant]}`,
    label: VARIANT_LABEL[variant],
  };
}

/**
 * Narrows a template name to a full-route template, throwing loudly otherwise
 * so the build fails with a clear message instead of rendering a blank page.
 * "onepage" is served from /resume (ADR 0006), never the full route.
 */
export function assertFullTemplate(
  name: TemplateName,
): asserts name is FullTemplate {
  if (name === "onepage") {
    const valid = TEMPLATE_NAMES.filter((t) => t !== "onepage").join(", ");
    throw new Error(
      `Unknown full-route template "${name}". Valid templates: ${valid}`,
    );
  }
}
