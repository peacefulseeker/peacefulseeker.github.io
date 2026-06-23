import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

import { resumeSchema } from "@utils/resumeSchema";

export { THEME_NAMES, DENSITIES, resumeSchema } from "@utils/resumeSchema";
export type { ThemeName, Density, ResumeData } from "@utils/resumeSchema";

const resumes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/resumes" }),
  schema: resumeSchema,
});

export const collections = { resumes };
