import { describe, expect, test } from "vitest";

import { filterHidden } from "@utils/filterHidden";
import { resumeSchema, type ResumeData } from "@utils/resumeSchema";

const baseExperience = {
  role: "Dev",
  company: "Acme",
  start: "2020",
  end: "2021",
  highlights: ["h1"],
};

function makeResume(overrides: Record<string, unknown>): ResumeData {
  return resumeSchema.parse({
    name: "Jane Doe",
    role: "Engineer",
    theme: { name: "classic" },
    experience: [baseExperience],
    ...overrides,
  });
}

describe("filterHidden — experience", () => {
  test("drops entries marked hidden: true", () => {
    const data = makeResume({
      experience: [
        { ...baseExperience, company: "Shown" },
        { ...baseExperience, company: "Hidden", hidden: true },
      ],
    });

    expect(filterHidden(data).experience.map((e) => e.company)).toEqual([
      "Shown",
    ]);
  });

  test("keeps entries when hidden is omitted (defaults to false)", () => {
    const data = makeResume({
      experience: [
        { ...baseExperience, company: "A" },
        { ...baseExperience, company: "B" },
      ],
    });

    expect(filterHidden(data).experience.map((e) => e.company)).toEqual([
      "A",
      "B",
    ]);
  });
});

describe("filterHidden — certifications", () => {
  test("drops certifications marked hidden: true", () => {
    const data = makeResume({
      certifications: [{ name: "AWS" }, { name: "Azure", hidden: true }],
    });

    expect(filterHidden(data).certifications?.map((c) => c.name)).toEqual([
      "AWS",
    ]);
  });

  test("passes through when no certifications are hidden", () => {
    const data = makeResume({
      certifications: [{ name: "AWS" }, { name: "GCP" }],
    });

    expect(filterHidden(data).certifications).toHaveLength(2);
  });
});

describe("filterHidden — education", () => {
  test("drops education entries marked hidden: true", () => {
    const data = makeResume({
      education: [
        { degree: "BSc", institution: "Uni", start: "2010", end: "2014" },
        {
          degree: "MSc",
          institution: "Uni",
          start: "2015",
          end: "2017",
          hidden: true,
        },
      ],
    });

    expect(filterHidden(data).education?.map((e) => e.degree)).toEqual(["BSc"]);
  });
});

describe("filterHidden — purity", () => {
  test("does not mutate the input", () => {
    const data = makeResume({
      certifications: [{ name: "AWS", hidden: true }],
    });

    filterHidden(data);

    expect(data.certifications).toHaveLength(1);
  });
});
