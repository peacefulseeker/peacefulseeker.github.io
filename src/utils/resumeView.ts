import { resumeVariantExists } from "@utils/getResumeEntry";

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
