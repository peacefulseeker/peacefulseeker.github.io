import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { resumeSchema } from "./utils/resumeSchema";

export { TEMPLATE_NAMES, resumeSchema } from "./utils/resumeSchema";
export type { TemplateName, ResumeData } from "./utils/resumeSchema";

const resumes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/resumes" }),
  schema: resumeSchema,
});

export const collections = { resumes };
