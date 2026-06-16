import { z } from "astro/zod";

export const TEMPLATE_NAMES = ["classic", "timeline", "onepage"] as const;
export type TemplateName = (typeof TEMPLATE_NAMES)[number];

export const templateConfigSchema = z.object({
  name: z.enum(TEMPLATE_NAMES),
  sidebarPosition: z.enum(["left", "right"]).optional(),
});

export type TemplateConfig = z.infer<typeof templateConfigSchema>;

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
    template: templateConfigSchema,
    contact: z.array(z.object({ value: z.string() })).optional(),
    profile: profileSchema.optional(),
    skills: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    hobbies: z.array(z.string()).optional(),
    experience: z.array(experienceSchema).optional(),
    education: z.array(educationSchema).optional(),
    certifications: z.array(certificationSchema).optional(),
  })
  .strict();

export type ResumeData = z.infer<typeof resumeSchema>;
export type ProfileData = z.infer<typeof profileSchema>;
export type LinkEntry = z.infer<typeof linkSchema>;
export type ExperienceEntry = z.infer<typeof experienceSchema>;
export type EducationEntry = z.infer<typeof educationSchema>;
export type CertificationEntry = z.infer<typeof certificationSchema>;
