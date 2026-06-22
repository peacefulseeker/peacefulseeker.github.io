import { describe, test, expect, vi, beforeEach } from "vitest";

// resolveOtherVersion calls resumeVariantExists, which reaches into
// astro:content. Mock that boundary so these stay pure unit tests.
const resumeVariantExists = vi.fn();
vi.mock("./getResumeEntry", () => ({
  resumeVariantExists: (...args: unknown[]) => resumeVariantExists(...args),
}));

const { resolveOtherVersion } = await import("./resumeView");

beforeEach(() => {
  resumeVariantExists.mockReset();
});

describe("resolveOtherVersion", () => {
  test("links to the one-page version from the full route", async () => {
    resumeVariantExists.mockResolvedValue(true);

    expect(await resolveOtherVersion("onepage", "/")).toEqual({
      href: "/resume/",
      label: "One-page version",
    });
  });

  test("links to the full version from the one-page route", async () => {
    resumeVariantExists.mockResolvedValue(true);

    expect(await resolveOtherVersion("full", "/")).toEqual({
      href: "/resume/full/",
      label: "Full version",
    });
  });

  test("prefixes the site base onto the href", async () => {
    resumeVariantExists.mockResolvedValue(true);

    expect((await resolveOtherVersion("full", "/my-site/"))?.href).toBe(
      "/my-site/resume/full/",
    );
  });

  test("returns undefined when the target variant does not exist", async () => {
    resumeVariantExists.mockResolvedValue(false);

    expect(await resolveOtherVersion("onepage", "/")).toBeUndefined();
  });
});
