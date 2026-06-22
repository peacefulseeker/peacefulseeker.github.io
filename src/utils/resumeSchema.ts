import { z } from "astro/zod";

/**
 * A resume is rendered along two orthogonal axes (see ADR 0008):
 * - `theme`   — the visual identity, chosen in frontmatter (classic | timeline).
 * - `density` — the content/spacing budget, chosen by route: `/resume` renders
 *   the onepage density, `/resume/full` the full density. Same layout, same
 *   markup; density only changes how much content shows and how generous the
 *   spacing is.
 */
export const THEME_NAMES = ["classic", "timeline"] as const;
export type ThemeName = (typeof THEME_NAMES)[number];

export const DENSITIES = ["onepage", "full"] as const;
export type Density = (typeof DENSITIES)[number];

export const themeConfigSchema = z.object({
  name: z.enum(THEME_NAMES),
  sidebarPosition: z.enum(["left", "right"]).optional(),
});

export type ThemeConfig = z.infer<typeof themeConfigSchema>;

const linkSchema = z.object({
  label: z.string(),
  url: z.url(),
});

const profileSchema = z.object({
  photo: z.string().optional(),
  location: z.string().optional(),
  email: z.email().optional(),
  links: z.array(linkSchema).optional(),
});

export const experienceSchema = z.object({
  role: z.string(),
  company: z.string(),
  location: z.string().optional(),
  start: z.string(),
  end: z.string(),
  highlights: z.array(z.string()),
  onepage_include: z.boolean().default(true),
  onepage_highlights_num: z.number().int().positive().optional(),
  tech: z.array(z.string()).optional(),
});

export const educationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  location: z.string().optional(),
  start: z.string(),
  end: z.string(),
  note: z.string().optional(),
  url: z.url().optional(),
});

export const certificationSchema = z.object({
  name: z.string(),
  issuer: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  credentialId: z.string().optional(),
  url: z.url().optional(),
});

export const resumeSchema = z
  .object({
    name: z.string(),
    role: z.string(),
    theme: themeConfigSchema,
    profile: profileSchema.optional(),
    summary_short: z.string().optional(),
    skills: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    hobbies: z.array(z.string()).optional(),
    experience: z.array(experienceSchema).min(1),
    education: z.array(educationSchema).optional(),
    certifications: z.array(certificationSchema).optional(),
  })
  .strict();

export type ResumeData = z.infer<typeof resumeSchema>;

/**
 * Props for the single `ResumeLayout`, shared by both routes. The layout is
 * driven by `theme` (CSS identity) + `density` (content/spacing budget); the
 * `theme` config object is unpacked into those two scalars by the page so the
 * layout never re-reads frontmatter. `otherVersion` is the cross-link to the
 * other density (the toggle).
 */
export type ResumeLayoutProps = Omit<ResumeData, "theme"> & {
  theme: ThemeName;
  density: Density;
  sidebarPosition?: ThemeConfig["sidebarPosition"];
  otherVersion?: { href: string; label: string };
};

export type ProfileData = z.infer<typeof profileSchema>;
export type LinkEntry = z.infer<typeof linkSchema>;
export type ExperienceEntry = z.infer<typeof experienceSchema>;
export type EducationEntry = z.infer<typeof educationSchema>;
export type CertificationEntry = z.infer<typeof certificationSchema>;
