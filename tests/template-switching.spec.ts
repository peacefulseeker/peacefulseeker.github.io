import { expect, test } from "@playwright/test";

import { THEME_NAMES } from "@utils/resumeSchema";

// Expected body background per theme (the --r-bg token in resume.css). Kept
// here as the single source of truth for the styling assertions so the tests
// stay theme-agnostic: they verify whatever theme is active resolves its own
// background, rather than assuming the frontmatter default. ?template= can make
// any theme the active one (ADR 0010), so no test may hardcode a single theme.
const THEME_BG: Record<(typeof THEME_NAMES)[number], string> = {
  timeline: "rgb(243, 244, 246)", // #f3f4f6
  classic: "rgb(245, 245, 240)", // #f5f5f0
};

test.describe("Theme × density — active view renders all fields", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/resume/full");
  });

  test("renders name in h1", async ({ page }) => {
    const h1 = page.locator("h1.resume-name");
    await expect(h1).toContainText("Alexey Vorobyov");
  });

  test("renders role in the header", async ({ page }) => {
    const role = page.locator("header .resume-role");
    await expect(role).toContainText("Senior Software Engineer");
  });

  test("renders all body sections (Summary, Experience, Education)", async ({
    page,
  }) => {
    for (const heading of ["Summary", "Experience", "Education"]) {
      const section = page.locator(`h2:has-text("${heading}")`);
      await expect(section).toBeVisible();
    }
  });

  test("body content appears after header", async ({ page }) => {
    const headerBox = await page.locator("header.resume-header").boundingBox();
    const bodyBox = await page.locator("main h2").first().boundingBox();

    expect(headerBox).not.toBeNull();
    expect(bodyBox).not.toBeNull();
    expect(headerBox!.y).toBeLessThan(bodyBox!.y);
  });

  // The default (no ?template=) view carries a valid theme + the density from
  // the route, whatever the frontmatter theme happens to be. Theme-agnostic: it
  // asserts the shape, not a specific theme.
  test("body carries a valid theme class and the full density class", async ({
    page,
  }) => {
    const className = await page.locator("body").getAttribute("class");
    expect(className).toMatch(/^theme-(classic|timeline) density-full$/);
  });
});

test.describe("?template= query param switching", () => {
  // Every theme must render (and resolve its background) as the active theme
  // when selected via ?template=, on both routes/densities.
  for (const theme of THEME_NAMES) {
    test(`?template=${theme} on /resume/full → theme-${theme} density-full`, async ({
      page,
    }) => {
      await page.goto(`/resume/full?template=${theme}`);
      const className = await page.locator("body").getAttribute("class");
      expect(className).toBe(`theme-${theme} density-full`);

      const bg = await page
        .locator("body")
        .evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(bg).toBe(THEME_BG[theme]);
    });

    test(`?template=${theme} on /resume → theme-${theme} density-onepage`, async ({
      page,
    }) => {
      await page.goto(`/resume?template=${theme}`);
      const className = await page.locator("body").getAttribute("class");
      expect(className).toBe(`theme-${theme} density-onepage`);
    });
  }

  test("?template=invalid leaves the default theme unchanged", async ({
    page,
  }) => {
    await page.goto("/resume/full");
    const defaultClass = await page.locator("body").getAttribute("class");

    await page.goto("/resume/full?template=not-a-theme");
    const afterInvalid = await page.locator("body").getAttribute("class");

    expect(afterInvalid).toBe(defaultClass);
  });

  test("density toggle preserves ?template= in its href", async ({ page }) => {
    // Pick a theme that is not the frontmatter default so the override is real.
    await page.goto("/resume/full");
    const defaultClass =
      (await page.locator("body").getAttribute("class")) ?? "";
    const other =
      THEME_NAMES.find((t) => !defaultClass.includes(`theme-${t}`)) ??
      THEME_NAMES[0];

    await page.goto(`/resume/full?template=${other}`);
    const toggleHref = await page
      .locator(".version-toggle")
      .getAttribute("href");
    expect(toggleHref).toContain(`template=${other}`);
  });
});
