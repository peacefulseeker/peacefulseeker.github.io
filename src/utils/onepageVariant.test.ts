import { describe, test, expect } from "vitest";
import { applyOnepageVariant } from "./onepageVariant";
import { resumeSchema, type ResumeData } from "./resumeSchema";

/**
 * Builds a fully-parsed ResumeData so schema defaults (notably
 * `onepage_include` → true) are applied exactly as they are at build time.
 */
function makeResume(experience: unknown[]): ResumeData {
  return resumeSchema.parse({
    name: "Jane Doe",
    role: "Engineer",
    full_template: { name: "classic" },
    experience,
  });
}

const entry = (overrides: Record<string, unknown>) => ({
  role: "Engineer",
  company: "Acme",
  start: "2020",
  end: "2021",
  highlights: ["h1", "h2", "h3"],
  ...overrides,
});

describe("applyOnepageVariant — entry exclusion", () => {
  test("drops entries marked onepage_include: false", () => {
    const data = makeResume([
      entry({ company: "Hidden", onepage_include: false }),
      entry({ company: "Shown" }),
    ]);

    expect(applyOnepageVariant(data).experience.map((e) => e.company)).toEqual([
      "Shown",
    ]);
  });

  test("keeps entries when onepage_include is omitted (defaults to true)", () => {
    const data = makeResume([entry({ company: "A" }), entry({ company: "B" })]);

    expect(applyOnepageVariant(data).experience.map((e) => e.company)).toEqual([
      "A",
      "B",
    ]);
  });

  test("preserves the order of included entries", () => {
    const data = makeResume([
      entry({ company: "First" }),
      entry({ company: "Skip", onepage_include: false }),
      entry({ company: "Second" }),
    ]);

    expect(applyOnepageVariant(data).experience.map((e) => e.company)).toEqual([
      "First",
      "Second",
    ]);
  });
});

describe("applyOnepageVariant — highlight truncation", () => {
  test("keeps only the first N highlights when onepage_highlights_num is set", () => {
    const data = makeResume([
      entry({ highlights: ["a", "b", "c", "d"], onepage_highlights_num: 2 }),
    ]);

    expect(applyOnepageVariant(data).experience[0].highlights).toEqual([
      "a",
      "b",
    ]);
  });

  test("keeps all highlights when onepage_highlights_num is omitted", () => {
    const data = makeResume([entry({ highlights: ["a", "b", "c"] })]);

    expect(applyOnepageVariant(data).experience[0].highlights).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  test("keeps all highlights when the count exceeds the list length", () => {
    const data = makeResume([
      entry({ highlights: ["a", "b"], onepage_highlights_num: 5 }),
    ]);

    expect(applyOnepageVariant(data).experience[0].highlights).toEqual([
      "a",
      "b",
    ]);
  });
});

describe("applyOnepageVariant — purity & passthrough", () => {
  test("does not mutate the input data", () => {
    const data = makeResume([
      entry({ highlights: ["a", "b", "c"], onepage_highlights_num: 1 }),
    ]);

    applyOnepageVariant(data);

    expect(data.experience[0].highlights).toEqual(["a", "b", "c"]);
  });

  test("preserves non-experience fields", () => {
    const data: ResumeData = {
      ...makeResume([entry({})]),
      summary_short: "Short summary.",
      skills: ["Python"],
    };

    const result = applyOnepageVariant(data);

    expect(result.summary_short).toBe("Short summary.");
    expect(result.skills).toEqual(["Python"]);
  });
});
