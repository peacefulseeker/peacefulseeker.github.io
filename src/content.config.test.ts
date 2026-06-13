import { describe, test, expect } from "vitest";
import { resumeSchema, TEMPLATE_NAMES } from "./utils/resumeSchema";

const validBase = {
  name: "Jane Doe",
  role: "Software Engineer",
  contact: [{ value: "jane@example.com" }],
};

describe("TEMPLATE_NAMES", () => {
  test("contains minimal and classic", () => {
    expect(TEMPLATE_NAMES).toEqual(["minimal", "classic"]);
  });
});

describe("resumeSchema — template field", () => {
  test('accepts "minimal"', () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      template: "minimal",
    });
    expect(result.success).toBe(true);
  });

  test('accepts "classic"', () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      template: "classic",
    });
    expect(result.success).toBe(true);
  });

  test('rejects "default" (old value)', () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      template: "default",
    });
    expect(result.success).toBe(false);
  });

  test("rejects unknown template value", () => {
    const result = resumeSchema.safeParse({
      ...validBase,
      template: "bogus",
    });
    expect(result.success).toBe(false);
  });
});
