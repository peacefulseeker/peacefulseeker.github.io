import { describe, test, expect } from "vitest";
import { resumeSchema, THEME_NAMES } from "./utils/resumeSchema";

const validBase = {
  name: "Jane Doe",
  role: "Software Engineer",
  // experience is required (min 1); include one so the base parses cleanly.
  experience: [
    {
      role: "Engineer",
      company: "Acme",
      start: "2020",
      end: "Present",
      highlights: ["Built things"],
    },
  ],
};

describe("THEME_NAMES", () => {
  test("contains classic and timeline (onepage is a density, not a theme)", () => {
    expect(THEME_NAMES).toEqual(["classic", "timeline"]);
  });
});

describe("resumeSchema — theme field", () => {
  test('accepts { name: "classic" }', () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      theme: { name: "classic" },
    });
    expect(result.success).toBe(true);
  });

  test('accepts { name: "timeline", sidebarPosition: "right" }', () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      theme: { name: "timeline", sidebarPosition: "right" },
    });
    expect(result.success).toBe(true);
  });

  test('rejects "onepage" as a theme (it is a density now)', () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      theme: { name: "onepage" },
    });
    expect(result.success).toBe(false);
  });

  test("rejects the old full_template key (renamed to theme)", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      full_template: { name: "classic" },
    });
    expect(result.success).toBe(false);
  });

  test("rejects unknown theme name", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      theme: { name: "bogus" },
    });
    expect(result.success).toBe(false);
  });

  test("rejects invalid sidebarPosition value", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      theme: { name: "timeline", sidebarPosition: "center" },
    });
    expect(result.success).toBe(false);
  });
});

describe("resumeSchema — contact model", () => {
  test("rejects the removed legacy contact[] field (single model: profile.links)", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      theme: { name: "classic" },
      contact: [{ value: "jane@example.com" }],
    });
    expect(result.success).toBe(false);
  });
});

describe("resumeSchema — profile field", () => {
  test("accepts profile with links", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      theme: { name: "timeline" },
      profile: {
        photo: "/profile.jpg",
        location: "Remote",
        links: [{ label: "LinkedIn", url: "https://linkedin.com/in/janedoe" }],
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects profile link with invalid URL", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      theme: { name: "timeline" },
      profile: {
        links: [{ label: "LinkedIn", url: "not-a-url" }],
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("resumeSchema — structured sections", () => {
  test("accepts experience array", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      theme: { name: "timeline" },
      experience: [
        {
          role: "Engineer",
          company: "Acme",
          start: "2020",
          end: "Present",
          highlights: ["Built things"],
          tech: ["TypeScript"],
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  test("rejects a resume with no experience field", () => {
    const result = resumeSchema.safeParse({
      name: "Jane Doe",
      role: "Software Engineer",
      theme: { name: "timeline" },
    });
    expect(result.success).toBe(false);
  });

  test("rejects an empty experience array", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      theme: { name: "timeline" },
      experience: [],
    });
    expect(result.success).toBe(false);
  });

  test("accepts certifications with optional fields", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      theme: { name: "timeline" },
      certifications: [
        {
          name: "AWS CCP",
          issuer: "AWS",
          start: "2022",
          end: "2028",
          credentialId: "ABC123",
          url: "https://example.com/verify/ABC123",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  test("rejects certification with invalid URL", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      theme: { name: "timeline" },
      certifications: [{ name: "AWS CCP", url: "not-a-url" }],
    });
    expect(result.success).toBe(false);
  });

  test("accepts skills, languages, hobbies arrays", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      theme: { name: "timeline" },
      skills: ["Python", "TypeScript"],
      languages: ["English (C1)"],
      hobbies: ["Hiking"],
    });
    expect(result.success).toBe(true);
  });
});
