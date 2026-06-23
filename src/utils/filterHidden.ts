import type { ResumeData } from "@utils/resumeSchema";

/**
 * Strips items marked `hidden: true` from every list section.
 * Applied unconditionally to both the full and onepage variants before rendering.
 * Returns a new object; the input is never mutated.
 */
export function filterHidden(data: ResumeData): ResumeData {
  return {
    ...data,
    experience: data.experience.filter((e) => !e.hidden),
    education: data.education?.filter((e) => !e.hidden),
    certifications: data.certifications?.filter((c) => !c.hidden),
  };
}
