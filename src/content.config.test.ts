import { describe, test, expect } from "vitest";
import { resumeSchema, TEMPLATE_NAMES } from "./utils/resumeSchema";

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

describe("TEMPLATE_NAMES", () => {
  test("contains classic, timeline and onepage", () => {
    expect(TEMPLATE_NAMES).toEqual(["classic", "timeline", "onepage"]);
  });
});

describe("resumeSchema — template field", () => {
  test('accepts { name: "classic" }', () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      full_template: { name: "classic" },
    });
    expect(result.success).toBe(true);
  });

  test('accepts { name: "timeline", sidebarPosition: "right" }', () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      full_template: { name: "timeline", sidebarPosition: "right" },
    });
    expect(result.success).toBe(true);
  });

  test('accepts { name: "onepage" }', () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      full_template: { name: "onepage" },
    });
    expect(result.success).toBe(true);
  });

  test("rejects bare string template (old format)", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      template: "classic",
    });
    expect(result.success).toBe(false);
  });

  test("rejects unknown template name", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      full_template: { name: "bogus" },
    });
    expect(result.success).toBe(false);
  });

  test("rejects invalid sidebarPosition value", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      full_template: { name: "timeline", sidebarPosition: "center" },
    });
    expect(result.success).toBe(false);
  });
});

describe("resumeSchema — contact field", () => {
  test("contact is optional", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      full_template: { name: "classic" },
    });
    expect(result.success).toBe(true);
  });

  test("accepts contact array when provided", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      full_template: { name: "classic" },
      contact: [{ value: "jane@example.com" }],
    });
    expect(result.success).toBe(true);
  });
});

describe("resumeSchema — profile field", () => {
  test("accepts profile with links", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      full_template: { name: "timeline" },
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
      full_template: { name: "timeline" },
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
      full_template: { name: "timeline" },
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
      full_template: { name: "timeline" },
    });
    expect(result.success).toBe(false);
  });

  test("rejects an empty experience array", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      full_template: { name: "timeline" },
      experience: [],
    });
    expect(result.success).toBe(false);
  });

  test("accepts certifications with optional fields", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      full_template: { name: "timeline" },
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
      full_template: { name: "timeline" },
      certifications: [{ name: "AWS CCP", url: "not-a-url" }],
    });
    expect(result.success).toBe(false);
  });

  test("accepts skills, languages, hobbies arrays", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      full_template: { name: "timeline" },
      skills: ["Python", "TypeScript"],
      languages: ["English (C1)"],
      hobbies: ["Hiking"],
    });
    expect(result.success).toBe(true);
  });
});
