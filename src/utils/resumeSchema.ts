import { z } from "astro/zod";

export const TEMPLATE_NAMES = ["minimal", "classic"] as const;
export type TemplateName = (typeof TEMPLATE_NAMES)[number];

export const resumeSchema = z
  .object({
    name: z.string(),
    role: z.string(),
    template: z.enum(TEMPLATE_NAMES),
    contact: z.array(z.object({ value: z.string() })),
  })
  .strict();

export type ResumeData = z.infer<typeof resumeSchema>;
